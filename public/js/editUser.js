
(window.onload = () => {
const form = document.getElementById("edit-user-form");

if(form){
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        // const password = document.getElementById("passwordInput").value;
        // const confirmPass = document.getElementById("confirmPasswordInput").value;
        // if(password !== confirmPass) {
        //     return alert("Passwords do not match!")
        // }
        let fileInput = document.getElementById("resumeInput");
        const file = fileInput.files[0];

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function() {
          const pdfBase64 = reader.result.split(',')[1];
          
          fetch('/profile', {
            method: 'POST',
            redirect: 'follow',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                firstNameInput: document.getElementById("firstNameInput").value,
                lastNameInput: document.getElementById("lastNameInput").value,
                // emailAddressInput: document.getElementById("emailAddressInput").value,
                birthDateInput: document.getElementById("birthDateInput").value,
                // const stateInput = xss(req.body.state);
                gradYearInput: document.getElementById("gradYearInput").value,
                // passwordInput: document.getElementById("passwordInput").value,
                // confirmPasswordInput: document.getElementById("confirmPasswordInput").value,
                resumeInput: pdfBase64 
            })
          })
            .then(response => 
              {
                if (response.redirected) 
                {
                  window.location.href = response.url;
                } 
                else 
                {
                  response.text()
                }
              })
            .then(data => console.log(data))
            .catch(error => console.error(error));
        }
        
    })
}

})();