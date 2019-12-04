
$('#loading').hide()
$('#friendMsg').hide()

var submit = document.getElementById("searchFriends");

submit.addEventListener("click", (event) => {


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
            console.log(responseMessage)
            var list_friends = document.getElementById("listfriends");
            $('#listfriends').empty()
            for(let i=0; i<responseMessage.arr.length; i++)
            {
                list_friends.innerHTML += '<li style="border: none" class="list-group-item d-flex justify-content-between">' +
                `<span>${responseMessage.arr[i].name}</span>`+
                    `<button style="margin-left:15px" class="btn btn-primary " onClick="add_friend(this, ${responseMessage.arr[i].id})">` +
                    'Add Friend</button>' +
                    '</li>';
            }
            
        });

    }

    
});



function add_friend(e, id) {
    console.log(id)
    // ;
    
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
    console.log(id)
    // ;
    
        // var requestConfig = {
        //     method: "POST",
        //     url: "/friends/add/"+ id,
        // };
    
        // $.ajax(requestConfig).then(function (responseMessage) {
        //     console.log(responseMessage)
        //     $(e).parent().remove()
        //     // do add msg saying friend is succesfully added
        // });
        
}

function delete_friend(e, id) {
    console.log(id)
    // ;
    
        // var requestConfig = {
        //     method: "POST",
        //     url: "/friends/add/"+ id,
        // };
    
        // $.ajax(requestConfig).then(function (responseMessage) {
        //     console.log(responseMessage)
        //     $(e).parent().remove()
        //     // do add msg saying friend is succesfully added
        // });
        
}