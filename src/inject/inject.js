chrome.extension.sendMessage({}, function(response) {
  const readyStateCheckInterval = setInterval(function() {
    if (document.readyState === "complete") {
      clearInterval(readyStateCheckInterval);

      // ----------------------------------------------------------
      // This part of the script triggers when page is done loading
      console.log("Hello. This message was sent from scripts/inject.js v2");
      // ----------------------------------------------------------
      const spotlightDiv = createSpotlight();
      document.body.appendChild(spotlightDiv);
      addEventListeners();
      //chrome.bookmarks.getTree(loadBookmarks());
    }
  }, 10);

  const createSpotlight = function() {
    const spotlight = document.createElement("div");
    spotlight.id = "cext-spotlight-wrapper";
    spotlight.innerHTML = getSpotlightDom();
    return spotlight;
  };

  const getSpotlightDom = function() {
    const dom = "<div><input type='text' id='cext-spotlight-textbox' /></div>";
    return dom;
  };

  const addEventListeners = function() {
    document.addEventListener("keydown", function(e) {
      if (e.code === "ShiftLeft") {
        alert("do something");
      }
    });
    const searchTextBox = document.getElementById("cext-spotlight-textbox");
    searchTextBox.addEventListener("keydown", function(e) {
      searchBookmarks(e.target.value);
    });
  };

  const loadBookmarks = function() {
    const bookmarkList = [];
    for (let i = 0; i < bookmarks.length; i++) {
      bookmarkList.push(bookmarks[i]);
      const bookmark = bookmarks[i];
      if (bookmark.url) {
        console.log("bookmark: " + bookmark.title + " ~  " + bookmark.url);
      }

      if (bookmark.children) {
        loadBookmarks(bookmark.children);
      }
      console.log(bookmarkList);
      return bookmarkList;
    }
  };

  const searchBookmarks = function(searchTerm) {
    chrome.extension.sendMessage({action:"getstorage"}, function(response){
      console.log("wha?", response);
    });
    console.log("searchTerm", searchTerm);
    chrome.bookmarks.get(searchTerm, function(a, b, c) {
      console.log("search found");
    });
  };
});
