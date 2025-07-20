chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("Message received in popup-handler.js:", request); // Debugging log

    //return; 

    if (request.action === "displayMessage") {
        const messageElement = document.getElementById("message");
        if (messageElement) {
            messageElement.textContent = request.message;
            messageElement.style.display = "block"; // Ensure the message is visible
            console.log("Message displayed:", request.message); // Debugging log
        } else {
            console.error("Message element not found in popup.html.");
        }
    }
});
