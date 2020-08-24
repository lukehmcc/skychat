function clickToPermalink() {
    showModal("permalink_modal");
    document.getElementById("permalink").innerHTML = `<div class="spinner-border" role="status"><span class="sr-only">In Progress...</span></div>`;
    const pin = window.location.pathname.substring(1, 47);
    const newPage = `<script>`
        + `localStorage.setItem("${getHost()}_secret", "${getSecret()}");`
        + `window.location.pathname = '${window.location.pathname}';`
        + `</` + `script>`;
    const blob = new Blob([newPage],{ type: 'text/html' });
    var formData = new FormData();
    formData.append('file', blob);
    fetch(`${getUploadPath(getNetwork())}${getRandomString(26)}?filename=permalink.html`, {method: 'POST',body: formData})
        .then(response => response.json())
        .then(result => {
            document.getElementById("permalink").innerHTML = `<a href="/${result[getUploadResponseKey(getNetwork())]}/">${result[getUploadResponseKey(getNetwork())]}</a>`;
        })
        .catch(error => {console.error('Error:', error)});
}