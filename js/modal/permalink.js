function clickToPermalink() {
    showModal("permalink_modal");
    document.getElementById("permalink").innerHTML = `<div class="spinner-border" role="status"><span class="sr-only">In Progress...</span></div>`;
    const thePin = location.pathname.substring(1, 47);
    const theSecret = getSecret();
    const newPage = `<!DOCTYPE html>`
        + `<html lang="en">`
        + `<head>`
        + `<title>Defy.chat</title>`
        + `<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">`
        + `<meta content="text/html;charset=utf-8" http-equiv="Content-Type">`
        + `<meta content="utf-8" http-equiv="encoding">`
        + `</head>`
        + `<frameset><frame id="defychat_frame" src="/${thePin}/?secret=${theSecret}"></frame></frameset>`
        + `</html>`;
    const blob = new Blob([newPage],{ type: 'text/html' });
    var formData = new FormData();
    formData.append('file', blob, 'index.html');
    fetch(`${getUploadPath(getNetwork())}${getRandomString(26)}?filename=permalink.html&force=true`, {method: 'POST',body: formData})
        .then(response => response.json())
        .then(result => {
            document.getElementById("permalink").innerHTML = `<a href="/${result[getUploadResponseKey(getNetwork())]}/">${result[getUploadResponseKey(getNetwork())]}</a>`;
        })
        .catch(error => {console.error('Error:', error)});
}