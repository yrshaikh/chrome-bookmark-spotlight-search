
chrome.extension.sendMessage({}, function () {
    this.appLoaded = false;

    const readyStateCheckInterval = setInterval(function () {

        let documentService = new DocumentService();
        if (!this.appLoaded && !documentService.isValid(document.contentType, document.readyState)) return;

        this.appLoaded = true;

        this.domService = new DomService(document);
        this.bookmarkService = new BookmarkService();
        this.eventService = new EventService(document, this.domService, this.bookmarkService);

        clearInterval(readyStateCheckInterval);
        this.domService.buildSpotlight(document);
        this.eventService.register(document);
        this.eventService.registerTextBoxEvent("cext-spotlight-textbox");

    }, 10);
});
