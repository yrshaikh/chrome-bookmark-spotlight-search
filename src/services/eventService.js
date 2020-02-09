class EventService {

    constructor(document, domService, bookmarkService) {
        this.document = document;
        this.domService = domService;
        this.bookmarkService = bookmarkService;

        this.KEY_UP = "keyup";
        this.KEY_B = "KeyB";
        this.KEY_ESC = "Escape";
        this.KEY_DOWN_ARROW = "ArrowDown";
        this.KEY_UP_ARROW = "ArrowUp";
        this.KEY_ENTER_NUMPAD = "NumpadEnter";
        this.KEY_ENTER = "Enter";
    }

    register() {
        const domService = this.domService;
        const self = this;
        this.document.addEventListener(this.KEY_UP, function (e) {
            if (e.code === self.KEY_B && e.ctrlKey) {
                domService.openSearch();
            }
            if (e.code === self.KEY_ESC) {
                domService.closeSearch();
            }
            if (e.code === self.KEY_DOWN_ARROW || e.code === self.KEY_UP_ARROW) {
                domService.navigateSearch(e.code === self.KEY_DOWN_ARROW);
            }
            else if (e.code === self.KEY_ENTER_NUMPAD || e.code === self.KEY_ENTER) {
                domService.redirect();
            }
        });
    }

    registerTextBoxEvent(textBoxId) {
        const self = this;
        this.document.getElementById(textBoxId)
          .addEventListener(this.KEY_UP, function (e) {
              const searchTerm = e.target.value;
              chrome.extension.sendMessage({action: "get-bookmarks"}, function (
                response
              ) {
                  const results = self.bookmarkService.getFilteredResults(searchTerm, response.bookmarks);
                  self.domService.renderResults(results);
              });
          });
    }
}
