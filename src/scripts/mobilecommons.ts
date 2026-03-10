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
    [key: string]: string;
    default: string;
  };
}
interface MobileCommonsFieldMapping {
  [key: string]: {
    name: string;
    custom?: boolean;
    required?: boolean;
  };
}
const MOBILE_COMMONS_URL = "https://secure.mcommons.com/profiles/join";

export default class MobileCommons {
  private logger: EngridLogger = new EngridLogger(
    "MobileCommons",
    "blue",
    "lightblue",
    "💬"
  );

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
    EnForm.getInstance().onSubmit.subscribe(async () => await this.postToMC());
  }

  public async postToMC() {
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

    if (missingRequiredField) {
      this.logger.warn("Skipping Mobile Commons submission due to missing required fields.");
      return;
    }

    if (Object.keys(customFields).length > 0) {
      multipartData.append("person[custom_fields]", JSON.stringify(customFields));
    }

    this.logger.log("Prepared data for Mobile Commons submission:\n", multipartData);

    // Determine the opt-in path based on the current page
    const pageId = ENGrid.getPageID();
    const optInPath = this.options.opt_in_paths[pageId] || this.options.opt_in_paths['default'];
    multipartData.append("opt_in_path_id", optInPath);
    this.logger.log(`Using opt-in path: ${optInPath} for page ID: ${pageId}`);

    try {
      const response = await fetch(MOBILE_COMMONS_URL, {
        method: "POST",
        body: multipartData,
        signal: this.createTimeoutSignal(5000),
      });

      if (!response.ok) {
        this.logger.error(`Mobile Commons submission failed with status: ${response.status}`);
      } else {
        this.logger.log("Mobile Commons submission successful.");
      }
    } catch (error) {
      this.logger.error("Error submitting to Mobile Commons:", error);
    }
  }

  // Polyfill for fetch timeout using AbortController
  // Has greater support than the newer AbortSignal.timeout() method
  private createTimeoutSignal(timeout: number): AbortSignal {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), timeout);
    return controller.signal;
  }
}