
$("#validateNotetiltle").hide();
$("#validateNoteContent").hide();
$("#validateradius").hide();
var submit = document.getElementById("notepost");


submit.addEventListener("click", (event) => {
console.log("inhere");
    $("#validateNotetiltle").hide();
    $("#validateNoteContent").hide();
    $("#validateradius").hide();
 

    var note_title = document.getElementById("note_title").value
    var NoteContent = document.getElementById("NoteContent").value
    var radius = document.getElementById("radius").value

    if (!note_title) {
        event.preventDefault();
        $("#validateNotetiltle").show();
        document.getElementById("validateNotetiltle").innerHTML = "Note title field  is required!";
    }

    if (!NoteContent) {
        event.preventDefault();
        $("#validateNoteContent").show();
        document.getElementById("validateNoteContent").innerHTML = " Please provide note content";
    }
   
    if (!radius) {
        event.preventDefault();
        $("#validateradius").show();
        document.getElementById("validateradius").innerHTML = " Please provide radius";
    }
   
   // var input = document.getElementById("validateTitle").value;

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
                var s= document.getElementById('longitude');
                s.value = -89.574563
                var s1= document.getElementById('latitude');
                s1.value = 44.5235792
                // event.preventDefault();
                // alert('Unable to retrieve your location');
            }
            function success(position) {
                var s= document.getElementById('longitude');
                s.value = position.coords.longitude
                var s1= document.getElementById('latitude');
                s1.value = position.coords.latitude
                list_ol.innerHTML += '<li class="lalo">' + position.coords.latitude + '||' + position.coords.longitude + '</li>';
            }
            navigator.geolocation.getCurrentPosition(success, error);

        }
       
        document.getElementById("validateTitle").value = "";
    }
    catch (e) {

        var s= document.getElementById('longitude');
        s.value = -89.574563
        var s1= document.getElementById('latitude');
        s1.value = 44.5235792
        //alert(" provide location access!")
        // errorText.textContent = e;
    }
    
}, true);


