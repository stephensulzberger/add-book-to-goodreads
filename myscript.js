console.log('myscript.js');
    chrome.extension.sendRequest( {
            action: "content",
            host: document.location.hostname,
            content: document.body.textContent
        }, function(response) { }
    );