


document.querySelector('button').addEventListener('click', (event) => {
    event.preventDefault();
    // var errorText = document.getElementById("errorText");
    // errorText.textContent = "";
    var input = document.getElementById("validateTitle").value;

    // if (input == undefined || input < 0 || isNaN(input)) {
    //     document.getElementById("validateTitle").value = "";
    //     errorText.textContent = "Please Enter Number!";
    // }
    // else {
    // e=""
    try {
        // const {output, flag} = validatePrime(input);
        var list_ol = document.getElementById("latlong");



        if ("geolocation" in navigator) {

            function error() {
                alert('Unable to retrieve your location');
            }
            function success(position) {
                list_ol.innerHTML += '<li class="lalo">' + position.coords.latitude + '||' + position.coords.longitude + '</li>';
            }
            navigator.geolocation.getCurrentPosition(success, error);

        }
       
        document.getElementById("validateTitle").value = "";
    }
    catch (e) {
        // alert(" provide location access!")
        // errorText.textContent = e;
    }
    // }
});