export const customScript = function () {
  console.log("ENGrid client scripts are executing");
  const tidepoolButton = document.querySelector(".tide-pool-wrapper button");
  if (tidepoolButton) {
    const loadingAnimation = () => {
      tidepoolButton.innerHTML = `<span class='loader-wrapper'><span class='loader loader-quart'></span><span class='submit-button-text-wrapper'>Sending...</span></span>`;
    };
    tidepoolButton.addEventListener("click", () => {
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
    }
    function setOptIn(country) {
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
      } else if (country === "Brazil") {
        if (brazilCheckbox) {
          brazilCheckbox.closest(".en__field").style.display = "block";
          brazilCheckbox.checked = false;
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
};
