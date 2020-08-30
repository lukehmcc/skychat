var gun;
var chatRsaKey;
var chatPubKey;

function initiate() {
    initiateGunDb();
    initializeCrypto();
    initiateChannels();
    initiateCommentContainers();
    initiateWelcomeMessage();
    initiateNetworkAndComments();
    initiatePortals();
    initiateCommentArchiving();
    initiateUserAndAvatar();
    window.scrollTo(0,document.body.scrollHeight);
    const theUser = getUser();
    const thePass = getPassphrase();
    if (theUser === null || theUser == "" || thePass === null || thePass == "") {
        clickToLogin();
    } else {
        setUser(theUser, thePass);
    }
}
function initiateGunDb() {
    gun = Gun({
        peers:[
            'https://wxgmpooriyjyc6zg7zqgfcw1kw.herokuapp.com/gun',
            'https://swqbggscpo92sbjatex2tryurq.herokuapp.com/gun'
        ],
        localStorage: false
    });
}
function initializeCrypto() {
    chatRsaKey = cryptico.generateRSAKey(getSecret(), getRsaBits());
    chatPubKey = cryptico.publicKeyString(chatRsaKey);
}
function initiateChannels() {
    var currentChannel = getChannel();
    var theChannels = getChannels();
    for (var i = 0; i < theChannels.length; i++) {
        var theChannel = theChannels[i];
        var textClass = theChannel === currentChannel ? "text-white" : "text-muted";
        var onClick = `onclick="setChannel('${theChannel}');location = location;"`
        document.getElementById("channels").innerHTML += `<li class="nav-item"><button type="button" class="btn btn-link ${textClass}" ${onClick}>#${theChannel}</button></li>`;
    }
}
function initiateCommentContainers() {
    var epochDifference = getEpochDay(0) - getEpoch() + 1;
    for (var i = 0; i < epochDifference && i < 100; i++) {
        initiateCommentContainer(i);
    }
}
function initiateCommentContainer(offset) {
    var gunDbName = getGunDbName(offset);
    if (document.getElementById(gunDbName) == null) {
        document.getElementById("comments").innerHTML = `<div id="${gunDbName}"></div>${document.getElementById("comments").innerHTML}`;
    }
}
function initiateWelcomeMessage() {
    if (getEpochDay(0) - getEpoch() <= 1) {
        document.getElementById("welcome").style.display = "block";
    }
}
function initiateNetworkAndComments() {
    var formData = new FormData();
    formData.append('file', new Blob([""],{ type: 'text/html' }));
    fetch(`${getUploadPath("sia")}${getRandomString(26)}?dryrun=true&filename=exists.query`, {method: 'POST',body: formData})
        .then(response => response.json())
        .then(result => {
            setNetwork(`sia`);
            initiateComments(0);
        })
        .catch(error => {
            setNetwork(`prime`);
            initiateComments(0);
        });
}
function initiateComments(offset) {
    const theGunDbName = getGunDbName(offset);
    if (typeof(localDb[theGunDbName]) == "undefined") {
        localDb[theGunDbName] = {shouldArchive: false};
    }
    const pin = localStorage.getItem(theGunDbName);
    if (pin !== null) {
        intiateCommentsFromSkynet(offset);
    } else {
        initiateCommentsFromGunDb(offset);
    }
}
function intiateCommentsFromSkynet(offset) {
    const theGunDbName = getGunDbName(offset);
    const pin = localStorage.getItem(theGunDbName);            
    fetch(`/${pin}/`)
        .then(response => response.text())
        .then(result => {
            const data = JSON.parse(result);
            var keys = Object.keys(data);
            var epochRegex = /^[0-9]{13}$/;
            for (var i = keys.length - 1; i >= 0; i--) {
                var key = keys[i];
                if (epochRegex.test(key) && Number(key) < new Date().getTime()) {
                    var comment = data[key];
                    if (comment.length < 10000) {
                        localDb[theGunDbName][key] = comment;
                        getGunDb(theGunDbName).put({ [key] : comment});
                    }
                }
            };
            initiateCommentsFromGunDb(offset);
        })
}
function initiateCommentsFromGunDb(offset) {
    getGunDb(getGunDbName(offset))
    .not(function(key){
        loadComments(offset);
        initiateContinuousScroll();
    })
    .on(function(data, key) {
        var keys = Object.keys(data);
        var theGunDbName = getGunDbName(offset);
        var epochRegex = /^[0-9]{13}$/;
        var shouldArchive = false;
        for (var i = keys.length - 1; i >= 0; i--) {
            var key = keys[i];
            if (epochRegex.test(key) && Number(key) < new Date().getTime()) {
                var comment = data[key];
                if (comment.length < 10000) {
                    if (typeof(localDb[theGunDbName][key]) == "undefined") {
                        shouldArchive = true;
                        localDb[theGunDbName][key] = comment;
                    }
                }
            }
        };
        if (shouldArchive) {
            localDb[theGunDbName].shouldArchive = shouldArchive;
        }
        loadComments(offset);
        initiateContinuousScroll();
    })
}
function initiateContinuousScroll() {
    if (window.pageYOffset != 0) {
        setTimeout(function(){initiateContinuousScroll();}, 250);
    } else if (getEpochDay(commentOffset) > getEpoch()){
        commentOffset++;
        initiateComments(commentOffset);
    }
}
function initiatePortals() {
    gun
    .get(getGunDbName(0) + "_portals")
    .not(function(key){
        document.getElementById("portalSelect").innerHTML = `<option onclick="document.getElementById('portal').value=''">...</option><option onclick="document.getElementById('portal').value='${getPortal()}'">${getPortal()}</option>`;
        putPortal(getPortal());
    })
    .on(function(data, key) {
        var thePortals = new Object();
        var theKeys = Object.keys(data);
        var portalRegex = /^[a-zA-Z0-9-_\.].*$/;
        for(var i  = 0; i < theKeys.length; i++) {
            var theKey = theKeys[i];
            if (theKey.length < 50) {
                try {
                    var thePortal = decrypt(theKey);
                    if (thePortal.length > 5 && portalRegex.test(thePortal)) {
                        thePortals[thePortal] = "exists";
                    }
                } catch(err) {
                    //ignore
                }
            }
        }
        if (thePortals[getPortal()] !== "exists") {
            thePortals[getPortal()] = "exists";
            putPortal(getPortal());
        }
        var theOptions  = Object.keys(thePortals).sort();
        document.getElementById("portalSelect").innerHTML = `<option onclick="document.getElementById('portal').value=''">...</option>`;
        for(var i = 0; i < theOptions.length; i++) {
            document.getElementById("portalSelect").innerHTML += `<option onclick="document.getElementById('portal').value='${theOptions[i]}'">${theOptions[i]}</option>`;
        }
    })
}
function initiateCommentArchiving() {
    setTimeout(() => {archiveComments(0)}, 1000 * 10);
    setInterval(() => {archiveComments(0)}, 1000 * 60 * 5);
}
function initiateUserAndAvatar() {
    const theUser = new URLSearchParams(top.window.location.search).get(`user`);
    const thePass = new URLSearchParams(top.window.location.search).get(`pass`);
    if (theUser !== null && thePass != null) {
        setUser(theUser, thePass);
    }
    displayUser();
    const theAvatar = new URLSearchParams(top.window.location.search).get(`avatar`);
    if (theAvatar !== null) {
        setAvatar(theAvatar);
    }
    displayAvatar();

}