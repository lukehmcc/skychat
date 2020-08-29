var gunDb = {};
var localDb = {};

var commentOffset = 0;
var latestCommentEpoch = 0;
var transparentImg = `data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==`
var anonymousImg = `data:image/png;base64,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`;

var originalHeight = null;
function expandTextarea(id) {
    if (originalHeight === null) {
        document.getElementById(id).addEventListener('keyup', function() {
            if (originalHeight == null) {
                originalHeight = this.scrollHeight + 2;
            }
            this.style.overflow = 'hidden';
            this.style.height = 0;
            this.style.height = this.scrollHeight > 250 ? '250px' : this.scrollHeight + 'px';
        }, false);
        document.getElementById(id).addEventListener("keyup", (event) => {
            if (event.keyCode == 13 && !event.shiftKey) {
                compose();
                return false;
            }
        });
    }
}
function resetTextarea(id) {
    var textArea = document.getElementById(id);
    textArea.value = null;
    if (originalHeight !== null) {
        textArea.style.height = originalHeight + 'px';
    }
}
function getNetwork() {
    return sessionStorage.getItem(`${getHost()}_network`);
}
function setNetwork(network) {
    sessionStorage.setItem(`${getHost()}_network`, network);
}
function getUploadPath(network) {
    return network === `sia` ? `/skynet/skyfile/` : `/pubaccess/pubfile/`;
}
function getUploadResponseKey(network) {
    return network === `sia` ? `skylink` : `publink`;
}
function putPortal(portal) {
    getGunDb(getGunDbName(0) + "_portals").put({ [encrypt(portal)]: `${getRandomString(26)}`});
}
function getPortal() {
    return window.location.hostname;
}
function getUser() {
    try {
        const encryptedUser = localStorage.getItem(getHost() + "_user");
        return encryptedUser === null ? null : decrypt(encryptedUser);
    } catch(err) {
        return null;
    }
}
function setUser(user) {
    localStorage.setItem(getHost() + "_user", encrypt(user));
    displayUser();
}
function resetUser() {
    localStorage.removeItem(getHost() + "_user");
    displayUser();
}
function displayUser() {
    const theUser = getUser();
    const userRegex = /^[a-zA-Z0-9 _]*$/;
    const displayUser = theUser !== null && theUser != "" && userRegex.test(theUser) ? theUser : "Anonymous";
    document.getElementById("username").innerHTML = `@${displayUser}`;
}
function getAvatar() {
    try {
        const encryptedAvatar = localStorage.getItem(getHost() + "_avatar");
        return encryptedAvatar === null ? null : decrypt(encryptedAvatar);
    } catch(err) {
        return null;
    }
}
function setAvatar(avatar) {
    localStorage.setItem(getHost() + "_avatar", encrypt(avatar));
    displayAvatar();
}
function resetAvatar() {
    localStorage.removeItem(getHost() + "_avatar");
    displayAvatar();
}
function displayAvatar() {
    const avatar = getAvatar();
    const pinRegex = /^[a-zA-Z0-9-_]{46}$/;
    const avatarSrc = avatar !== null && pinRegex.test(avatar) ? `/${avatar}/` : anonymousImg;
    document.getElementById("avatar").src = avatarSrc;
}
function getChannel() {
    var theChannel = localStorage.getItem(getHost() + "_channel");
    return theChannel === null || theChannel == "" ? "l33t_hax0rz1!1!!" : theChannel;
}
function setChannel(channel) {
    localStorage.setItem(getHost() + "_channel", channel);
}
function getGunDbName(offset) {
    var epochDay = getEpochDay(offset);
    if (epochDay < 18491) {
        return getHost();
    } else {
        return getHost() + "_" + epochDay;
    }
}
function getGunDb(gunDbName) {
    if (typeof(gunDb[gunDbName]) == "undefined") {
        gunDb[gunDbName] = gun.get(gunDbName);
    }
    return gunDb[gunDbName];
}
function getEpochDay(offset) {
    return Math.round(new Date().getTime()/86400000) - offset;
}
function isWindowAtBottom() {
    return (window.innerHeight + window.pageYOffset) > document.body.offsetHeight - 5;
}
function isWindowAtTop() {
    return window.pageYOffset < 5;
}