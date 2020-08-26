function encrypt(data) {
    return CryptoJS.AES.encrypt(data, getSecret()+getChannel()).toString();
}
function decrypt(data, opt) {
    try {
        return stripXSS(CryptoJS.AES.decrypt(data, getSecret()+getChannel()).toString(CryptoJS.enc.Utf8));
    } catch(err) {
        return opt;
    }
}