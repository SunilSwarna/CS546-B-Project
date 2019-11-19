var submit = document.getElementById("login");


submit.addEventListener("click", (event) => {

    $("#passwordHelp").hide();
    $("#validateEmail").hide();

 
    var email = document.getElementById("inputEmail").value

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
    
    if (!password) {
        event.preventDefault();
        $("#passwordHelp").show();
        document.getElementById("passwordHelp").innerHTML = "Password field  is required!";
    }

    if (password) {
      
        if (password.length < 5) {
            event.preventDefault();
            $("#passwordHelp").show();
            document.getElementById("passwordHelp").innerHTML = "Invalid Credentials!";
        }
      
    }
});