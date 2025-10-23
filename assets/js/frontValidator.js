export function registerFrontValidate(constants) {
  const formElem = document.getElementById(constants.inputFormId);
  const addBtnElem = document.getElementById(constants.addNewCardId);

  formElem.querySelectorAll("input, select, textarea").forEach((input) => {
    const alertMsgDiv = input.parentElement.parentElement.querySelector(
      `.${constants.alertDivClass}`
    );
    input.addEventListener("input", function () {
      if (this.type === "hidden") return;
      if (this.validity.valid) {
        alertMsgDiv.classList.toggle("hidden", true);
      } else {
        alertMsgDiv.classList.toggle("hidden", false);
      }
    });
  });
}
