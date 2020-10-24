//
//
chrome.runtime.onMessage.addListener(

    function (request, sender, sendResponse) {
        console.log('content is ' + request.content.length + ' bytes');
        console.log('content type is ' + typeof (request));

        var isbnScan10 = request.content.match(/ISBN(-*1(?:(0)|3))?\s*?:?\s*?(97(8|9))?\d{9}(\d|X)/i);
        var isbnScan13 = request.content.match(/ISBN(-*1(?:(0)|3))\s*?:?\s*[0-9]{1,}(\s|-)[0-9]{1,}(\s|-)[0-9]{4,}(\s|-)[0-9]{1,}(\s|-)(([0-9]|x){1,})*/i);
        var asinScan = request.content.match(/ASIN\s*:\s*([A-Z0-9]{10})/i);
        console.log('ISBN 10 = ' + isbnScan10);
        console.log('ISBN 13 = ' + isbnScan13);
        console.log('ASIN = ' + asinScan);

        var bookID = null;

        if (isbnScan10 != null) {
            var tmp = isbnScan10[0];
            bookID = tmp.match(/([0-9|x]{10,13})/gmi);
        } else if (isbnScan13 != null) {
            var tmp = isbnScan13[0];
            bookID = tmp.match(/[0-9]{1,}(\s|-)[0-9]{1,}(\s|-)[0-9]{4,}(\s|-)[0-9]{1,}(\s|-)(([0-9]|x){1,})*/gm);
        } else if (asinScan != null) {
            bookID = asinScan[1];
        }

        console.log("bookID = " + bookID);

        if (bookID != null) {
            isbn = bookID;
            console.log(isbn);
            console.log(typeof (isbn));
            var req = new XMLHttpRequest();
            req.open("GET", "http://www.goodreads.com/book/isbn?isbn=" + isbn + "&" + "key=PkY9lbrcAVS2dHn1DidESg", true);
            req.onload = printDesc;
            req.send(null);

            //get goodreads id from ISBN
            //not used now but maybe useful in future
            var getId = new XMLHttpRequest();
            getId.open("GET", "http://www.goodreads.com/book/isbn_to_id/" + isbn + "?" + "key=PkY9lbrcAVS2dHn1DidESg", false);
            getId.send(null);
            var id = getId.responseText;
            console.log('goodreads id: ' + id)

            var newDiv = null;

            function printDesc() {
                if (req.status == 200) {
                    var descriptions = req.responseXML.getElementsByTagName("reviews_widget");
                    var title = req.responseXML.getElementsByTagName("title");
                    var author = req.responseXML.getElementsByTagName("author");
                    author = author[0].getElementsByTagName("name");
                    for (var i = 0, desc; desc = descriptions[i]; i++) {
                        newDiv = document.createElement("div");
                        console.log(desc);
                        newContent = descriptions[i].textContent;
                        console.log(newContent);
                        //build iframe for "add to goodreads"
                        goodreadsContent = '<iframe height="110" width="325" frameborder="0" scrolling="no" src="';
                        goodreadsContent += "http://www.goodreads.com/book/add_to_books_widget/" + isbn + "?atmb_widget%5Bbutton%5D=atmb_widget_1.png&amp;";
                        goodreadsContent += '"></iframe><p>';
                        //reviews widget code from XML file
                        //goodreadsContent += newContent;
                        goodreadsContent += '<i>' + title[0].textContent + '</i> by: ' + author[0].textContent;

                        newDiv.innerHTML = goodreadsContent;
                        // add the newly created element and it's content into the DOM
                        document.body.appendChild(newDiv);
                    }
                }
                else {
                    badDiv = document.createElement("div");
                    pageContent = req.responseText;
                    badDiv.innerHTML = pageContent;
                    document.body.appendChild(badDiv);
                }
            }
        } else {
            badDiv = document.createElement("div");
            pageContent = "No ISBN number found on this page :(";
            badDiv.innerHTML = pageContent;
            document.body.appendChild(badDiv);
        }
    });

chrome.tabs.query({ active: true }, function (tab) {
    chrome.tabs.executeScript(tab.id, {
        file: 'myscript.js'
    });
});