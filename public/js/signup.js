$("#passwordHelp").hide();
$("#confirmPasswordHelp").hide();
$("#validatefirstName").hide();
$("#validatelastName").hide();
$("#validateEmail").hide();
var submit = document.getElementById("login");


submit.addEventListener("click", (event) => {
    if(  $('#dbError').is(':visible') )   $('#dbError').hide()
    $("#passwordHelp").hide();
    $("#confirmPasswordHelp").hide();
    $("#validatefirstName").hide();
    $("#validatelastName").hide();
    $("#validateEmail").hide();

    var firstName = document.getElementById("firstName").value
    var lastName = document.getElementById("lastName").value
    var email = document.getElementById("inputEmail").value

    if (!firstName) {
        event.preventDefault();
        $("#validatefirstName").show();
        document.getElementById("validatefirstName").innerHTML = "First Name field  is required!";
    }

    if (!lastName) {
        event.preventDefault();
        $("#validatelastName").show();
        document.getElementById("validatelastName").innerHTML = "Last Name field  is required!";
    }

    if (!email) {
        event.preventDefault();
        $("#validateEmail").show();
        document.getElementById("validateEmail").innerHTML = "Email field  is required!";
    }
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!email.match(mailformat) && email) {
        event.preventDefault();
        $("#validateEmail").show();
        document.getElementById("validateEmail").innerHTML = "Invalid email address!";
    }

    var password = document.getElementById("password").value
    var confirmPassword = document.getElementById("confirmPassword").value
    // var forms = document.getElementsByClassName('needs-validation');
    if (!password) {
        event.preventDefault();
        $("#passwordHelp").show();
        document.getElementById("passwordHelp").innerHTML = "Password field  is required!";
    }
    if (!confirmPassword) {
        event.preventDefault();
        $("#confirmPasswordHelp").show();
        document.getElementById("confirmPasswordHelp").innerHTML = "Confirm Password field is required!";
    }

    if (password && confirmPassword) {
        if (password != confirmPassword) {
            event.preventDefault();
            $("#passwordHelp").show();
            document.getElementById("passwordHelp").innerHTML = "Passwords do not match!";
        }
        else if (password.length < 5) {
            event.preventDefault();
            $("#passwordHelp").show();
            document.getElementById("passwordHelp").innerHTML = "Min Length of  Password is 5!";
        }
        else if (confirmPassword.length < 5) {
            event.preventDefault();
            $("#confirmPasswordHelp").show();
            document.getElementById("confirmPasswordHelp").innerHTML = "Min Length of  Password is 5!";
        }
    }
});


