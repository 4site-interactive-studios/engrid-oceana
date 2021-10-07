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
};
