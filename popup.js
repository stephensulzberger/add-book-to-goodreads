const _GOODREADS_API_KEY = "";

//console.log("Popup script loaded and running."); // Log to confirm script execution

chrome.runtime.onMessage.addListener(
    async function (request, sender, sendResponse) {

        //console.log("Message received in popup.js:", request); // Debugging log

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

            //console.log("Book ID=", bookID);

            chrome.runtime.sendMessage({ action: "toggleLoading", isLoading: true });

            if (bookID) {
                try {
                    const response = await fetch(`https://www.goodreads.com/book/isbn?isbn=${bookID}&key=${_GOODREADS_API_KEY}`);
                    if (response.ok) {
                        const responseBody = await response.text();

                        //console.log("Response body:", responseBody);

                        // chrome.runtime.sendMessage({
                        //     action: "displayMessage",
                        //     message: responseBody
                        // });

                        // Send bookID to popup-handler.js for widget injection
                        chrome.runtime.sendMessage({
                            action: "loadWidget",
                            bookID: bookID
                        });

                        // Manually parse the XML response to extract title 
                        // Match both CDATA and non-CDATA titles
                        // Example: <title><![CDATA[Book Title]]></title> or <title>Book Title</title>
                        // This ensures we get the correct title even if it is wrapped in CDATA
                        // or not wrapped at all
                        const titleMatch = responseBody.match(/<title>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/title>/);
                        const rawTitle = titleMatch ? titleMatch[1] : "Unknown Title";
                        const title = decodeHtmlEntities(rawTitle);

                        // Manually parse the XML response to extract authors
                        // Extract authors only from the <book><authors> node
                        // This ensures we get the correct authors even if there are multiple
                        // authors listed in the XML response
                        // Example: <authors><author><name>Author Name</name></author></authors
                        const authorsNodeMatch = responseBody.match(/<authors>(.*?)<\/authors>/s);
                        const rawAuthors = authorsNodeMatch ? authorsNodeMatch[1].match(/<name>(.*?)<\/name>/g)?.map(nameTag => nameTag.match(/<name>(.*?)<\/name>/)[1]).join(", ") : "Unknown Author";
                        const authors = decodeHtmlEntities(rawAuthors);

                        chrome.runtime.sendMessage({
                            action: "updateBookDetails",
                            title: title,
                            author: authors
                        });
                    } else if (response.status === 404) {
                        console.error("Book not found on Goodreads.");
                        chrome.runtime.sendMessage({
                            action: "displayMessage",
                            message: `Book not found on Goodreads. Please check the ISBN or ASIN and try again. (Book ID: ${bookID})`
                        });
                    } else {
                        throw new Error(`Failed to fetch Goodreads data. (Book ID: ${bookID})`);
                    }
                } catch (error) {
                    console.error(error);
                    chrome.runtime.sendMessage({
                        action: "displayMessage",
                        message: `Failed to fetch Goodreads data. Please try again later. (Book ID: ${bookID})`
                    });
                }
            } else {
                console.log("No ISBN or ASIN found in the content.");
                chrome.runtime.sendMessage({
                    action: "displayMessage",
                    message: "No valid ISBN or ASIN was found. Please check the content and try again."
                });
            }

            chrome.runtime.sendMessage({ action: "toggleLoading", isLoading: false });
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

// Helper function to decode HTML entities.
// Eventually this should be replaced with a more robust library or method.
// Currently required because this code file does not have access to the DOMParser
// and thus cannot use the DOMParser to parse HTML entities. 
function decodeHtmlEntities(text) {
    return text.replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&#x27;/g, "'")
        .replace(/&#x2F;/g, '/')
        .replace(/&#x60;/g, '`')
        .replace(/&#x3D;/g, '=')
        .replace(/&#8217;/g, "'")
        .replace(/&#8220;/g, '"')
        .replace(/&#8221;/g, '"')
        .replace(/&#8230;/g, '...')
        .replace(/&#8212;/g, '—')
        .replace(/&#8211;/g, '–');
}

function GetGoodReadsBookID(bookID) {
    var result = null;
    var getId = new XMLHttpRequest();
    getId.open("GET", "https://www.goodreads.com/book/isbn_to_id/" + bookID + "?" + "key=" + _GOODREADS_API_KEY, false);
    getId.send(null);
    var result = getId.responseText;
    return result;
}