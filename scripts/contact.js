// *Initialize emailJS
(function () {
  emailjs.init("DzZ6BIu3N4pT6e34Q");
})();

const contact_Form = document.querySelector("#contact-form");

// * Send email with data from the document
contact_Form.addEventListener("submit", (event) => {
  // handle the form data
  event.preventDefault();

  // *Send form with emailjs
  emailjs
    .sendForm("contact_service", "contact_form", contact_Form)
    .then(() => contact_Form.submit())
    .catch((error) => {
      console.log("FAILED....", error);
    });
});
