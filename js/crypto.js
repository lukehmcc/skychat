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