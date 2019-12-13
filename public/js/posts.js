
// $('#loading').hide()
// $('#friendMsg').hide()

var submit = document.getElementById("searchFriends");

submit.addEventListener("click", (event) => {


    var name = document.getElementById("search").value
    event.preventDefault();

    if (!name) {
        $("#search").focus();
    }
    else{
        // $('#loading').hide()
        console.log(name)

        var requestConfig = {
            method: "POST",
            url: "/friends/getPosts/name",
            contentType: "application/json",
            data: JSON.stringify({"name": name})
        };
    
        $.ajax(requestConfig).then(function (responseMessage) {
            console.log(responseMessage)
            var list_friends = document.getElementById("listfriends");
            $('#listfriends').empty()
            for(let i=0; i<responseMessage.temp_name_results.length; i++)
            {
                var person = responseMessage.temp_name_results[i]
                
                    list_friends.innerHTML += `<a href='id/${person._id}' style='border: none' class='list-group-item list-group-item-action active d-flex justify-content-between mb-2'>` +
                `<span class="mt-2">${person.firstName+" "+ person.lastName}</span>`+
                    '</a>';
            
            }
            if(responseMessage.temp_name_results.length==0){
                var info = "No friends with Name "+String(name)
                list_friends.innerHTML += `<li class='list-group-item list-group-item-info'>${info}</li>`
            }
            
        });

    }

    
});

function goto_friend_post(user_id){
    console.log(user_id)
}