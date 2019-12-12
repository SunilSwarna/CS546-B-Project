var getPosition = function (options) {
    return new Promise(function (resolve, reject) {
        navigator.geolocation.getCurrentPosition(resolve, reject, options);
    });
}

getPosition()
    .then((position) => {
        var s = document.getElementById('longitude');
        s.value = position.coords.longitude
        var s1 = document.getElementById('latitude');
        s1.value = position.coords.latitude
    })
    .catch((err) => {
        var s = document.getElementById('longitude');
        s.value = -74.024255
        var s1 = document.getElementById('latitude');
        s1.value = 40.745094
    });


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