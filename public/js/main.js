// In this file, you must perform all client-side validation for every single form input (and the role dropdown) on your pages. The constraints for those fields are the same as they are for the data functions and routes. Using client-side JS, you will intercept the form's submit event when the form is submitted and If there is an error in the user's input or they are missing fields, you will not allow the form to submit to the server and will display an error on the page to the user informing them of what was incorrect or missing.  You must do this for ALL fields for the register form as well as the login form. If the form being submitted has all valid data, then you will allow it to submit to the server for processing. Don't forget to check that password and confirm password match on the registration form!

(window.onload = () => {

    const form = document.getElementById("registration-form");
  
    if(form){
        form.addEventListener("submit", (event) => {
            event.preventDefault();
            const password = document.getElementById("passwordInput").value;
            const confirmPass = document.getElementById("confirmPasswordInput").value;
            if(password !== confirmPass) {
                alert("Passwords do not match!")
            } else {
                form.submit()
            }
        })
    }
  })();