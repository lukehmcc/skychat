function upload() {
    document.getElementById('upload-trigger-container').style.display = `none`;
    document.getElementById('upload-loading-container').style.display = `block`;
    var file = document.getElementById('upload').files[0];
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
                put(`[${file.name}](https://${getPortal()}/${data[getUploadResponseKey(getNetwork())]}/)`);
                $("#resultsModal").modal("hide");
            },
            error: function (jqXHR, textStatus, errorThrown) {
                $("#resultsModal").modal("hide");
                alert("Unable to upload file.")
            }
        });
    } else {
        alert("No file to upload");
    }
}