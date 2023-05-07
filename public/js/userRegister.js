
(window.onload = () => {

    let form = document.getElementById("user-registration-form");
  
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

    const fileInput = document.getElementById('pictureInput')

    // This is for storing the base64 strings
    let myFiles = {}
    // if you expect files by default, make this disabled
    // we will wait until the last file being processed
    let isFilesReady = true
    
    fileInput.addEventListener('change', async (event) => {
      const files = event.srcElement.files;
    
      console.log(files)
    })
  })();