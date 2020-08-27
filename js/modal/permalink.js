function clickToPermalink() {
    showModal("permalink_modal");
    document.getElementById("permalink").innerHTML = `<div class="spinner-border" role="status"><span class="sr-only">In Progress...</span></div>`;
    const thePin = location.pathname.substring(1, 47);
    const theSecret = getSecret();
    const newPage = `<frameset><frame id="skychat_frame" src="/${thePin}/?secret=${theSecret}"></frame></frameset>`;
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