function newChat() {
    showModal("new_chat_modal");
    const pin = window.location.pathname.substring(1, 47);
    fetch(`/${pin}/`)
        .then(response => response.text())
        .then(result => {
            const host = `${getRandomString(26)}`;
            const skychatDiv = `<skychat id="skychat_host" style="display: none">`;
            const endingIndex = result.lastIndexOf(skychatDiv);
            const newPage = result.substring(0, endingIndex) 
            + `${skychatDiv}${host}</skychat><skychat id="skychat_epoch" style="display: none">${getEpochDay(1)}</skychat></body></html>`;
            const blob = new Blob([newPage],{ type: 'text/html' });
            var formData = new FormData();
            formData.append('file', blob);
            fetch(`${getUploadPath(getNetwork())}${host}?filename=skychat.html`, {method: 'POST',body: formData})
                .then(response => response.json())
                .then(result => {
                    window.location.pathname = `/${result[getUploadResponseKey(getNetwork())]}/`;
                })
                .catch(error => {console.error('Error:', error)});
        })
}