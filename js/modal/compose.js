function compose() {
    var content = document.getElementById("content").value;
    if (content == null || content.trim().length == 0) {
        resetTextarea("content");
        alert("Can not submit empty message.");
    } else if (content.length > 8000) {
        alert("Message too large.");
    } else {
        put(content);
    }
}