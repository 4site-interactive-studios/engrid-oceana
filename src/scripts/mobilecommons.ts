/**
 * MobileCommons integration module for ENGrid forms. 
 * This module listens for form submissions and sends supporter data to MobileCommons using their API.
 * It maps ENGrid fields to MobileCommons fields based on a defined mapping.
 */
import {
  EngridLogger,
  ENGrid,
  EnForm,
} from "@4site/engrid-scripts";

interface MobileCommonsOptions {
  opt_in_paths: {
    [key: string]: string; // You can set specific page IDs as keys or use 'default' for a fallback opt-in path. Setting a page id to "" will disable Mobile Commons for that page.
  };
}
interface MobileCommonsFieldMapping {
  [key: string]: {
    name: string;// The ENGrid field name to pull the value from
    custom?: boolean;// If true, the field will be included in the person[custom_fields] JSON object instead of as a top-level field
    required?: boolean;// If true, the Mobile Commons submission will be blocked if this field is missing or empty
  };
}

export default class MobileCommons {
  private logger: EngridLogger = new EngridLogger(
    "MobileCommons",
    "blue",
    "lightblue",
    "💬"
  );

  private endpoint = "https://secure.mcommons.com/profiles/join";
  private wasCalled = false; // True if the API endpoint was called
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
    "no_fundraising_ask": { name: "supporter.questions.1495752", custom: true },
    "sailors_for_the_sea_sms": { name: "supporter.questions.2156746", custom: true },
  };

  private options: MobileCommonsOptions;
  constructor(options: MobileCommonsOptions) {
    this.options = options;
    if(!this.shouldRun()) return;
    this.addEventListeners();
  }

  private shouldRun() {
    if(!this.options.opt_in_paths) return false;
    const hasPhoneNumber = ENGrid.getField("supporter.phoneNumber2") !== undefined;
    const hasOptInPath = this.options.opt_in_paths.default !== undefined || ENGrid.getPageID() && this.options.opt_in_paths[ENGrid.getPageID().toString()] !== undefined && this.options.opt_in_paths[ENGrid.getPageID().toString()] !== "";
    return hasPhoneNumber && hasOptInPath;
  }

  private addEventListeners() {
    this.logger.log("Initializing Mobile Commons integration");
    // Add event listener to submit
    this._form.onSubmit.subscribe(this.callAPI.bind(this));
    // Attach the API call event to the Give By Select to anticipate the use of Digital Wallets
    const transactionGiveBySelect = document.getElementsByName(
      "transaction.giveBySelect"
    ) as NodeListOf<HTMLInputElement>;
    if (transactionGiveBySelect) {
      transactionGiveBySelect.forEach((giveBySelect) => {
        giveBySelect.addEventListener("change", () => {
          if (
            ["stripedigitalwallet", "paypaltouch"].includes(
              giveBySelect.value.toLowerCase()
            )
          ) {
            this.logger.log("Clicked Digital Wallet Button");
            window.setTimeout(() => {
              this.callAPI();
            }, 500);
          }
        });
      });
    }
  }
  
  public callAPI() {
    if (this.wasCalled) return;
    if (!this._form.submit) {
      this.logger.log("Form Submission Interrupted by Other Component");
      return;
    }

    const multipartData = new FormData();
    // Map ENGrid fields to Mobile Commons fields based on the defined field mapping
    let missingRequiredField = false;
    const customFields: { [key: string]: any } = {};
    for (const [mcField, engridField] of Object.entries(MobileCommons.fieldMapping)) {
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

    const smsField = document.querySelector('.en__field--sms input[type="checkbox"]') as HTMLInputElement | null;
    const sailorsField = document.querySelector('.en__field--sailors-for-the-sea-sms input[type="checkbox"]') as HTMLInputElement | null;
    if (!smsField?.checked && !sailorsField?.checked) {
      this.logger.warn("At least one SMS opt-in checkbox must be selected.");
      missingRequiredField = true;
    }

    if (missingRequiredField) {
      this.logger.warn("Skipping Mobile Commons submission due to missing required fields.");
      return;
    }

    if (Object.keys(customFields).length > 0) {
      multipartData.append("person[custom_fields]", JSON.stringify(customFields));
    }

    this.logger.log("Prepared data for Mobile Commons submission:\n", Object.fromEntries(multipartData.entries()), "\nCustom Fields:\n", customFields);

    // Determine the opt-in path based on the current page
    const pageId = ENGrid.getPageID().toString();
    const optInPath = this.options.opt_in_paths[pageId] || this.options.opt_in_paths['default'];
    multipartData.append("opt_in_path_id", optInPath);
    this.logger.log(`Using opt-in path: ${optInPath} for page ID: ${pageId}`);

    this.wasCalled = true;

    const ret = this.fetchTimeOut(this.endpoint, {
      method: "POST",
      body: multipartData,
    }).then((response) => {
      return response.text();
    }).then(async (data) => {
      this.logger.log("API response", data);
    }).catch((error) => {
      if (error.toString().includes("AbortError")) {
        // fetch aborted due to timeout
        this.logger.log("Fetch aborted");
      }
      this.logger.log("Error calling Mobile Commons API", error);
    });
    this._form.submitPromise = ret;
    return ret;
  }
  private fetchTimeOut(url: RequestInfo, params?: RequestInit) {
    const abort = new AbortController();
    const signal = abort.signal;
    params = { ...params, signal };
    const promise = fetch(url, params);
    if (signal) signal.addEventListener("abort", () => abort.abort());
    const timeout = setTimeout(() => abort.abort(), this.timeout * 1000);
    return promise.finally(() => clearTimeout(timeout));
  }
}