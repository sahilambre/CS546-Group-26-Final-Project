(($) => {
    $(document).ready(function () {
        if (!$('#username').val() || $('#username').val().trim() == "") {
            $("#loginEmailGroup").append('<div id="loginEmailHelp" class="form-text">Email is required</div>');
        }
        if (!$('#password').val() || $('#password').val().trim() == ""){
            $("#loginPasswordGroup").append('<div id="loginPasswordHelp" class="form-text">Password is required</div>')
        }
    
        $("#loginFormSubmit").click(function (event) {
            // var formData = {
            //     emailAddressInput: $("#username").val(),
            //     passwordInput: $("#password").val()
            // };
            $(".form-text").remove()
            $(".error-text").remove()
            
            event.preventDefault()
            var email = $('#username').val()
            email = email.trim().toLowerCase()
            if (!email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {                
                return $("#loginEmailGroup").append('<p id="loginEmailHelp" class="error-text">Doesn\'t look like a valid Email!</p>');
            }
            // else{
            //     $(".error-text").remove()
            // }
            if (!$('#password').val() || $('#password').val().trim() == ""){
                return $("#loginPasswordGroup").append('<p class="error-text">Password cannot be empty!</p>')
            }

            $("#login-form").submit()

            // $.ajax({
            //   type: "POST",
            //   url: "/login",
            //   data: formData,
            //   dataType: "json",
            //   encode: true,
            // }).done(function (data) {
            //   console.log(data);
            // });
        
            
          });
       
    })
    
})(jQuery)

