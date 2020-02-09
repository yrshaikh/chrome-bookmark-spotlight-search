class DomService {

    constructor() {
        this.id = "cext-spotlight-wrapper";
        this.disabledClassName = "cext-spotlight-wrapper-disabled";
    }

    buildSpotlight(document) {
        const spotlightDiv = document.createElement("div");
        spotlightDiv.id = this.id;
        spotlightDiv.className = this.disabledClassName;
        spotlightDiv.innerHTML = this.getSpotlightDom();
        document.body.appendChild(spotlightDiv);
    }

    getSpotlightDom() {
        const dom =
            "<div class='cext-spotlight-textbox-wrapper'>" +
            "<input type='text' id='cext-spotlight-textbox' placeholder='Search bookmarks (Double tap ESC to exit)' />" +
            "</div>" +
            "<div id='cext-spotlight-results'></div>";
        return dom;
    }
}
