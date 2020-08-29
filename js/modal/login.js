function login() {
    document.getElementById('login-trigger-container').style.display = `none`;
    document.getElementById('login-loading-container').style.display = `block`;
    setUser(document.getElementById("user").value);
    setAvatar("");
    var file = document.getElementById('contact').files[0];
    if (file != null) {
        $.ajax({
            url: `${getUploadPath(getNetwork())}${getRandomString(26)}?filename=${file.name}`,
            type: 'POST',
            data: file,
            mimeType: "multipart/form-data",
            contentType: false,
            cache: false,
            processData: false,
            dataType: 'json',
            success: function (data, textStatus, jqXHR) {
                setAvatar(data[getUploadResponseKey(getNetwork())]);
                $("#resultsModal").modal("hide");
            },
            error: function (jqXHR, textStatus, errorThrown) {
                $("#resultsModal").modal("hide");
            }
        });
    } else {
        $("#resultsModal").modal("hide");
    }
}