function showModal(selection) {
    const modalIds = ["upload_modal", "login_modal", "portal_modal", "new_chat_modal", "permalink_modal", "new_call_modal"];
    modalIds.forEach(modalId => {
        var modalDisplay = modalId === selection ? "block" : "none";
        var theElement = document.getElementById(modalId);
        if (theElement !== null) {
            theElement.style.display = modalDisplay;
        }
    });
    $("#resultsModal").modal("show");
}
function clickToUpload() {
    document.getElementById('upload-trigger-container').style.display = `block`;
    document.getElementById('upload-loading-container').style.display = `none`;
    showModal("upload_modal");
}
function clickToLogin() {
    document.getElementById('login-trigger-container').style.display = `block`;
    document.getElementById('login-loading-container').style.display = `none`;
    showModal("login_modal");
}
function newCallModal() {
    showModal("new_call_modal");
    startup();
    createOffer();
}
function clickToChangePortal() {
    document.getElementById('portalKnown').style.display = ``;
    showModal("portal_modal");
    document.getElementById("portal").value = "";
}
function cancel() {
    $("#resultsModal").modal("hide");
}
function anonymous_login() {
    setUser("Anonymous");
    setAvatar("");
    $("#resultsModal").modal("hide");
}
function logout() {
    resetUser();
    resetAvatar();
    clickToLogin();
}