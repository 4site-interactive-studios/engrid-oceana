/**
 * MobileCommons integration module for ENGrid forms.
 * This module listens for form submissions and sends supporter data to MobileCommons using their API.
 * It maps ENGrid fields to MobileCommons fields based on a defined mapping.
 */
import { EngridLogger, ENGrid, EnForm } from "@4site/engrid-scripts";

interface MobileCommonsOptions {
  opt_in_paths: {
    [key: string]: string; // You can set specific page IDs as keys or use 'default' for a fallback opt-in path. Setting a page id to "" will disable Mobile Commons for that page.
  };
}
interface MobileCommonsFieldMapping {
  [key: string]: {
    name: string; // The ENGrid field name to pull the value from
    custom?: boolean; // If true, the field will be included in the person[custom_fields] JSON object instead of as a top-level field
    required?: boolean; // If true, the Mobile Commons submission will be blocked if this field is missing or empty
  };
}
declare global {
  interface Window {
    EngagingNetworks: any;
  }
}
export default class MobileCommons {
  private logger: EngridLogger = new EngridLogger(
    "MobileCommons",
    "blue",
    "lightblue",
    "💬"
  );

  private listeningForDAF = false;
  private listeningForStripeDigialWallets = false;
  private listeningForPayPalTouch = false;

  private endpoint = "https://secure.mcommons.com/profiles/join";
  // Once true the API will not be called again for this page load.
  // This is intentional to prevent duplicate SMS opt-ins even if the
  // user re-submits after a payment error.
  private wasCalled = false;
  private timeout = 5; // Seconds to API Timeout

  private _form: EnForm = EnForm.getInstance();

  private static fieldMapping: MobileCommonsFieldMapping = {
    "person[phone]": { name: "supporter.phoneNumber2", required: true },
    "person[email]": { name: "supporter.emailAddress" },
    "person[first_name]": { name: "supporter.firstName" },
    "person[last_name]": { name: "supporter.lastName" },
    "person[street1]": { name: "supporter.address1" },
    "person[city]": { name: "supporter.city" },
    "person[state]": { name: "supporter.region" },
    "person[postal_code]": { name: "supporter.postcode" },
    "person[country]": { name: "supporter.country" },
    no_fundraising_ask: { name: "supporter.questions.1495752", custom: true },
    sailors_for_the_sea_sms: {
      name: "supporter.questions.2156746",
      custom: true,
    },
  };

  private options: MobileCommonsOptions;
  constructor(options: MobileCommonsOptions) {
    this.options = options;
    if (!this.shouldRun()) return;
    this.addEventListeners();
  }

  private shouldRun() {
    if (!this.options.opt_in_paths) return false;

    const hasPhoneNumber = ENGrid.getField("supporter.phoneNumber2") !== null;

    const pageId = ENGrid.getPageID()?.toString();
    const pageSpecificPath = pageId
      ? this.options.opt_in_paths[pageId]
      : undefined;

    // A page explicitly set to "" disables MobileCommons for that page
    if (pageSpecificPath === "") return false;

    const hasOptInPath =
      pageSpecificPath !== undefined ||
      this.options.opt_in_paths.default !== undefined;

    // also verify at least one SMS checkbox exists on the page
    const smsField = document.querySelector(
      '.en__field--sms input[type="checkbox"]'
    ) as HTMLInputElement | null;
    const sailorsField = document.querySelector(
      '.en__field--sailors-for-the-sea-sms input[type="checkbox"]'
    ) as HTMLInputElement | null;
    const hasSmsCheckbox = smsField !== null || sailorsField !== null;

    const isThankYouPage = ENGrid.isThankYouPage();

    return hasPhoneNumber && hasOptInPath && hasSmsCheckbox && !isThankYouPage;
  }

  private addEventListeners() {
    this.logger.log("Initializing Mobile Commons integration");
    // Add event listener to submit - For standard form submissions
    this._form.onSubmit.subscribe(() => this.callAPI());
    // Attach the API call event to the Give By Select (or PaymentType) to anticipate the use of Digital Wallets.
    const transactionGiveBySelect = document.getElementsByName(
      "transaction.giveBySelect"
    ) as NodeListOf<HTMLInputElement>;
    const paymentTypeSelect = ENGrid.getField("transaction.paymenttype");
    if (transactionGiveBySelect && transactionGiveBySelect.length > 0) {
      this.logger.log(
        "Attaching event listeners to transaction.giveBySelect fields for payment type changes"
      );
      // Check initial value
      this.handlePaymentTypeChange(transactionGiveBySelect[0].value);
      // Handle changes
      transactionGiveBySelect.forEach((giveBySelect) => {
        giveBySelect.addEventListener("change", () => {
          this.handlePaymentTypeChange(giveBySelect.value);
        });
      });
    } else if (paymentTypeSelect) {
      this.logger.log(
        "Attaching event listener to transaction.paymenttype field for payment type changes"
      );
      // Check initial value
      const value = ENGrid.getFieldValue("transaction.paymenttype");
      if (value) {
        this.handlePaymentTypeChange(value);
      }
      // Handle changes
      paymentTypeSelect.addEventListener("change", (e) => {
        this.handlePaymentTypeChange((e.target as HTMLInputElement).value);
      });
    }
  }
  private handlePaymentTypeChange(value: string) {
    switch (value.toLowerCase()) {
      case "stripedigitalwallet":
        this.addStripeDigitalWalletListener();
        break;
      case "paypaltouch":
      case "paypal-onetouch":
      case "paypal-one-touch":
      case "paypalonetouch":
        this.addPaypalOneTouchListener();
        break;
      case "daf":
      case "dafpay":
        this.addDAFListener();
        break;
    }
  }
  private addPaypalOneTouchListener() {
    if (!this.listeningForPayPalTouch) {
      this.listeningForPayPalTouch = true;
      this.logger.log(
        "Activating PayPal Touch listener for Mobile Commons API call"
      );
      // Guard against null/undefined paypalTouch before accessing .library
      const paypalTouch =
        window.EngagingNetworks?.require?._defined?.enPaypalTouch?.paypalTouch;
      if (!paypalTouch?.library?.Buttons) {
        this.logger.warn(
          "PayPal Touch library not available, skipping listener"
        );
        return;
      }
      const buttons = paypalTouch.library.Buttons.bind(paypalTouch.library);
      paypalTouch.library.Buttons = (o: any) =>
        buttons({
          ...o,
          onClick: (d: any, a: any) => (
            this.logger.log(
              "PayPal Touch button clicked, sending Mobile Commons API call"
            ),
            this.callAPI(true),
            o.onClick && o.onClick(d, a)
          ),
        });
      paypalTouch.unloadButton && paypalTouch.unloadButton();
      paypalTouch.loadButton && paypalTouch.loadButton();
    }
  }
  private addStripeDigitalWalletListener() {
    if (!this.listeningForStripeDigialWallets) {
      this.logger.log(
        "Activating Stripe Digital Wallet listener for Mobile Commons API call"
      );
      this.listeningForStripeDigialWallets = true;
      window.EngagingNetworks?.require?._defined?.enStripeButtons?.stripeButtons?.paymentRequest?.on(
        "paymentmethod",
        () => {
          this.logger.log(
            "Stripe Digital Wallet payment method triggered, sending Mobile Commons API call"
          );
          this.callAPI(true);
        }
      );
    }
  }
  private addDAFListener() {
    if (!this.listeningForDAF) {
      this.logger.log("Activating DAF listener for Mobile Commons API call");
      this.listeningForDAF = true;
      document
        .getElementById("chariot-button")
        ?.addEventListener("click", () => {
          this.logger.log(
            "Chariot button clicked, sending Mobile Commons API call"
          );
          this.callAPI(true);
        });
    }
  }

  // changed from public to private since it is only called internally
  // added `isDigitalWallet` parameter to skip the `this._form.submit`
  // guard for digital wallet flows which fire before form submission starts.
  private callAPI(isDigitalWallet = false) {
    if (this.wasCalled) return;
    if (!isDigitalWallet && !this._form.submit) {
      this.logger.log("Form Submission Interrupted by Other Component");
      return;
    }

    const multipartData = new FormData();
    // Map ENGrid fields to Mobile Commons fields based on the defined field mapping
    let missingRequiredField = false;
    const customFields: { [key: string]: any } = {};
    for (const [mcField, engridField] of Object.entries(
      MobileCommons.fieldMapping
    )) {
      const value = ENGrid.getFieldValue(engridField.name);
      if (value) {
        if (engridField.custom) {
          customFields[mcField] = value;
        } else {
          multipartData.append(mcField, value);
        }
      } else if (engridField.required) {
        this.logger.warn(`Required field ${mcField} is missing.`);
        missingRequiredField = true;
      }
    }

    // only block if at least one checkbox is present but none are checked.
    // If neither checkbox exists on the page, shouldRun() already prevents initialization.
    const smsField = document.querySelector(
      '.en__field--sms input[type="checkbox"]'
    ) as HTMLInputElement | null;
    const sailorsField = document.querySelector(
      '.en__field--sailors-for-the-sea-sms input[type="checkbox"]'
    ) as HTMLInputElement | null;
    const smsChecked = smsField?.checked ?? false;
    const sailorsChecked = sailorsField?.checked ?? false;
    if (!smsChecked && !sailorsChecked) {
      this.logger.warn("At least one SMS opt-in checkbox must be selected.");
      missingRequiredField = true;
    }

    if (missingRequiredField) {
      this.logger.warn(
        "Skipping Mobile Commons submission due to missing required fields."
      );
      return;
    }

    if (Object.keys(customFields).length > 0) {
      multipartData.append(
        "person[custom_fields]",
        JSON.stringify(customFields)
      );
    }

    this.logger.log(
      "Prepared data for Mobile Commons submission:\n",
      Object.fromEntries(multipartData.entries()),
      "\nCustom Fields:\n",
      customFields
    );

    // Determine the opt-in path based on the current page
    const pageId = ENGrid.getPageID().toString();
    const optInPath =
      this.options.opt_in_paths[pageId] || this.options.opt_in_paths["default"];
    multipartData.append("opt_in_path", optInPath);
    this.logger.log(`Using opt-in path: ${optInPath} for page ID: ${pageId}`);

    this.wasCalled = true;

    const ret = this.fetchTimeOut(this.endpoint, {
      method: "POST",
      body: multipartData,
    })
      .then((response) => {
        return response.text();
      })
      .then(async (data) => {
        this.logger.log("API response", data);
      })
      .catch((error) => {
        if (error.toString().includes("AbortError")) {
          // fetch aborted due to timeout
          this.logger.log("Fetch aborted");
        }
        this.logger.log("Error calling Mobile Commons API", error);
      });
    this._form.submitPromise = ret;
    return ret;
  }

  // removed the circular signal.addEventListener("abort", ...) call
  // and the always-truthy `if (signal)` guard.
  private fetchTimeOut(url: RequestInfo, params?: RequestInit) {
    const abort = new AbortController();
    params = { ...params, signal: abort.signal };
    const promise = fetch(url, params);
    const timeout = setTimeout(() => abort.abort(), this.timeout * 1000);
    return promise.finally(() => clearTimeout(timeout));
  }
}
