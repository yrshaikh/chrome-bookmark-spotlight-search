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

  let currentSearchTerm = "";
  let currentResults = [];

  const createSpotlight = function() {
    const spotlight = document.createElement("div");
    spotlight.id = "cext-spotlight-wrapper";
    spotlight.innerHTML = getSpotlightDom();
    return spotlight;
  };

  const getSpotlightDom = function() {
    const dom =
      "<div class='cext-spotlight-textbox-wrapper'>" +
      "<input type='text' id='cext-spotlight-textbox' placeholder='Search bookmarks' />" +
      "</div>" +
      "<div id='cext-spotlight-results'></div>";
    return dom;
  };

  const addEventListeners = function() {
    document.addEventListener("keyup", function(e) {
      if (e.code === "Backquote") {
        alert("todo show/hide");
      }
    });
    const searchTextBox = document.getElementById("cext-spotlight-textbox");
    searchTextBox.addEventListener("keyup", function(e) {
      if (e.code === "ArrowDown") {
        if (currentResults.length !== 0) {
          onArrowDown();
        }
      } else if (e.code === "NumpadEnter" || e.code === "Enter") {
        redirect();
      }

      if (currentSearchTerm !== e.target.value) {
        currentSearchTerm = e.target.value;
        searchBookmarks(e.target.value);
      }
    });
  };

  const searchBookmarks = function(searchTerm) {
    chrome.extension.sendMessage({ action: "get-bookmarks" }, function(
      response
    ) {
      const results = getFilteredResults(searchTerm, response.bookmarks);
      currentResults = results;
      renderResults(results);
    });
  };

  const getFilteredResults = function(searchTerm, bookmarks) {
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
  };

  const renderResults = function(results) {
    const resultDom = document.getElementById("cext-spotlight-results");
    resultDom.innerHTML = "";
    const ul = document.createElement("ul");
    ul.id = "cext-spotlight-result-ul";
    for (let i = 0; i < results.length; i++) {
      const li = document.createElement("li");
      li.id = "cext-spotlight-result-li";
      li.setAttribute("data-url", results[i].url);
      if (i === 0) {
        li.className = "cext-spotlight-result-li-selected";
      }

      const liDivItem1 = document.createElement("div");
      liDivItem1.className = "cext-spotlight-result-li-title";
      liDivItem1.textContent = results[i].orignalTitle;

      const liDivItem2 = document.createElement("div");
      liDivItem2.textContent = results[i].url;
      liDivItem2.className = "cext-spotlight-result-li-url";

      li.appendChild(liDivItem1);
      li.appendChild(liDivItem2);

      ul.appendChild(li);
    }
    resultDom.appendChild(ul);
  };

  const redirect = function() {
    const selectedItem = document.getElementsByClassName(
      "cext-spotlight-result-li-selected"
    )[0];
    const href = selectedItem.getAttribute("data-url");
    window.location.href = href;
  };

  const onArrowDown = function() {

  };
});
