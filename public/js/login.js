(($) => {
    $.ajax( () => {
        if (!$('#username').val() || $('#username').val().trim() == "") {
            $("#loginEmailGroup").append('<div id="loginEmailHelp" class="form-text">Email can\'t be empty!</div>');
        }
        if (!$('#password').val() || $('#password').val().trim() == ""){
            return $("#loginPasswordGroup").append('<div id="loginPasswordHelp" class="form-text">Password can\'t be empty!</div>')
        }
    
        $('#loginForm').submit(function (event) {
            event.preventDefault();
            $(".form-text").remove()
            var email = $('#username').val()
            email = email.trim().toLowerCase()
            if (!email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {                
                return $("#loginEmailGroup").append('<div id="loginEmailHelp" class="form-text">Doesn\'t look like a valid Email!</div>');
            }
            $("#loginForm").submit()
        });
    })
    
})(jQuery)

