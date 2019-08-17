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
    const dom =
      "<div><input type='text' id='cext-spotlight-textbox' /><div id='cext-spotlight-results'></div></div>";
    return dom;
  };

  const addEventListeners = function() {
    // document.addEventListener("keydown", function(e) {
    //   if (e.code === "ShiftLeft") {
    //     alert("do something");
    //   }
    // });
    const searchTextBox = document.getElementById("cext-spotlight-textbox");
    searchTextBox.addEventListener("keydown", function(e) {
      searchBookmarks(e.target.value);
    });
  };

  const searchBookmarks = function(searchTerm) {
    chrome.extension.sendMessage({ action: "get-bookmarks" }, function(
      response
    ) {
      console.log("bookmarks =", response);
      const results = getFilteredResults(searchTerm, response.bookmarks);
      console.log(results);
      renderResults(results);
    });
  };

  function getFilteredResults(searchTerm, bookmarks) {
    console.log(searchTerm, bookmarks);
    const matches = [];
    searchTerm = searchTerm.toLowerCase();
    for (let i = 0; i < bookmarks.length; i++) {
      const bookmark = bookmarks[i];
      if (
        bookmark.url.indexOf(searchTerm) !== -1 ||
        bookmark.title.indexOf(searchTerm) !== -1
      ) {
        matches.push(bookmark);
      }
    }
    return matches;
  }

  function renderResults(results) {
    const resultDom = document.getElementById("cext-spotlight-results");
    resultDom.innerHTML = "";
    const ul = document.createElement("ul");
    ul.id = "cext-spotlight-result-ul";
    for (let i = 0; i < results.length; i++) {
      const li = document.createElement("li");
      li.id = "cext-spotlight-result-li";
      li.textContent = results[i].title;
      ul.appendChild(li);
    }
    resultDom.appendChild(ul);
  }
});
