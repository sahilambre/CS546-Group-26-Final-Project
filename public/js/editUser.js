
(window.onload = () => {

    let form = document.getElementById("user_edit_form");
    
    if(form){
        form.addEventListener("submit", (event) => {
            event.preventDefault();
            const password = document.getElementById("passwordEditInput").value;
            const confirmPass = document.getElementById("confirmPasswordEditInput").value;
            if(password !== confirmPass) {
                return alert("Passwords do not match!")
            }
            let fileInput = document.getElementById("resumeEditInput");
            const file = fileInput.files[0];

            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function() {
              const pdfBase64 = reader.result.split(',')[1];
              
              fetch('/registerStudents', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    firstNameInput: document.getElementById("firstNameEditInput").value,
                    lastNameInput: document.getElementById("lastNameEditInput").value,
                    emailAddressInput: document.getElementById("emailAddressEditInput").value,
                    birthDateInput: document.getElementById("birthDateEditInput").value,
                    // const stateInput = xss(req.body.state);
                    gradYearInput: document.getElementById("gradYearEditInput").value,
                    passwordInput: document.getElementById("passwordEditInput").value,
                    confirmPasswordInput: document.getElementById("confirmPasswordEditInput").value,
                    resumeInput: pdfBase64 
                })
              })
                .then(response => response.text())
                .then(data => console.log(data))
                .catch(error => console.error(error));
            }
            
        })
    }

    // const convertBase64 = (file) => {
    //     return new Promise((resolve, reject) => {
    //       const fileReader = new FileReader();
    //       fileReader.readAsDataURL(file);
      
    //       fileReader.onload = () => {
    //         resolve(fileReader.result);
    //       };
      
    //       fileReader.onerror = (error) => {
    //         reject(error);
    //       };
    //     });
    //   };

    //   async function convertBase64Main(event) {
    //     const file = event.target.files[0];
    //     const base64 = await convertBase64(file);
    //     const resb64 = document.getElementById("base64");
    //     resb64.innerText = base64
    //   }

    //  if(resumeInput){ 
    //   resumeInput.addEventListener('resumeInput', async (event) => {
    //     const file = event.target.files[0];
    //     const base64 = await convertBase64(file);
    //     const resb64 = document.getElementById("base64");
    //     resb64.innerText = base64
    //     // const res = document.getElementById("")
    //   })
    // }

  })();