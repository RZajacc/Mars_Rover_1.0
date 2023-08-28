
// *Initialize emailJS
(function () {
    emailjs.init("DzZ6BIu3N4pT6e34Q");
})();

const contact_Form = document.getElementById('contact-form');

contact_Form.addEventListener('submit', (event) => {
    
    // handle the form data
    event.preventDefault();
    
    // *Send form with emailjs
    emailjs.sendForm('contact_service', 'contact_form', contact_Form)
        .then(() => contact_Form.submit())
        ,(error) => console.log('FAILED....', error);    
});



