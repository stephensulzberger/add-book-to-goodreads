//
//
chrome.extension.onRequest.addListener(

function(request, sender, sendResponse) {

    console.log('content is ' + request.content.length + ' bytes');
    console.log('content type is ' + typeof(request));
    //console.log(request.content);
    //split into two regex patterns so it is a bit more clear what they actually do
    isbnScan = request.content.match(/ISBN(-*1(?:(0)|3))?:?\s*?(97(8|9))?\d{9}(\d|X)/i);
    isbnScan2 = request.content.match(/ISBN(-*1(?:(0)|3))?:?\s[0-9]{1,}(\s|-)[0-9]{1,}(\s|-)[0-9]{4,}(\s|-)[0-9]{1,}(\s|-)(([0-9]|x){1,})*/i);
    console.log('isbn = ' + isbnScan);
    console.log('isbn2 = ' + isbnScan2);
    var isbnResult = null;
    if (isbnScan != null) {
    console.log(isbnScan);
        var tmp = isbnScan[0];
        console.log('tmp ' + tmp + ' type ' + typeof(tmp));
        isbnResult = tmp.match(/([0-9|x]{10,13})/gmi);
        console.log('result' + isbnResult);
        console.log('result type ' + typeof(isbnResult));
    } else if (isbnScan2 != null) {
        var tmp = isbnScan2[0]
        isbnResult = tmp.match(/[0-9]{1,}(\s|-)[0-9]{1,}(\s|-)[0-9]{4,}(\s|-)[0-9]{1,}(\s|-)(([0-9]|x){1,})*/gm);
        console.log('result' + isbnResult);
    }

    if (isbnResult != null) {
        //isbnResult = isbnResult.split(" ");
        isbn = isbnResult;
        console.log(isbn);
        console.log(typeof(isbn));
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
    } else {
        badDiv = document.createElement("div");
        pageContent = "No ISBN number found on this page :(";
        badDiv.innerHTML = pageContent;
        document.body.appendChild(badDiv);
    }

});
chrome.tabs.getSelected(null, function(tab) {
    chrome.tabs.executeScript(tab.id, {
        file: 'myscript.js'
    });
});