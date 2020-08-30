function encrypt(data) {
    return CryptoJS.AES.encrypt(data, getSecret()).toString();
}
function decrypt(data, opt) {
    try {
        return stripXSS(CryptoJS.AES.decrypt(data, getSecret()).toString(CryptoJS.enc.Utf8));
    } catch(err) {
        return opt;
    }
}
function getRsaBits() {
	return 2048;
}
function getChatRsaKey() {
	return chatRsaKey;
}
function getChatPubKey() {
	return chatPubKey;
}
var userRsaKey;
var userPubKeyId;
function setUserRsaKey(user, passphrase) {
	if (user === null || passphrase === null) {
		return userRsaKey = null;
	} else {
        userRsaKey = cryptico.generateRSAKey(`${user}***${passphrase}`, getRsaBits());
        const theUserPubKey = cryptico.publicKeyString(userRsaKey);
        userPubKeyId = cryptico.publicKeyID(theUserPubKey);
	}
}
function getUserRsaKey() {
    return userRsaKey;
}
function getUserPubKeyId() {
	return userPubKeyId;
}
function encryptMessage(theMessage) {
	var package = {};
	package.user = getUser();
	package.avatar = getAvatar();
	package.identity = getIdentity();
	package.message = theMessage;
	package.secret = getSecret();
	package.channel = getChannel();
    return cryptico
            .encrypt(
                JSON.stringify(package),
                getChatPubKey(),
                getUserRsaKey()
            ).cipher;
}
function decryptMessage(cipherText) {
	const decrypted = cryptico.decrypt(cipherText, getChatRsaKey());
    // decrypted.status: "success" if decryption succeeded, "failure" if it failed. Does not reflect the status of the signature verification.
    // decrypted.plaintext: The decrypted message.
    // decrypted.signature: "unsigned" if there was no signature, "verified" if it is signed and valid, "forged" if the signature fails verification.
    // decrypted.publicKeyString: public key string of the signature (presumably the sender). Returned even if the signature appears to be forged.

	var package = JSON.parse(decrypted.plaintext);
	package.verified = decrypted.signature === "verified";
	package.pubKeyId = cryptico.publicKeyID(decrypted.publicKeyString);
    return package;
}