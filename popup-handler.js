chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    //console.log("Message received in popup-handler.js:", request); // Debugging log
    if (request.action === "displayMessage") {
        const messageElement = document.getElementById("message");
        const contentSuccess = document.getElementById("content-success");

        if (messageElement) {
            messageElement.textContent = request.message;
            messageElement.style.display = "block";

            if (contentSuccess) contentSuccess.style.display = "none";

            console.log("Message displayed:", request.message);
        } else {
            console.error("Message element not found in popup.html.");
        }
    } else if (request.action === "loadWidget") {
        const addToBooksLink = document.getElementById("add-to-books-link");
        const addToBooksIframe = document.getElementById("add-to-books-iframe");

        if (addToBooksLink && addToBooksIframe) {
            addToBooksLink.href = `https://www.goodreads.com/book/isbn/${request.bookID}`;
            addToBooksIframe.src = `https://www.goodreads.com/book/add_to_books_widget/${request.bookID}?atmb_widget%5Bbutton%5D=atmb_widget_1.png`;
        } else {
            console.error("Widget elements not found in popup.html.");
        }
    } else if (request.action === "updateBookDetails") {
        const titleElement = document.getElementById("book-title");
        const authorElement = document.getElementById("author-name");

        if (titleElement && authorElement) {
            titleElement.textContent = request.title || "Unknown Title";
            authorElement.textContent = request.author || "Unknown Author";
        } else {
            console.error("Book details elements not found in popup.html.");
        }
    } else if (request.action === "toggleLoading") {
        const loadingIndicator = document.getElementById("loading-indicator");
        const content = document.getElementById("content");

        if (loadingIndicator && content) {
            if (request.isLoading) {
                loadingIndicator.style.display = "block";
                content.style.display = "none";
            } else {
                loadingIndicator.style.display = "none";
                content.style.display = "block";
            }
        } else {
            console.error("Loading indicator or content elements not found in popup.html.");
        }
    }
});
