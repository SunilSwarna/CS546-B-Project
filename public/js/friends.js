
$('#loading').hide()
$('#friendMsg').hide()

var submit = document.getElementById("searchFriends");

submit.addEventListener("click", (event) => {

    $('#friendMsg').hide()
    var name = document.getElementById("search").value
    event.preventDefault();

    if (!name) {
        $("#search").focus();
    }
    else{
        $('#loading').hide()
        console.log(name)

        var requestConfig = {
            method: "POST",
            url: "/friends/search",
            contentType: "application/json",
            data: JSON.stringify({"name": name})
        };
    
        $.ajax(requestConfig).then(function (responseMessage) {
            // console.log(responseMessage)
            var list_friends = document.getElementById("listfriends");
            $('#listfriends').empty()
            for(let i=0; i<responseMessage.temp_name_results.length; i++)
            {
                var person = responseMessage.temp_name_results[i]
                if(person.status && person.status ==2){
                    list_friends.innerHTML += '<li style="border: none" class="list-group-item d-flex justify-content-between">' +
                `<span class="mt-2">${person.firstName+" "+ person.lastName}</span>`+
                    "<button style='margin-left:15px;color: rgb(255, 255, 255);background-color: #0012e8;' class='btn btn-primary btn-sm' disabled>"+
                    'Pending Request</button>' +
                    '</li>';
                }
                else if(person.status && person.status ==1){
                    list_friends.innerHTML += '<li style="border: none" class="list-group-item d-flex justify-content-between">' +
                `<span class="mt-2">${person.firstName+" "+ person.lastName}</span>`+
                    "<button style='margin-left:15px;color: rgb(255, 255, 255);background-color: #0012e8;' class='btn btn-primary btn-sm' disabled>"+
                    'Already Friend</button>' +
                    '</li>';
                }
                else{
                    list_friends.innerHTML += '<li style="border: none" class="list-group-item d-flex justify-content-between">' +
                `<span class="mt-2">${person.firstName+" "+ person.lastName}</span>`+
                    "<button style='margin-left:15px;color: rgb(255, 255, 255);' class='btn btn-primary btn-sm' onClick='add_friend(this,\""+String(person.friendID)+"\" )'>"+
                    'Add Friend</button>' +
                    '</li>';
                }
                
            }
            
            if(responseMessage.found == false){
                $('#friendMsg').show()
                $('#friendMsg').empty()
                var friend_message = document.getElementById("friendMsg");
                var info = "No Friends with Name "+String(responseMessage.name)
                friend_message.innerHTML += `<li class='list-group-item list-group-item-info'>${info}</li>`
            }
        });

    }

    
});



function add_friend(e, id) {
    console.log(id);
    
        var requestConfig = {
            method: "POST",
            url: "/friends/add/"+ id,
        };
    
        $.ajax(requestConfig).then(function (responseMessage) {
            console.log(responseMessage)
            $(e).parent().remove()
            // do add msg saying friend is succesfully added
        });
        
}


function accept_friend(e, id) {
    // friend user id is passed
    console.log(id);
    
        var requestConfig = {
            method: "POST",
            url: "/friends/accept/"+ id,
        };
    
        $.ajax(requestConfig).then(function (responseMessage) {
            console.log(responseMessage)
            $(e).parent().remove()
            // do add msg saying friend is succesfully added
        }).catch(function (error) {
            console.log(error)
        });;
        
}

function delete_friend(e, id) {
    console.log(id)
    console.log(id);
    
        var requestConfig = {
            method: "POST",
            url: "/friends/delete/"+ id,
        };
    
        $.ajax(requestConfig).then(function (responseMessage) {
            console.log(responseMessage)
            $(e).parent().remove()
            // do add msg saying friend is succesfully added
        }).catch(function (error) {
            console.log(error)
        });;
        
}