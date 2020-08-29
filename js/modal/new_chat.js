function newChat() {
    showModal("new_chat_modal");
    fetch(`index.html`)
        .then(response => response.text())
        .then(result => {
            const host = `${getRandomString(26)}`;
            const defychatDiv = `<defychat id="defychat_host" style="display: none">`;
            const endingIndex = result.lastIndexOf(defychatDiv);
            const newPage = result.substring(0, endingIndex) 
            + `${defychatDiv}${host}</defychat>`
            + `<defychat id="defychat_epoch" style="display: none">${getEpochDay(1)}</defychat>`
            + `<defychat id="defychat_channels" style="display: none">general</defychat>`
            +`</body></html>`;
            const blob = new Blob([newPage],{ type: 'text/html' });
            var formData = new FormData();
            formData.append('file', blob, 'index.html');
            fetch(`${getUploadPath(getNetwork())}${host}?filename=defychat.html&force=true`, {method: 'POST',body: formData})
                .then(response => response.json())
                .then(result => {
                    top.window.location.href = `https://${top.window.location.hostname}/${result[getUploadResponseKey(getNetwork())]}/?secret=${getRandomString(26)}`;
                })
                .catch(error => {console.error('Error:', error)});
        })
}