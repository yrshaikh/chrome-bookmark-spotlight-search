class DomService {

    constructor(document) {
        this.document = document;
        this.id = "cext-spotlight-wrapper";
        this.disabledClassName = "cext-spotlight-wrapper-disabled";
    }

    buildSpotlight() {
        const spotlightDiv = this.document.createElement("div");
        spotlightDiv.id = this.id;
        spotlightDiv.className = this.disabledClassName;
        spotlightDiv.innerHTML = this.getSpotlightDom();
        this.document.body.appendChild(spotlightDiv);
    }

    getSpotlightDom() {
        return "<div class='cext-spotlight-textbox-wrapper'>" +
          "<input type='text' id='cext-spotlight-textbox' placeholder='Search bookmarks (Double tap ESC to exit)' />" +
          "</div>" +
          "<div id='cext-spotlight-results'></div>";
    }

    openSearch() {
        const wrapper = document.getElementById(
          "cext-spotlight-wrapper"
        );
        wrapper.classList.remove("cext-spotlight-wrapper-disabled");
        document.getElementById("cext-spotlight-textbox").focus();
    }

    closeSearch() {
        const wrapper = document.getElementById(
          "cext-spotlight-wrapper"
        );
        wrapper.classList.add("cext-spotlight-wrapper-disabled");
    }

    navigateSearch(isArrowDown) {
        //if (currentResults.length !== 0) {
            rotateLiSelection(isArrowDown);
        //}
    }

    renderResults = function (results) {
        const currentFilteredResultsCount = 0;
        let currentLiSelectionIndex = 0;
        const resultDom = this.document.getElementById("cext-spotlight-results");
        resultDom.innerHTML = "";
        resultDom.innerHTML = "<div class='cext-spotlight-results-count'>Found " + currentFilteredResultsCount + " matching bookmarks</div>";
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

    rotateLiSelection = function (isDownArrow) {
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
}
