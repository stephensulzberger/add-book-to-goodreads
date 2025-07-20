const _GOODREADS_API_KEY = "";

console.log("Popup script loaded and running."); // Log to confirm script execution

let messageHandled = false; // Flag to prevent repeated message handling

chrome.runtime.onMessage.addListener(
    async function (request, sender, sendResponse) {

        console.log("Message received in popup.js:", request); // Debugging log
        
        //console.log("Request action:", request.action); // Log the action for debugging

        // Filter messages by action to avoid feedback loop
        if (request.action === "content") {
            
            //console.log("Processing content:", request.content);

            const content = request.content || "";
            const isbnScan10 = content.match(/ISBN(-*1(?:(0)|3))?\s*?:?\s*?(97(8|9))?\d{9}(\d|X)/i);
            const isbnScan13 = content.match(/ISBN(-*1(?:(0)|3))\s*?:?\s*[0-9]{1,}(\s|-)[0-9]{1,}(\s|-)[0-9]{4,}(\s|-)[0-9]{1,}(\s|-)(([0-9]|x){1,})*/i);
            const asinScan = content.match(/ASIN[\s\p{Cf}]*:[\s\p{Cf}]*([A-Z0-9]{10})/iu);

            let bookID = null;

            if (isbnScan10) {
                const tmp = isbnScan10[0];
                bookID = tmp.match(/([0-9|x]{10,13})/gmi);
            } else if (isbnScan13) {
                const tmp = isbnScan13[0];
                bookID = tmp.match(/[0-9]{1,}(\s|-)[0-9]{1,}(\s|-)[0-9]{4,}(\s|-)[0-9]{1,}(\s|-)(([0-9]|x){1,})*/gm);
            } else if (asinScan) {
                bookID = asinScan[1];
            }

            console.log("Book ID=", bookID);

            if (bookID) {
                try {
                    const response = await fetch(`https://www.goodreads.com/book/isbn?isbn=${bookID}&key=${_GOODREADS_API_KEY}`);
                    if (response.ok) {
                        const responseBody = await response.text();
                        console.log("Response body:", responseBody);
                        chrome.runtime.sendMessage({
                            action: "displayMessage",
                            message: responseBody
                        });
                    } else {
                        throw new Error("Failed to fetch Goodreads data.");
                    }
                } catch (error) {
                    console.error(error);
                    chrome.runtime.sendMessage({
                        action: "displayMessage",
                        message: "Failed to fetch Goodreads data. Please try again later."
                    });
                }
            } else {
                console.log("No ISBN or ASIN found in the content.");
                chrome.runtime.sendMessage({
                    action: "displayMessage",
                    message: "No valid ISBN or ASIN was found. Please check the content and try again."
                });
            }
        }
    });

chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (tabs.length > 0) {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            files: ['myscript.js']
        });
    } else {
        console.error("No active tab found.");
    }
});

function GetGoodReadsBookID(bookID) {
    var result = null;
    var getId = new XMLHttpRequest();
    getId.open("GET", "https://www.goodreads.com/book/isbn_to_id/" + bookID + "?" + "key=" + _GOODREADS_API_KEY, false);
    getId.send(null);
    var result = getId.responseText;
    return result;
}