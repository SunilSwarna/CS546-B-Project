// (function () {
//     // 'use strict';
//     $("#passwordHelp").hide();
//     window.addEventListener('load', function () {
//         // Fetch all the forms we want to apply custom Bootstrap validation styles to
//         var forms = document.getElementsByClassName('needs-validation');
//         // Loop over them and prevent submission
//         var validation = Array.prototype.filter.call(forms, function (form) {

//     // var password = document.getElementById("password").value
//     // var confirmPassword = document.getElementById("confirmPassword").value
//             form.addEventListener('submit', function (event) {

//                 if (form.checkValidity() === false) {
//                     console.log(forms)
//                     event.preventDefault();
//                     event.stopPropagation();
//                 }
//                 form.classList.add('was-validated');
//             }, false);
//         });
//     }, false);
// })();

$("#passwordHelp").hide();
$("#confirmPasswordHelp").hide();
$("#validatefullName").hide();
$("#validateEmail").hide();
var submit = document.getElementById("login");


submit.addEventListener("click", (event) => {

    $("#passwordHelp").hide();
    $("#confirmPasswordHelp").hide();
    $("#validatefullName").hide();
    $("#validateEmail").hide();

    var fullname = document.getElementById("fullName").value
    var email = document.getElementById("inputEmail").value

    if (!fullname) {
        event.preventDefault();
        $("#validatefullName").show();
        document.getElementById("validatefullName").innerHTML = "Name field  is required!";
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
        else {
        }
    }
}, true);


