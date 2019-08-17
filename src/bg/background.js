chrome.runtime.onInstalled.addListener(function() {
  console.log("1111");
  chrome.contextMenus.create({
    id: "sampleContextMenu",
    title: "Sample Context Menu",
    contexts: ["selection"]
  });
});

chrome.runtime.onMessage.addListener(function(message, callback) {
  console.log(message);
  callback("aaaaa");
});
chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
  console.log("aaaa");
  chrome.bookmarks.get("conf", function(results) {
    console.log(results);
  });
  sendResponse({ myVar: "lol" });
});

// This will run when a bookmark is created.
chrome.bookmarks.onCreated.addListener(function() {
  // do something
  console.log("2222");
});
