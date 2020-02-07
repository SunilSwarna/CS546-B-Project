$('ajaxError').hide()
function add_comment(e, note_id, user_id, index) {
    var comment_body = document.getElementById('"' + note_id + '"').value
    var requestConfig = {
        method: "POST",
        url: "/addPost/comment",
        contentType: "application/json",
        data: JSON.stringify({ "note_id": note_id, "user_id": user_id, "comment": comment_body })
    };

    $.ajax(requestConfig).then(function (responseMessage) {
        console.log(responseMessage)
        var comment_data = responseMessage.data
        document.getElementById('"' + note_id + '"').value = ""
        var comments = document.getElementById(index);

        comments.innerHTML += '<div class="d-flex" style="background-color: #cccccc73;margin-bottom: 0.5%;border-radius: 11px;">' +
            `<div class="p-2" style="text-transform: lowercase;color: #0062cc;">${comment_data.name}</div>` +
            `<div class="p-2" style="font-family: sans-serif;">${comment_data.description}</div>` +
            `<div class="ml-auto p-2">On ${comment_data.commented_at}</div></div>`

        // $(e).parent().remove()
        // do add msg saying friend is succesfully added
    }).catch(function (error) {
        console.log(error.responseJSON)
    });;
}

function delete_note(e, note_id, index) {
    console.log(note_id);

    var requestConfig = {
        method: "DELETE",
        url: "/addPost/deletnote/" + note_id,
    };

    $.ajax(requestConfig).then(function (responseMessage) {
        console.log(responseMessage)
        // $(e).closest('div').removeClass("shadow card text-center w-75 offset-1 mb-3");

        // $(e).closest('.anyClass').remove()
        if (responseMessage.deleted == true) {
            var id_div = '"' + note_id + '"' + "@" + String(index)
            var info = document.getElementById(id_div)
            info.remove();
            var errorMsg = document.getElementById("ajaxError");
            $( "#ajaxError" ).empty();
            errorMsg.innerHTML += `<div class='alert alert-danger' role='alert'>Succuessfully deleted Note</div>`
            $('ajaxError').show()
        }
        if (responseMessage.deleted == false) {
            var errorMsg = document.getElementById("ajaxError");

            errorMsg.innerHTML += `<div class='alert alert-danger' role='alert'>${responseMessage.error}</div>`
            $( "#ajaxError" ).empty();
            $('ajaxError').show()
        }

    }).catch(function (error) {


        console.log(error)
    });;
}

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
$("#validateNotetiltle").hide();
$("#validateNoteContent").hide();
$("#validateradius").hide();
var submit = document.getElementById("notepost");


// submit.addEventListener("click", (event) => {
//     console.log("inhere");
//     $("#validateNotetiltle").hide();
//     $("#validateNoteContent").hide();
//     $("#validateradius").hide();


//     var note_title = document.getElementById("note_title").value
//     var NoteContent = document.getElementById("NoteContent").value
//     var radius = document.getElementById("radius").value

//     if (!note_title) {
//         event.preventDefault();
//         $("#validateNotetiltle").show();
//         document.getElementById("validateNotetiltle").innerHTML = "Note title field  is required!";
//     }

//     if (!NoteContent) {
//         event.preventDefault();
//         $("#validateNoteContent").show();
//         document.getElementById("validateNoteContent").innerHTML = " Please provide note content";
//     }

//     if (!radius) {
//         event.preventDefault();
//         $("#validateradius").show();
//         document.getElementById("validateradius").innerHTML = " Please provide radius";
//     }


//     var getPosition = function (options) {
//         return new Promise(function (resolve, reject) {
//             navigator.geolocation.getCurrentPosition(resolve, reject, options);
//         });
//     }

//     getPosition()
//         .then((position) => {
//             var s = document.getElementById('longitude');
//             s.value = position.coords.longitude
//             var s1 = document.getElementById('latitude');
//             s1.value = position.coords.latitude
//         })
//         .catch((err) => {
//             var s = document.getElementById('longitude');
//             s.value = -74.024255
//             var s1 = document.getElementById('latitude');
//             s1.value = 40.745094
//         });



// }, true);


submit.addEventListener("click", (event) => {
    $('ajaxError').hide()
    $("#validateNotetiltle").hide();
    $("#validateNoteContent").hide();
    $("#validateradius").hide();

    async function getAdress() {
        var options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        };

        function success(position) {

            var s = document.getElementById('longitude');
            s.value = position.coords.longitude
            var s1 = document.getElementById('latitude');
            s1.value = position.coords.latitude
            restCode()
        }

        function error(err) {
            var s = document.getElementById('longitude');
            s.value = -74.024255
            var s1 = document.getElementById('latitude');
            s1.value = 40.745094
            restCode()
        }
        navigator.geolocation.getCurrentPosition(success, error, options);

    }
    getAdress()
    // setTimeout(getAdress, 3000);
    async function restCode() {
        // setTimeout(getAdress, 3000);
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


    }

}, true);
