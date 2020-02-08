class DocumentService {

    isValid(contentType, state) {
        return contentType === "text/html" && state === "complete";
    }
}