function compose() {
    var content = document.getElementById("content").value;
    if (content == null || content.trim().length == 0) {
        resetTextarea("content");
    } else if (content.length > 20000) {
        alert("Message too large.");
    } else {
        put(content);
    }
}
function put(content) {
    const theGunDbName = getGunDbName(0);
    const theEpoch = new Date().getTime();
    const theEncryptedContent = `${encrypt(getUser())},${encrypt(getAvatar())},${encrypt(content)},${encrypt(getChannel())}`;
    if (typeof(localDb[theGunDbName]) == "undefined") {
        localDb[theGunDbName] = {};
    }
    localDb[theGunDbName].shouldArchive = true;
    localDb[theGunDbName][theEpoch] = theEncryptedContent;
    loadComments(0);
    getGunDb(theGunDbName).put({ [theEpoch] : theEncryptedContent});
    resetTextarea('content');
}