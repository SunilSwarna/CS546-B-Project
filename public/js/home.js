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
            `<div class="p-2" style="text-transform: lowercase;">${comment_data.name}</div>` +
            `<div class="p-2">${comment_data.description}</div>` +
            `<div class="ml-auto p-2">On ${comment_data.commented_at}</div></div>`

        // $(e).parent().remove()
        // do add msg saying friend is succesfully added
    }).catch(function (error) {
        console.log(error.responseJSON)
    });;
}
