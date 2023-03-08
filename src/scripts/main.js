export const customScript = function () {
  console.log("ENGrid client scripts are executing");
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

  const digitalWalletWrapper = document.querySelector(
    ".merge-with-give-by-select #en__digitalWallet"
  );
  const digitalWalletFirstChild = document.querySelector("#en__digitalWallet");
  const giveBySelect = document.querySelector(".give-by-select");
  if (digitalWalletWrapper && giveBySelect) {
    giveBySelect.appendChild(digitalWalletWrapper);
    digitalWalletFirstChild.insertAdjacentHTML(
      "beforeend",
      "<div class='digital-divider'><span class='divider-left'></span><p class='divider-center'>or enter manually</p><span class='divider-right'></span></div>"
    );
  }

  let digitalWalletsExist;

  setTimeout(function () {
    digitalWalletsExist = document.querySelectorAll(
      ".en__digitalWallet__container > *"
    );
    if (digitalWalletsExist.length > 0) {
      giveBySelect.setAttribute("show-wallets", "");
    }
  }, 500);

  setTimeout(function () {
    digitalWalletsExist = document.querySelectorAll(
      ".en__digitalWallet__container > *"
    );
    if (digitalWalletsExist.length > 0) {
      giveBySelect.setAttribute("show-wallets", "");
    }
  }, 2500);

  //Digital wallets are hiddens via CSS on page load
  //this will show them on page load if required
  if (
    document
      .getElementById("en__field_transaction_paymenttype")
      .value.toLowerCase() === "paypal"
  ) {
    document.getElementById("en__digitalWallet").style.display = "flex";
  }

  /**
   * Get the payment type value from the GiveBySelect. Workaround because
   * EN requires payment type for both venmo and paypal to be "paypal".
   * @returns "card", "venmo" or "paypal"
   */
  function getGiveBySelectValue() {
    let giveBySelectInput = document.querySelector(
      'input[name="transaction.giveBySelect"]:checked'
    );
    let giveBySelectInputValue = giveBySelectInput.value.toLowerCase();

    if (giveBySelectInputValue !== "paypal") return "card";

    return giveBySelectInput.parentElement.classList.contains("venmo")
      ? "venmo"
      : "paypal";
  }

  function getPaymentFrequency() {
    return document
      .querySelector('input[name="transaction.recurrfreq"]:checked')
      .value.toLowerCase();
  }

  //Toggles display of submit button and digital wallet buttons based on giveBySelect
  //and payment frequency
  document
    .querySelectorAll(
      '[name="transaction.giveBySelect"],[name="transaction.recurrfreq"]'
    )
    .forEach((el) => {
      el.addEventListener("change", () => {
        let submitButtonContainer = document.querySelector(".en__submit");
        let digitalWalletsContainer =
          document.getElementById("en__digitalWallet");
        let paymentFrequency = getPaymentFrequency();
        let giveBySelectValue = getGiveBySelectValue();

        if (giveBySelectValue === "venmo") {
          submitButtonContainer.style.display = "none";
          digitalWalletsContainer.style.display = "flex";
        } else if (giveBySelectValue === "paypal") {
          if (paymentFrequency === "onetime") {
            submitButtonContainer.style.display = "none";
            digitalWalletsContainer.style.display = "flex";
          } else {
            submitButtonContainer.style.display = "block";
            digitalWalletsContainer.style.display = "none";
          }
        } else {
          submitButtonContainer.style.display = "block";
          digitalWalletsContainer.style.display = "none";
        }
      });
    });
};
