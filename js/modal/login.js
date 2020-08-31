function login() {
    document.getElementById('login-trigger-container').style.display = `none`;
    document.getElementById('login-loading-container').style.display = `block`;
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
                finializeLogin(data[getUploadResponseKey(getNetwork())]);
                $("#resultsModal").modal("hide");
            },
            error: function (jqXHR, textStatus, errorThrown) {
                finializeLogin("");
                $("#resultsModal").modal("hide");
            }
        });
    } else {
        finializeLogin("");
        $("#resultsModal").modal("hide");
    }
}
function finializeLogin(avatar) {
    const theUser = document.getElementById("user").value;
    const thePass = document.getElementById("pass").value;
    setUser(theUser, thePass);
    setIdentity(document.getElementById("identity").value);
    setAvatar(avatar);
}