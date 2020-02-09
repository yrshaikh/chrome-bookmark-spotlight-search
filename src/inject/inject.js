
chrome.extension.sendMessage({}, function (response) {
    let documentService = new DocumentService();
    let domService = new DomService();

    const readyStateCheckInterval = setInterval(function () {

        if (!documentService.isValid(document.contentType, document.readyState)) return;

        clearInterval(readyStateCheckInterval);
        domService.buildSpotlight(document);
        addEventListeners();

    }, 10);

    let currentSearchTerm = "";
    let currentResults = [];
    const maxAllowedFilteredResultCount = 6;
    let currentFilteredResultsCount = 0;
    let currentLiSelectionIndex = -1;

    const addEventListeners = function () {
        document.addEventListener("keyup", function (e) {
            console.log(e);
            if (e.code === "KeyB" && e.ctrlKey) {
                const wrapper = document.getElementById(
                    "cext-spotlight-wrapper"
                );
                wrapper.classList.remove("cext-spotlight-wrapper-disabled");
                document.getElementById("cext-spotlight-textbox").focus();
            }
            if (e.code === "Escape") {
                const wrapper = document.getElementById(
                    "cext-spotlight-wrapper"
                );
                wrapper.classList.add("cext-spotlight-wrapper-disabled");
            }
            if (e.code === "ArrowDown" || e.code === "ArrowUp") {
                if (currentResults.length !== 0) {
                    rotateLiSelection(e.code === "ArrowDown");
                }
            } else if (e.code === "NumpadEnter" || e.code === "Enter") {
                redirect();
            }
        });
        const searchTextBox = document.getElementById("cext-spotlight-textbox");
        searchTextBox.addEventListener("keyup", function (e) {
            if (currentSearchTerm !== e.target.value) {
                currentSearchTerm = e.target.value;
                searchBookmarks(e.target.value);
            }
        });
    };

    const searchBookmarks = function (searchTerm) {
        chrome.extension.sendMessage({ action: "get-bookmarks" }, function (
            response
        ) {
            const results = getFilteredResults(searchTerm, response.bookmarks);
            currentResults = results;
            renderResults(results);
        });
    };

    const getFilteredResults = function (searchTerm, bookmarks) {
        const matches = [];
        currentFilteredResultsCount = 0;
        searchTerm = searchTerm.toLowerCase();
        for (let i = 0; i < bookmarks.length; i++) {
            const bookmark = bookmarks[i];
            if (
                bookmark.url.indexOf(searchTerm) !== -1 ||
                bookmark.title.indexOf(searchTerm) !== -1
            ) {
                currentFilteredResultsCount++;
                if (
                    true ||
                    currentFilteredResultsCount < maxAllowedFilteredResultCount
                ) {
                    matches.push(bookmark);
                }
            }
        }
        return matches;
    };

    const renderResults = function (results) {
        const resultDom = document.getElementById("cext-spotlight-results");
        resultDom.innerHTML = "";
        resultDom.innerHTML =
            "<div class='cext-spotlight-results-count'>Found " +
            currentFilteredResultsCount +
            " matching bookmarks</div>";
        const ul = document.createElement("ul");
        ul.id = "cext-spotlight-result-ul";
        for (let i = 0; i < results.length; i++) {
            const li = document.createElement("li");
            li.className = "cext-spotlight-result-li";
            li.setAttribute("data-url", results[i].url);
            if (i === 0) {
                li.className += " cext-spotlight-result-li-selected";
                currentLiSelectionIndex = i;
            }

            const liDivItem1 = document.createElement("div");
            liDivItem1.className = "cext-spotlight-result-li-title";
            liDivItem1.textContent = results[i].orignalTitle;

            const liDivItem2 = document.createElement("div");
            liDivItem2.textContent = results[i].url;
            liDivItem2.className = "cext-spotlight-result-li-url";

            //li.appendChild(liDivItem0);
            li.appendChild(liDivItem1);
            li.appendChild(liDivItem2);

            ul.appendChild(li);
        }
        resultDom.appendChild(ul);
    };

    const getFaviconUrl = function (url) {
        let hostname;
        let protocol = url.split("/")[0];
        hostname = url.split("/")[2];
        //find & remove port number
        hostname = hostname.split(":")[0];
        //find & remove "?"
        hostname = hostname.split("?")[0];
        return protocol + "//" + hostname + "/favicon.ico";
    };

    const redirect = function () {
        const selectedItem = document.getElementsByClassName(
            "cext-spotlight-result-li-selected"
        )[0];
        const href = selectedItem.getAttribute("data-url");
        window.location.href = href;
    };

    const rotateLiSelection = function (isDownArrow) {
        const results = document.getElementsByClassName(
            "cext-spotlight-result-li"
        );

        let updatedIndex;

        if (isDownArrow) {
            if (currentLiSelectionIndex === results.length - 1) {
                currentLiSelectionIndex = -1;
            }
            updatedIndex = currentLiSelectionIndex;
            for (let i = 0; i < results.length; i++) {
                results[i].classList.remove(
                    "cext-spotlight-result-li-selected"
                );
                if (i === currentLiSelectionIndex + 1) {
                    results[i].className +=
                        " cext-spotlight-result-li-selected";
                    updatedIndex = i;
                }
            }
        } else {
            if (currentLiSelectionIndex === 0) {
                currentLiSelectionIndex = results.length;
            }
            updatedIndex = currentLiSelectionIndex;
            for (let i = results.length - 1; i >= 0; i--) {
                results[i].classList.remove(
                    "cext-spotlight-result-li-selected"
                );
                if (i === currentLiSelectionIndex - 1) {
                    results[i].className +=
                        " cext-spotlight-result-li-selected";
                    updatedIndex = i;
                }
            }
        }
        currentLiSelectionIndex = updatedIndex;
    };
});
