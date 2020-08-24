function newChat() {
    showModal("new_chat_modal");
    const host = `${getRandomString(26)}`;
    var formData = new FormData();    
    $.when(
        $.get(`index.html`, function( data ) {
            const skychatDiv = `<skychat id="skychat_host" style="display: none">`;
            const endingIndex = data.lastIndexOf(skychatDiv);
            const newPage = data.substring(0, endingIndex) 
            + `${skychatDiv}${host}</skychat><skychat id="skychat_epoch" style="display: none">${getEpochDay(1)}</skychat></body></html>`;
            const blob = new Blob([newPage],{ type: 'text/html' });
            formData.append('file', blob, 'index.html')}),
        $.get(`js/archive_comments.js`, function( data ) {formData.append('file', new Blob([data],{ type: 'text/html' }), 'js/archive_comments.js')}),
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
        fetch(`${getUploadPath(getNetwork())}${host}?filename=${host}`, {method: 'POST',body: formData})
            .then(response => response.json())
            .then(result => {
                window.location.pathname = `/${result[getUploadResponseKey(getNetwork())]}/`;
            })
            .catch(error => {console.error('Error:', error)});
    });
}