function compose() {
    var theMessage = document.getElementById("content").value;
    if (theMessage == null || theMessage.trim().length == 0) {
        resetTextarea("content");
    } else if (theMessage.length > 20000) {
        alert("Message too large.");
    } else {
//        const comments = document.getElementById(getGunDbName(0));
//        comments
//         getComment(user, epoch, image, message);
        put(theMessage);
    }
}
function put(theMessage) {
    const theGunDbName = getGunDbName(0);
    const theEpoch = new Date().getTime();
    const theEncryptedMessage = `cryptico${encryptMessage(theMessage)}`;
    if (typeof(localDb[theGunDbName]) == "undefined") {
        localDb[theGunDbName] = {};
    }
    localDb[theGunDbName].shouldArchive = true;
    localDb[theGunDbName][theEpoch] = theEncryptedMessage;
    loadComments(0);
    getGunDb(theGunDbName).put({ [theEpoch] : theEncryptedMessage});
    resetTextarea('content');
}