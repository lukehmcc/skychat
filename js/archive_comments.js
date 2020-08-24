function archiveComments(offset) {
    var theGunDbName = getGunDbName(offset);
    if (typeof(localDb[theGunDbName]) != "undefined") {
        if (!localDb[theGunDbName].shouldArchive) {
            if (theGunDbName !== getGunDbName(offset + 1)) {
                setTimeout(() => {archiveComments(offset + 1)}, 1000);
            }
        } else {
            const blob = new Blob([JSON.stringify(localDb[theGunDbName])],{ type: 'application/json' });
            var formData = new FormData();
            formData.append('file', blob);
            fetch(`${getUploadPath(getNetwork())}${getRandomString(26)}?filename=${getRandomString(26)}.json`, {method: 'POST',body: formData})
                .then(response => response.json())
                .then(result => {
                    localStorage.setItem(theGunDbName, result[getUploadResponseKey(getNetwork())]);
                    localDb[theGunDbName].shouldArchive = false;
                    if (theGunDbName !== getGunDbName(offset + 1)) {
                        setTimeout(() => {archiveComments(offset + 1)}, 1000);
                    }
                })
                .catch(error => {console.log(error)});
        }
    }
}