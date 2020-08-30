function loadComments(offset) {
    var theGunDbName = getGunDbName(offset);
    var keys = Object.keys(localDb[theGunDbName]).sort();
    var shouldUpdate = false;
    var epochRegex = /^[0-9]{13}$/;
    for (var i = keys.length - 1; i >= 0; i--) {
        var key = keys[i];
        if (epochRegex.test(key)) {
            var epoch = Number(key);
            if (Number(key) < new Date().getTime()) {
                if (Number(key) > latestCommentEpoch) {
                    shouldUpdate = true;
                }
            }
        }
    }
    if (shouldUpdate) {
        var commentsHTML = "";
        for (var i = keys.length - 1; i >= 0; i--) {
            const epoch = keys[i];
            try {
                if (epochRegex.test(epoch) && Number(epoch) < new Date().getTime()) {
                    const cipherText = localDb[theGunDbName][epoch];
                    var commentHTML;
                    if (cipherText != null && cipherText.length > 8 && cipherText.startsWith("cryptico")) {
                        commentHTML = parseCrypticoCipherText(epoch, cipherText);
                    } else {
                        commentHTML = parseAesCipherText(epoch, cipherText);
                    }            
                    if (commentHTML) {
                        commentsHTML = commentHTML + commentsHTML;
                    }
                }
            } catch (err) {
                console.log(err);
            }
        }
//        if (commentsHTML !== "") {
            document.getElementById("welcome").innerHTML = "";
            var gunDbComments = document.getElementById(theGunDbName);
            if (gunDbComments == null) {
                if (offset == 0) {
                    document.getElementById("comments").innerHTML += `<div id="${theGunDbName}"></div>`;
                } else {
                    document.getElementById("comments").innerHTML = `<div id="${theGunDbName}"></div>${document.getElementById("comments").innerHTML}`;
                }
                gunDbComments = document.getElementById(theGunDbName);
            }
            var atTop = isWindowAtTop();
            var atBottom = isWindowAtBottom();
            gunDbComments.innerHTML = commentsHTML;
            if (atBottom) {
                window.scrollTo(0, document.body.scrollHeight);
            } else if (atTop && offset != 0) {
                document.getElementById(getGunDbName(offset-1)).scrollIntoView();
            }
//        }
    }
}
function parseAesCipherText(epoch, cipherText) {
    var comment = cipherText.split(",");
    if (comment.length > 2 && comment[2].length < 22000) {
        var channel = comment.length > 3 ? decrypt(comment[3]) : "l33t_hax0rz1!1!!";
        if (channel == "") {
            channel = "l33t_hax0rz1!1!!";
        }
        if (channel === getChannel()) {
            var user = decrypt(comment[0]);
            const userRegex = /^[a-zA-Z0-9 _]*$/;
            if (!user || !userRegex.test(user)) {
                user = `<i>Anonymous</i>`
            } else if (user.length > 35) {
                user = user.substring(0, 35) + `…`;
            }
            var avatar = decrypt(comment[1]);
            const pinRegex = /^[a-zA-Z0-9-_]{46}$/;
            if (pinRegex.test(avatar)) {
                avatar = `/${avatar}/`;
            } else {
                avatar = anonymousImg
            }
            var content = new showdown.Converter().makeHtml(decrypt(comment[2]).replace("![", "! ["));
            if (content) {
                return getComment(user, epoch, avatar, content, false, null);
            }
        }
    }
    return null;
}
function parseCrypticoCipherText(epoch, cipherText) {
    if (cipherText.length < 5000000) {
        const package = decryptMessage(cipherText.substring(8));
        if (package.message.length < 20000) {
            if (package.channel === getChannel()) {
                user = stripXSS(package.user);
                const userRegex = /^[a-zA-Z0-9 _]*$/;
                if (!user || !userRegex.test(user)) {
                    user = `<i>Anonymous</i>`
                } else if (user.length > 35) {
                    user = user.substring(0, 35) + `…`;
                }
                if (package.verified && package.pubKeyId.length > 3) {
                    user += ` <a href = '${getIdentity()}'>#${package.pubKeyId.substring(0, 4)}</a>`;
                }
                var avatar = stripXSS(package.avatar);
                const pinRegex = /^[a-zA-Z0-9-_]{46}$/;
                if (pinRegex.test(avatar)) {
                    avatar = `/${avatar}/`;
                } else {
                    avatar = anonymousImg
                }
                var content = new showdown.Converter().makeHtml(stripXSS(package.message).replace("![", "! ["));
                if (content) {
                    return getComment(user, epoch, avatar, content, package.verified, package.pubKeyId);
                }
            }
        }
    }
    return null;
}
function getComment(user, epoch, image, message, verified, pubKeyId) {
    var postedAt = `right now`;
    var now = new Date();
    var yesterday = new Date(now.getTime() - 86400000);
    var epochDate = new Date(Number(epoch));
    if (now.toDateString() == epochDate.toDateString()) {
        postedAt = `Today at ${epochDate.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true, minute: 'numeric' })}`;
    } else if (yesterday.toDateString() == epochDate.toDateString()) {
        postedAt = `Yesterdy at ${epochDate.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true, minute: 'numeric' })}`;
    } else {
        postedAt = epochDate.toDateString()
    }
    var classes = "rounded-circle";
    var onclick = "";
    if (verified) {
        classes += " border border-success";
        onclick = `onclick='alert("${pubKeyId}");'`;
    }
    return `<div class='row'><div class='col-2 px-2 py-2 text-right'><img class='${classes}' width='50px' height='50px' src='${transparentImg}' ${onclick} onload='loadAvatar(this, "${image}")' onerror='loadAnonymousAvatar(this)'/></div><div class='col-10 px-2 py-2 border-top overflow-auto'><b>${user}</b> <i class="text-muted">${postedAt}</i><br/>${message}</div></div>`;
}
function loadAvatar(element, image) {
    if (element.src === transparentImg) {
        element.src = image;
        setTimeout(() => {if(!element.complete){loadAnonymousAvatar(element)}}, 3000);
    }
}
function loadAnonymousAvatar(element) {
    element.src = anonymousImg;
}
function stripXSS(data) {
    return data.replace(/</g,"&lt;").replace(/>/g,"&gt;");
}