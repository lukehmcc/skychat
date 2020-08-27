function portal() {
    document.getElementById('portal-trigger-container').style.display = `none`;
    document.getElementById('portal-loading-container').style.display = `block`;
    var formData = new FormData();
    formData.append('file', new Blob([""],{ type: 'text/html' }));
    const thePortal = `https://${document.getElementById('portal').value}`;
    fetch(`${thePortal}${getUploadPath(getNetwork())}${getRandomString(26)}?dryrun=true&filename=exists.query`, {method: 'POST',body: formData})
        .then(response => response.json())
        .then(result => {
            top.window.location.href = `${thePortal}${top.window.location.pathname}${top.window.location.search}`;
        })
        .catch(error => {
            const pin = location.pathname.substring(1, 47);
            fetch(`index.html`)
                .then(response => response.text())
                .then(result => {
                    var theNetwork = getNetwork() == "sia" ? "prime" : "sia";
                    var formData = new FormData();
                    formData.append('file', new Blob([result],{ type: 'text/html' }), 'index.html');
                    fetch(`${thePortal}${getUploadPath(theNetwork)}${getHost()}?filename=skychat.html&force=true`, {method: 'POST',body: formData})
                        .then(response => response.json())
                        .then(result => {
                            top.window.location.href = `${thePortal}/${result[getUploadResponseKey(theNetwork)]}/?secret=${getSecret()}`;
                        })
                        .catch(error => {
                            document.getElementById('portal-trigger-container').style.display = `block`;
                            document.getElementById('portal-loading-container').style.display = `none`;
                            alert(`Unable to chang portal to ${thePortal}`);
                            console.error('Error:', error)
                        });
                })
        });
}