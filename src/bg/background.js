let flatennedBookmarks = [];
chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === "get-bookmarks") {
        chrome.bookmarks.getTree(function (tree) {
            if (flatennedBookmarks.length === 0) flattenBookmarks(tree);
        });
        sendResponse({ bookmarks: flatennedBookmarks });
    }
});

function flattenBookmarks(bookmarks) {
    for (let i = 0; i < bookmarks.length; i++) {
        const bookmark = bookmarks[i];
        if (bookmark.url) {
            flatennedBookmarks.push({
                title: bookmark.title.toLowerCase(),
                orignalTitle: bookmark.title,
                url: bookmark.url
            });
        }
        if (bookmark.children) {
            flattenBookmarks(bookmark.children);
        }
    }
}
