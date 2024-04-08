// import { Options, App } from "@4site/engrid-common"; // Uses ENGrid via NPM
import { Options, App } from "../../engrid-scripts/packages/common"; // Uses ENGrid via Visual Studio Workspace
import "./sass/main.scss";
import { customScript } from "./scripts/main";

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
  Debug: App.getUrlParameter("debug") == "true" ? true : false,
  onLoad: () => customScript(App),
  onResize: () => console.log("Starter Theme Window Resized"),
};
new App(options);
