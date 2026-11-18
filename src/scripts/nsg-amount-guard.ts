/**
 * Keeps the donor's amount through Engaging Networks' Next Suggested Gift (NSG) swaps.
 *
 * On identified NSG visits, EN's enSuggestedGift rebuilds the amount buttons with
 * enjs.swapList("donationAmt", list, { ignoreCurrentValue: true }) at DOMContentLoaded
 * and on every transaction.recurrpay change (ENgrid sends one about 1s after it starts).
 * ignoreCurrentValue throws away whatever the donor picked or typed.
 *
 * - Once the donor has chosen an amount, those swaps keep the current value instead.
 *   A deliberate frequency change lets EN's suggestion for that frequency apply, until
 *   the donor edits the amount again. Upsells set their amount after the swap, so they
 *   need nothing special.
 * - Before EN's first swap, the suggested amounts are shown and EN's "[$]" label tokens
 *   are filled in, so donors don't see stale or blank buttons while the page loads.
 *
 * initNsgAmountGuard() must run synchronously when the bundle executes, before `new App()`.
 */

type Gift = { value: number; nextSuggestedGift: boolean };
type SwapItem = { label: string; value: number; selected: boolean };
type EnJs = {
  swapList(name: string, list: SwapItem[], options?: { ignoreCurrentValue?: boolean }): void;
  getFieldValue(name: string): string;
};

const FIELD = ".en__field--donationAmt";
const RADIO = 'input[name="transaction.donationAmt"]';
const OTHER = 'input[name="transaction.donationAmt.other"]';
const FREQUENCY = 'input[name="transaction.recurrfreq"], input[name="transaction.recurrpay"]';
const NSG_INITIALIZED = 'input[name="transaction.donationAmt.sgid"]'; // added by EN's NSG init

const page = window as any;
let donorChose = false;

function selectOther(field: Element) {
  const radios = field.querySelectorAll<HTMLInputElement>(RADIO);
  if (radios.length) radios[radios.length - 1].checked = true; // EN renders Other last
}

// Real donor input only: amount edits protect the amount, frequency changes release it.
function trackDonor(event: Event) {
  const input = event.target;
  if (!event.isTrusted || !(input instanceof HTMLInputElement)) return;
  if (input.matches(FREQUENCY)) {
    donorChose = false;
    return;
  }
  const field = input.closest(FIELD);
  if (!field) return;
  if (input.matches(OTHER)) {
    if (!input.value.trim()) return;
    selectOther(field); // before ENgrid runs, typing here doesn't select Other
  }
  donorChose = true;
}

// Fallback for input made before this bundle ran. If the donor both typed in Other and
// picked a button, the DOM can't say which came last: the box wins only if it has focus.
function readEarlierChoice(field: Element) {
  const box = field.querySelector<HTMLInputElement>(OTHER);
  const button = field.querySelector<HTMLInputElement>(`${RADIO}:checked`);
  const typed = !!box && box.value.trim() !== "" && box.value !== box.defaultValue;
  const picked = !!button && !button.defaultChecked;
  if (typed && (!picked || document.activeElement === box)) selectOther(field);
  donorChose = typed || picked;
}

function keepDonorAmount(en: EnJs) {
  const swapList = en.swapList;
  en.swapList = function (name, list, options) {
    if (name === "donationAmt" && donorChose && options?.ignoreCurrentValue) {
      options = { ...options, ignoreCurrentValue: false };
    }
    return swapList.call(this, name, list, options);
  };
}

// Only when both lists are usable: otherwise EN would keep this preview as its fallback list.
function showSuggestedAmounts(field: Element, en: EnJs, gifts: { single: Gift[]; recurring: Gift[] }) {
  if (gifts.single.length < 2 || gifts.recurring.length < 2) return;
  const recurring = (en.getFieldValue("recurrpay") || "").toUpperCase() === "Y"; // EN's rule
  const labels = field.querySelectorAll(".en__field__item:not(.en__field__item--other) label");
  const otherLabel = labels[labels.length - 1]?.textContent?.trim() || "Other";
  const list = (recurring ? gifts.recurring : gifts.single).map((gift) => ({
    label: gift.value < 0 ? otherLabel : `[$]${gift.value}`,
    value: gift.value,
    selected: gift.nextSuggestedGift,
  }));
  en.swapList("donationAmt", list, { ignoreCurrentValue: true });
}

// Same markup ENgrid's LiveCurrency produces, so later currency updates still apply.
function showLabels(field: Element) {
  const symbol = page.EngridOptions?.CurrencySymbol || "$";
  const span = `<span class="engrid-currency-symbol">${symbol}</span>`;
  field.querySelectorAll("label").forEach((label) => {
    if (label.innerHTML.includes("[$]")) label.innerHTML = label.innerHTML.split("[$]").join(span);
  });
  field.querySelector(".en__field__item--other")?.setAttribute("data-currency-symbol", symbol);
  field.setAttribute("data-early-labels", ""); // lets main.scss show the labels
}

export function initNsgAmountGuard(): void {
  if (page.__nsgAmountGuard) return;
  page.__nsgAmountGuard = true;

  const gifts = page.EngagingNetworks?.suggestedGift;
  const isNsg = Array.isArray(gifts?.single) && Array.isArray(gifts?.recurring);
  if (isNsg) {
    document.addEventListener("input", trackDonor, true);
    document.addEventListener("change", trackDonor, true);
  }

  const start = (en: EnJs) => {
    const field = document.querySelector(FIELD);
    if (!field) return;
    if (isNsg) keepDonorAmount(en);
    if (document.querySelector(NSG_INITIALIZED)) return; // EN already swapped: too late for the rest
    if (isNsg) {
      readEarlierChoice(field);
      showSuggestedAmounts(field, en, gifts);
    }
    showLabels(field);
  };

  // EN's loader can define enjs a moment after enPage.js runs; if so, wait for it.
  const en = page.EngagingNetworks?.require?._defined?.enjs;
  if (en) start(en);
  else page.EngagingNetworks?.require?.(["enjs"], start);
}
