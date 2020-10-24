console.log('myscript.js');
chrome.runtime.sendMessage({
    action: "content",
    host: document.location.hostname,
    content: document.body.textContent
}, function (response) { }
);