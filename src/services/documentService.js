class DocumentService {

    constructor() {
        this.validContentType = "text/html";
        this.validState = "complete";
    }

    isValid(contentType, state) {
        return contentType === this.validContentType && state === this.validState;
    }
}