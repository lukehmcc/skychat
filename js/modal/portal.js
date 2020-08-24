function portal() {
    document.getElementById('portal-trigger-container').style.display = `none`;
    document.getElementById('portal-loading-container').style.display = `block`;
    var formData = new FormData();
    formData.append('file', new Blob([""],{ type: 'text/html' }));
    const thePortal = `${window.location.protocol}//${document.getElementById('portal').value}`;
    fetch(`${thePortal}${getUploadPath(getNetwork())}${getRandomString(26)}?dryrun=true&filename=exists.query`, {method: 'POST',body: formData})
        .then(response => response.json())
        .then(result => {
            window.location.href = `${thePortal}/${window.location.pathname.substring(1, 47)}/?secret=${getSecret()}`;
        })
        .catch(error => {

var theNetwork = getNetwork() == "sia" ? "prime" : "sia";
    var formData = new FormData();
    $.when(
        $.get(`index.html`, function( data ) {formData.append('file', new Blob([data],{ type: 'text/html' }), 'index.html')}),
        $.get(`js/archive_comments.js`, function( data ) {formData.append('file', new Blob([data],{ type: 'application/json' }), 'js/archive_comments.js')}),
        $.get(`js/comments.js`, function( data ) {formData.append('file', new Blob([data],{ type: 'application/json' }), 'js/comments.js')}),
        $.get(`js/crypto.js`, function( data ) {formData.append('file', new Blob([data],{ type: 'application/json' }), 'js/crypto.js')}),
        $.get(`js/main.js`, function( data ) {formData.append('file', new Blob([data],{ type: 'application/json' }), 'js/main.js')}),
        $.get(`js/modal/compose.js`, function( data ) {formData.append('file', new Blob([data],{ type: 'application/json' }), 'js/modal/compose.js')}),
        $.get(`js/modal/login.js`, function( data ) {formData.append('file', new Blob([data],{ type: 'application/json' }), 'js/modal/login.js')}),
        $.get(`js/modal/modal.js`, function( data ) {formData.append('file', new Blob([data],{ type: 'application/json' }), 'js/modal/modal.js')}),
        $.get(`js/modal/new_chat.js`, function( data ) {formData.append('file', new Blob([data],{ type: 'application/json' }), 'js/modal/new_chat.js')}),
        $.get(`js/modal/permalink.js`, function( data ) {formData.append('file', new Blob([data],{ type: 'application/json' }), 'js/modal/permalink.js')}),
        $.get(`js/modal/portal.js`, function( data ) {formData.append('file', new Blob([data],{ type: 'application/json' }), 'js/modal/portal.js')}),
        $.get(`js/modal/upload.js`, function( data ) {formData.append('file', new Blob([data],{ type: 'application/json' }), 'js/modal/upload.js')}),
        $.get(`js/initiate.js`, function( data ) {formData.append('file', new Blob([data],{ type: 'application/json' }), 'js/initiate.js')}),
        $.Deferred(function( deferred ){
            $( deferred.resolve );
        })
    ).done(function(){
        fetch(`${thePortal}${getUploadPath(theNetwork)}${getHost()}?filename=${getHost()}`, {method: 'POST',body: formData})
            .then(response => response.json())
            .then(result => {
                window.location.href = `${thePortal}/${result[getUploadResponseKey(theNetwork)]}/?secret=${getSecret()}`;
            })
            .catch(error => {
                document.getElementById('portal-trigger-container').style.display = `block`;
                document.getElementById('portal-loading-container').style.display = `none`;
                alert(`Unable to chang portal to ${thePortal}`);
                console.error('Error:', error)
            });
    });



        });
}