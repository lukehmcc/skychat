function newChat() {
    showModal("new_chat_modal");
    const pin = window.location.pathname.substring(1, 47);
    fetch(`index.html`)
        .then(response => response.text())
        .then(result => {
            const host = `${getRandomString(26)}`;
            const skychatDiv = `<skychat id="skychat_host" style="display: none">`;
            const endingIndex = result.lastIndexOf(skychatDiv);
            const newPage = result.substring(0, endingIndex) 
            + `${skychatDiv}${host}</skychat>`
            + `<skychat id="skychat_epoch" style="display: none">${getEpochDay(1)}</skychat>`
            + `<skychat id="skychat_channels" style="display: none">general</skychat>`
            +`</body></html>`;
            const blob = new Blob([newPage],{ type: 'text/html' });
            var formData = new FormData();
            formData.append('file', blob, 'index.html');
            fetch(`${getUploadPath(getNetwork())}${host}?filename=skychat.html&force=true`, {method: 'POST',body: formData})
                .then(response => response.json())
                .then(result => {
                    window.location.pathname = `/${result[getUploadResponseKey(getNetwork())]}/`;
                })
                .catch(error => {console.error('Error:', error)});
        })
}