import {
  Options,
  App,
  DonationFrequency,
  DonationAmount,
} from "@4site/engrid-scripts"; // Uses ENGrid via NPM
// import {
//   Options,
//   App,
//   DonationFrequency,
//   DonationAmount,
// } from "../../engrid/packages/scripts"; // Uses ENGrid via Visual Studio Workspace
import "./sass/main.scss";
import { customScript } from "./scripts/main";
import DonationLightboxForm from "./scripts/donation-lightbox-form";

const options: Options = {
  applePay: false,
  CapitalizeFields: true,
  ClickToExpand: true,
  CurrencySymbol: "$",
  CurrencySeparator: ".",
  ThousandsSeparator: ",",
  MediaAttribution: true,
  SkipToMainContentLink: true,
  SrcDefer: true,
  Plaid: true,
  // ProgressBar: true,
  TidyContact: {
    cid: "1ad9c6ab-a7ae-4da2-a1aa-065a140b2c27",
    phone_enable: true,
    address_enable: false,
    // phone_preferred_countries: ["us", "ca", "gb", "jp", "au"],
    phone_record_field: "supporter.NOT_TAGGED_5",
    phone_date_field: "supporter.NOT_TAGGED_6",
    phone_status_field: "supporter.NOT_TAGGED_7",
  },
  RememberMe: {
    checked: true,
    remoteUrl: "https://oceana.org/data-remember.html",
    fieldOptInSelectorTarget:
      "[data-engrid-page-type=donation] .en__field.en__field--postcode .en__field__element, .en__field.en__field--telephone .en__field__notice, .en__field .en__field__element--email",
    fieldOptInSelectorTargetLocation: "after",
    fieldClearSelectorTarget:
      "div.en__field--firstName div, div.en__field--email div",
    fieldClearSelectorTargetLocation: "after",
    fieldNames: [
      "supporter.firstName",
      "supporter.lastName",
      "supporter.address1",
      "supporter.address2",
      "supporter.city",
      "supporter.country",
      "supporter.region",
      "supporter.postcode",
      "supporter.emailAddress",
    ],
  },
  PreferredPaymentMethod: {
    preferredPaymentMethodField: "supporter.NOT_TAGGED_16",
  },
  Placeholders: {
    ".en__field--donationAmt.en__field--withOther .en__field__input--other":
      "Custom Amount",
  },
  MobileCTA: [
    {
      pageType: "DONATION",
      label: "Donate",
    },
    {
      pageType: "ADVOCACY",
      label: "Sign",
    },
  ],
  Debug: App.getUrlParameter("debug") == "true" ? true : false,
  onLoad: () => {
    (<any>window).DonationLightboxForm = DonationLightboxForm;
    customScript(App, DonationFrequency);
    if (App.getBodyData("subtheme") === "multistep") {
      new DonationLightboxForm(DonationAmount, DonationFrequency, App);
    }
  },
  onResize: () => console.log("Starter Theme Window Resized"),
};
new App(options);
