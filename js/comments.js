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
            try {
                var key = keys[i];
                if (epochRegex.test(key) && Number(key) < new Date().getTime()) {
                    var comment = localDb[theGunDbName][key].split(",");
                    if (comment.length > 2 && comment[2].length < 22000) {
                        console.log("getChannels()[0]: " + getChannels()[0]);
                        console.log("getChannel(): " + getChannel());
                        var channel = comment.length > 3 ? decrypt(comment[3]) : "";
                        if (channel === getChannel()) {
                            var user = decrypt(comment[0]);
                            if (!user) {
                                user = `<i>Anonymous</i>`
                            } else if (user.length > 35) {
                                user = user.substring(0, 35) + `…`;
                            }
                            var epoch = key;
                            var contact = decrypt(comment[1]);
                            var contactImg = "";
                            var pinRegex = /^[a-zA-Z0-9-_]{46}$/;
                            if (pinRegex.test(contact)) {
                                contactImg = `/${contact}/`;
                            } else {
                                contactImg = anonymousImg
                            }
                            var content = new showdown.Converter().makeHtml(decrypt(comment[2]).replace("![", "! ["));
                            if (content) {
                                commentsHTML = getComment(i, user, epoch, contactImg, content) + commentsHTML;
                            }
                        }
                    }
                }
            } catch (err) {
                // skip comment
            }
        }
        if (commentsHTML !== "") {
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
        }
    }
}
function getComment(i, user, epoch, image, message) {
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
    return `<div class='row'><div class='col-2 px-2 py-2 text-right'><img class='rounded-circle' width='50px' height='50px' src='${transparentImg}' onload='loadAvatar(this, "${image}")' onerror='loadAnonymousAvatar(this)'/></div><div class='col-10 px-2 py-2 border-top overflow-auto'><b>${user}</b> <i class="text-muted">${postedAt}</i><br/>${message}</div></div>`;
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