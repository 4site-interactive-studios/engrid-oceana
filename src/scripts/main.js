import tippy from "tippy.js";

export const customScript = function (App, Frequency) {
  const freq = Frequency.getInstance();
  // console.log("ENGrid client scripts are executing");
  const tidepoolButton = document.querySelector(".tide-pool-wrapper button");
  if (tidepoolButton) {
    const loadingAnimation = () => {
      tidepoolButton.innerHTML = `<span class='loader-wrapper'><span class='loader loader-quart'></span><span class='submit-button-text-wrapper'>Sending...</span></span>`;
    };
    tidepoolButton.addEventListener("click", (e) => {
      e.preventDefault();
      loadingAnimation();
      let formData = new URLSearchParams();
      formData.append("supporter.firstName", tidepoolButton.dataset.firstname);
      formData.append("supporter.lastName", tidepoolButton.dataset.lastname);
      formData.append("supporter.emailAddress", tidepoolButton.dataset.email);
      formData.append(
        "supporter.questions.265330",
        tidepoolButton.dataset.transaction
      );
      formData.append(
        "supporter.questions.265331",
        tidepoolButton.dataset.amount
      );

      fetch("https://act.oceana.org/page/28691/subscribe/2", {
        body: formData,
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }).then((response) => {
        if (response.ok) {
          tidepoolButton.innerHTML = "Thank you!";
          tidepoolButton.classList.add("disabled");
          tidepoolButton.disabled = true;
        }
      });
    });
  }

  // If the URL contains assets=redesign then add two body data attributes if they're not already present
  // This is a temporary solution to ensure the page layout is correct while we migrate to the new theme
  // and to ensure the correct theme is loaded.
  // This will be removed once the migration is complete.
  if (window.location.search.includes("assets=redesign")) {
    document.body.setAttribute("data-engrid-layout", "leftleft1col");
    document.body.setAttribute("data-engrid-theme-version", "202503");
    document.body.setAttribute("data-engrid-legacy-theme-version", "2024");

    // Remove .give-by-select_count_3
    const giveBySelectCount3 = document.querySelector(
      ".give-by-select_count_3"
    );
    if (giveBySelectCount3) {
      giveBySelectCount3.remove();
    }

    // If a class contains "i1-100 i2-50 i3-50 i4-100 i5-33 i6-33 i7-33 i8-100" remove the i2-50 i3-50 i5-33 i6-33 i7-33 classes
    const elements = document.querySelectorAll(
      '[class*="i1-100 i2-50 i3-50 i4-100 i5-33 i6-33 i7-33 i8-100"]'
    );
    elements.forEach((element) => {
      element.classList.remove("i2-50", "i3-50", "i5-33", "i6-33", "i7-33");
    });

    // Find .en__field--donationAmt and on the parent div add .radio-to-buttons_donationAmt class then remove the .radio-to-buttons_donationAmt class from the body
    const donationAmt = document.querySelector(".en__field--donationAmt");
    if (donationAmt?.parentElement) {
      donationAmt.parentElement.classList.add("radio-to-buttons_donationAmt");
    }
    document.body.classList.remove("radio-to-buttons_donationAmt");
  }

  const attriubtion = document.querySelector(
    ".media-with-attribution figattribution"
  );
  if (attriubtion) {
    const tippyInstance = attriubtion._tippy;
    if (tippyInstance) {
      tippyInstance.setProps({
        allowHTML: true,
        theme: "oceana",
        placement: "left-end",
        arrow: "<div class='custom-tooltip-arrow'></div>",
        trigger: "click mouseenter focus",
      });
    }
  }

  /**
   * This function checks the value of the mobile phone input field and toggles
   * the SMS opt-in checkbox accordingly. It also adds the checkbox field if needed
   * and adds event listeners to monitor changes.
   */
  function toggleSMSOptInCheckboxBasedOnMobilePhone() {
    const mobilePhoneInput = document.querySelector(
      '[name="supporter.phoneNumber2"]'
    );
    const smsOptInCheckbox = document.querySelector(
      ".en__field--sms input[type='checkbox'], .en__field--sailors-for-the-sea-sms input[type='checkbox']"
    );

    if (mobilePhoneInput && smsOptInCheckbox) {
      // Add a notice to the mobile phone field
      App.addHtml(
        '<div class="en__field__notice"><em>By providing your mobile phone number you agree to receive automated updates from Oceana on how to help the oceans (including marketing messages). Consent is not a condition of purchase. Msg & data rates may apply. Txt STOP to stop or HELP for help. <a href="https://oceana.org/terms-of-use/" target="_blank" title="Terms">Terms</a> and <a href="https://oceana.org/privacy-policy/" target="_blank" title="Privacy Policy">Privacy Policy</a></em></div>',
        ".en__field--phoneNumber2 .en__field__element",
        "after"
      );

      // Function to toggle the SMS opt-in checkbox based on the mobile phone input value
      const toggleCheckbox = () => {
        if (mobilePhoneInput.value.trim() !== "") {
          /* `smsOptInCheckbox` is a variable that stores a reference to the checkbox element for SMS
          opt-in. It is used to toggle the checked state of the checkbox based on the value of the
          mobile phone input field. */
          smsOptInCheckbox.checked = true;
          // console.log(
          //   "SMS Opt-in Checkbox checked: Mobile phone input has a value."
          // );
        } else {
          smsOptInCheckbox.checked = false;
          // console.log(
          //   "SMS Opt-in Checkbox unchecked: Mobile phone input is empty."
          // );
        }
      };

      // Call the function on page load
      toggleCheckbox();

      // Add event listener to mobile phone input for changes
      mobilePhoneInput.addEventListener("input", toggleCheckbox);
    }
  }

  // Call the function to toggle SMS opt-in checkbox based on mobile phone input
  toggleSMSOptInCheckboxBasedOnMobilePhone();

  const countrySelect = document.querySelector("#en__field_supporter_country");
  if (countrySelect) {
    const defaultCheckbox = document.querySelector(
      "#en__field_supporter_questions_210910"
    );
    const usCheckbox = document.querySelector(
      "#en__field_supporter_questions_18912"
    );
    const canadaCheckbox = document.querySelector(
      "#en__field_supporter_questions_37483"
    );
    const brazilCheckbox = document.querySelector(
      "#en__field_supporter_questions_409092"
    );
    const sailorsForTheSeaCheckbox = document.querySelector(
      "#en__field_supporter_questions_395782"
    );
    function hideAllCheckboxes() {
      if (defaultCheckbox) {
        defaultCheckbox.closest(".en__field").style.display = "none";
        defaultCheckbox.checked = false;
      }
      if (usCheckbox) {
        usCheckbox.closest(".en__field").style.display = "none";
        usCheckbox.checked = false;
      }
      if (canadaCheckbox) {
        canadaCheckbox.closest(".en__field").style.display = "none";
        canadaCheckbox.checked = false;
      }
      if (brazilCheckbox) {
        brazilCheckbox.closest(".en__field").style.display = "none";
        brazilCheckbox.checked = false;
      }
      if (sailorsForTheSeaCheckbox) {
        sailorsForTheSeaCheckbox.closest(".en__field").style.display = "none";
        // sailorsForTheSeaCheckbox.checked = false;
      }
    }
    function setOptIn(country) {
      return false; // Temporarily disable the script per client request
      // If we can find any element with the ".show-optin" class, we don't run this function and keep things default
      const showOptIn = document.querySelector(".show-optin");
      if (showOptIn) {
        return false;
      }
      hideAllCheckboxes();
      if (
        country === "United States" ||
        country === "American Samoa" ||
        country === "Guam" ||
        country === "Northern Mariana Islands" ||
        country === "Puerto Rico" ||
        country === "Virgin Islands, U.S."
      ) {
        if (usCheckbox) {
          usCheckbox.checked = true;
        }
      } else if (country === "Canada") {
        if (canadaCheckbox) {
          canadaCheckbox.closest(".en__field").style.display = "block";
          canadaCheckbox.checked = false;
        }
        if (sailorsForTheSeaCheckbox) {
          sailorsForTheSeaCheckbox.closest(".en__field").style.display =
            "block";
          sailorsForTheSeaCheckbox.checked = false;
        }
      } else if (country === "Brazil") {
        if (brazilCheckbox) {
          brazilCheckbox.closest(".en__field").style.display = "block";
          brazilCheckbox.checked = false;
        }
        if (sailorsForTheSeaCheckbox) {
          sailorsForTheSeaCheckbox.closest(".en__field").style.display =
            "block";
          sailorsForTheSeaCheckbox.checked = false;
        }
      } else if (country === "United Kingdom") {
        if (usCheckbox) {
          usCheckbox.checked = false;
          usCheckbox.closest(".en__field").style.display = "block";
        }
        if (sailorsForTheSeaCheckbox) {
          sailorsForTheSeaCheckbox.closest(".en__field").style.display =
            "block";
          sailorsForTheSeaCheckbox.checked = false;
        }
      } else {
        if (defaultCheckbox) {
          defaultCheckbox.closest(".en__field").style.display = "block";
          defaultCheckbox.checked = false;
        }
      }
    }
    countrySelect.addEventListener("change", function () {
      const country = this.value;
      setOptIn(country);
    });
    setOptIn(countrySelect.value);
  }

  // Digital Wallets Moving Parts
  //
  // const digitalWalletWrapper = document.querySelector(
  //   ".merge-with-give-by-select #en__digitalWallet"
  // );
  // const digitalWalletFirstChild = document.querySelector("#en__digitalWallet");
  // const giveBySelect = document.querySelector(".give-by-select");
  // if (digitalWalletWrapper && giveBySelect) {
  //   giveBySelect.appendChild(digitalWalletWrapper);
  //   digitalWalletFirstChild.insertAdjacentHTML(
  //     "beforeend",
  //     "<div class='digital-divider'><span class='divider-left'></span><p class='divider-center'>or enter manually</p><span class='divider-right'></span></div>"
  //   );
  // }
  //
  // let digitalWalletsExist;
  //
  // setTimeout(function () {
  //   digitalWalletsExist = document.querySelectorAll(
  //     ".en__digitalWallet__container > *"
  //   );
  //   if (digitalWalletsExist.length > 0 && giveBySelect) {
  //     giveBySelect.setAttribute("show-wallets", "");
  //   }
  // }, 500);
  //
  // setTimeout(function () {
  //   digitalWalletsExist = document.querySelectorAll(
  //     ".en__digitalWallet__container > *"
  //   );
  //   if (digitalWalletsExist.length > 0 && giveBySelect) {
  //     giveBySelect.setAttribute("show-wallets", "");
  //   }
  // }, 2500);
  //
  // //Digital wallets are hiddens via CSS on page load
  // //this will show them on page load if required
  // if (
  //   document
  //     .getElementById("en__field_transaction_paymenttype")
  //     .value.toLowerCase() === "paypal"
  // ) {
  //   document.getElementById("en__digitalWallet").style.display = "flex";
  // }
  //
  // /**
  //  * Get the payment type value from the GiveBySelect. Workaround because
  //  * EN requires payment type for both venmo and paypal to be "paypal".
  //  * @returns "card", "venmo" or "paypal"
  //  */
  // function getGiveBySelectValue() {
  //   let giveBySelectInput = document.querySelector(
  //     'input[name="transaction.giveBySelect"]:checked'
  //   );
  //   let giveBySelectInputValue = giveBySelectInput.value.toLowerCase();
  //
  //   if (giveBySelectInputValue !== "paypal") return "card";
  //
  //   return giveBySelectInput.parentElement.classList.contains("venmo")
  //     ? "venmo"
  //     : "paypal";
  // }
  //
  // function getPaymentFrequency() {
  //   return document
  //     .querySelector('input[name="transaction.recurrfreq"]:checked')
  //     .value.toLowerCase();
  // }
  //
  // //Toggles display of submit button and digital wallet buttons based on giveBySelect
  // //and payment frequency
  // document
  //   .querySelectorAll(
  //     '[name="transaction.giveBySelect"],[name="transaction.recurrfreq"]'
  //   )
  //   .forEach((el) => {
  //     el.addEventListener("change", () => {
  //       let submitButtonContainer = document.querySelector(".en__submit");
  //       let digitalWalletsContainer =
  //         document.getElementById("en__digitalWallet");
  //       let giveBySelectValue = getGiveBySelectValue();
  //
  //       if (giveBySelectValue === "venmo") {
  //         submitButtonContainer.style.display = "none";
  //         digitalWalletsContainer.style.display = "flex";
  //       } else {
  //         submitButtonContainer.style.display = "block";
  //         digitalWalletsContainer.style.display = "none";
  //       }
  //     });
  //   });

  // Transaction fee tooltip
  function addTransactionFeeTooltip() {
    const transactionFeeEl = document.querySelector(
      ".transaction-fee-opt-in .en__field__element--checkbox"
    );

    if (!transactionFeeEl) return;

    const transactionFeeTooltip = document.createElement("div");
    transactionFeeTooltip.classList.add("transaction-fee-tooltip");
    transactionFeeTooltip.innerHTML = "i";
    transactionFeeEl.appendChild(transactionFeeTooltip);

    tippy(transactionFeeTooltip, {
      content:
        "By checking this box, you agree to cover the transaction fee for your donation. This small additional amount helps us ensure that 100% of you donation goes directly to Oceana.",
      allowHTML: true,
      theme: "white",
      placement: "top",
      trigger: "mouseenter click focus",
      interactive: true,
      arrow: "<div class='custom-tooltip-arrow'></div>",
      offset: [0, 20],
    });
  }

  addTransactionFeeTooltip();

  // If using a two column layout without content in the body-top OR body-main section, automatically change to a one column layout
  const checkForTwoColumnLayout = document.querySelector(
    'body[data-engrid-layout="centercenter2col"]'
  );
  const checkForBodyTopContent = document.querySelector(".body-top > *");
  const checkForBodyMainContent = document.querySelector(".body-main > *");
  if (
    checkForTwoColumnLayout &&
    (!checkForBodyTopContent || !checkForBodyMainContent)
  ) {
    document
      .querySelector("body")
      .setAttribute("data-engrid-layout", "centercenter1col");
  }

  //  On select#en__field_transaction_paycurrency add the data-option-count="#" attribute with # being the number of options in the select element
  function handleCurrencySelect() {
    const payCurrencySelect = document.querySelector(
      "#en__field_transaction_paycurrency"
    );
    if (payCurrencySelect) {
      const updateOptionCount = () => {
        const optionCount = payCurrencySelect.options.length;
        payCurrencySelect.setAttribute("data-option-count", optionCount);
        // payCurrencySelect.disabled = optionCount === 1;
      };

      // Initial count
      updateOptionCount();

      // Watch for changes in the select element
      const observer = new MutationObserver(updateOptionCount);
      observer.observe(payCurrencySelect, {
        childList: true,
        subtree: true,
      });
    }
  }

  handleCurrencySelect();

  function moveAttributionClass() {
    const allowedClasses = [
      "attribution-bottom",
      "attribution-bottomcenter",
      "attribution-bottomright",
      "attribution-bottomleft",
      "attribution-top",
      "attribution-topcenter",
      "attribution-topright",
      "attribution-topleft",
      "attribution-left",
      "attribution-leftcenter",
      "attribution-right",
      "attribution-rightcenter",
    ];

    document.querySelectorAll("img").forEach((img) => {
      const matchedClass = allowedClasses.find((cls) =>
        img.classList.contains(cls)
      );
      if (matchedClass) {
        const parentDiv = img.closest(".en__component--column");
        if (parentDiv) {
          img.classList.remove(matchedClass);
          parentDiv.classList.add(matchedClass);
        }
      }
    });
  }

  // Call it immediately
  moveAttributionClass();

  /**
   * This function moves the "--banner-image-height" custom attribute from the "img" tag inside ".page-backgroundImage"
   * and adds it to the ".page-backgroundImage" element's style attribute, ensuring not to overwrite any existing styles.
   */
  function moveBannerImageHeightToBackgroundImage() {
    const pageBackgroundImage = document.querySelector(".page-backgroundImage");
    let backgroundImage = null;
    if (pageBackgroundImage) {
      backgroundImage = pageBackgroundImage.querySelector("img");
    }

    if (pageBackgroundImage && backgroundImage) {
      // Get the "--banner-image-height" style from the "img" tag
      const bannerImageHeightStyle = backgroundImage.getAttribute("style");

      if (bannerImageHeightStyle) {
        // Remove the "--banner-image-height" style from the "img" tag
        backgroundImage.setAttribute(
          "style",
          bannerImageHeightStyle
            .replace(/(--banner-image-height:[^;]+;?)/g, "")
            .trim()
        );

        // Append the "--banner-image-height" style to the ".page-backgroundImage" style
        const pageBackgroundImageStyle =
          pageBackgroundImage.getAttribute("style");
        pageBackgroundImage.setAttribute(
          "style",
          `${
            pageBackgroundImageStyle ? pageBackgroundImageStyle + " " : ""
          }${bannerImageHeightStyle}`
        );
      }
    }
  }

  // Call the function to move "--banner-image-height" from the "img" tag to ".page-backgroundImage" style
  moveBannerImageHeightToBackgroundImage();

  // function mobileMediaAttribution() {
  //   const bgImageTooltip = document.querySelector(
  //     ".page-backgroundImage figattribution"
  //   );

  //   if (bgImageTooltip) {
  //     const bgImageTooltipText = bgImageTooltip.innerHTML;

  //     bgImageTooltip.insertAdjacentHTML(
  //       "afterend",
  //       `<div id="mobile-bg-tooltip"></div>`
  //     );
  //     tippy("#mobile-bg-tooltip", {
  //       theme: "oceana",
  //       content: bgImageTooltipText,
  //       allowHTML: true,
  //       placement: "left",
  //       trigger: "click mouseenter focus",
  //     });
  //   }
  // }

  // mobileMediaAttribution(); // Call the function to set the mobile media attribution tooltip

  function enforceSubmitButtonLabel() {
    const button = document.querySelector(".en__submit button");
    if (!button || typeof pageJson !== "object") return;

    const { pageType, pageNumber, pageCount } = pageJson;

    if (pageType !== "emailtotarget" || pageNumber !== 1) return;

    const correctLabel =
      pageCount === 1 || pageCount === 2
        ? "Submit"
        : pageCount > 2
        ? "Continue"
        : null;

    const updateLabelIfNeeded = () => {
      if (button.textContent.trim() === "SUBMIT" && correctLabel) {
        button.textContent = correctLabel;
      }
    };

    updateLabelIfNeeded();

    new MutationObserver(updateLabelIfNeeded).observe(button, {
      characterData: true,
      childList: true,
      subtree: true,
    });
  }

  // Just call it whenever you want – assume DOM is ready
  enforceSubmitButtonLabel();

  // Add One-Time to the live frequency text
  freq.onFrequencyChange.subscribe(() => {
    const freqValue = freq.frequency;
    if (freqValue === "onetime") {
      window.setTimeout(() => {
        const liveFrequency = document.querySelectorAll(
          ".live-variable-frequency"
        );
        liveFrequency.forEach((el) => {
          el.innerHTML = "One-Time";
        });
      }, 250);
    }
  });

  function addNoCCFlag() {
    if (!document.querySelector(".en__field--ccnumber")) {
      document.body.setAttribute("data-no-cc-present", "");
    }
  }

  addNoCCFlag();

  /* Copied from an event page code block and cleaned up with ChatGPT */
  function initializeTicketLogic() {
    const ticketQuantityInputs = document.querySelectorAll(
      ".en__ticket__quantity"
    );
    if (ticketQuantityInputs.length === 0) return; // Bail if no ticket inputs

    const ticketMinusButtons = document.querySelectorAll(".en__ticket__minus");
    const ticketPlusButtons = document.querySelectorAll(".en__ticket__plus");

    const ticketCountInput = document.querySelector(
      "#en__field_supporter_questions_1798479"
    );
    const ticketNameCSVInput = document.querySelector(
      "#en__field_supporter_questions_1798480"
    );

    function getTotalTicketsAndPackageNames() {
      let totalTickets = 0;
      let packageNames = [];

      ticketQuantityInputs.forEach((input) => {
        const quantity = parseInt(input.value, 10) || 0;
        if (quantity > 0) {
          const ticket = input.closest(".en__ticket");
          const ticketDesc = ticket.querySelector(".en__ticket__desc");
          const ticketName =
            ticket.querySelector(".en__ticket__name").textContent;
          const ticketCountMatch = ticketDesc.textContent.match(/(\d+)/);
          const ticketCount = ticketCountMatch
            ? parseInt(ticketCountMatch[0], 10)
            : 1;

          totalTickets += quantity * ticketCount;
          packageNames.push(ticketName);
        }
      });

      return { totalTickets, packageNames };
    }

    function onQuantityChange() {
      const { totalTickets, packageNames } = getTotalTicketsAndPackageNames();
      const packageNamesCSV = packageNames.join(", ");

      ticketCountInput.value = totalTickets;
      ticketNameCSVInput.value = packageNamesCSV;

      console.log("Total tickets being purchased:", totalTickets);
      console.log("Ticket packages being purchased:", packageNamesCSV);
    }

    function handleClickEvent(event) {
      const input = event.target
        .closest(".en__ticket__selector")
        .querySelector(".en__ticket__quantity");
      const updateEvent = new CustomEvent("updateValue", {
        bubbles: true,
        detail: { input },
      });
      document.dispatchEvent(updateEvent);
    }

    document.addEventListener("updateValue", (event) => {
      const { input } = event.detail;
      setTimeout(() => {
        onQuantityChange(input);
      }, 50);
    });

    ticketMinusButtons.forEach((button) => {
      button.addEventListener("click", handleClickEvent);
    });

    ticketPlusButtons.forEach((button) => {
      button.addEventListener("click", handleClickEvent);
    });

    ticketQuantityInputs.forEach((input) => {
      input.addEventListener("input", onQuantityChange);
      input.addEventListener("keyup", onQuantityChange);
    });
  }

  // Call the function
  initializeTicketLogic();
};
