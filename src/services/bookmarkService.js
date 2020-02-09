class BookmarkService {

  constructor() {
    this.currentFilteredResultsCount = 0;
    this.maxAllowedFilteredResultCount = 6;
  }

  getFilteredResults(searchTerm, bookmarks) {
    const matches = [];
    this.currentFilteredResultsCount = 0;
    searchTerm = searchTerm.toLowerCase();
    for (let i = 0; i < bookmarks.length; i++) {
      const bookmark = bookmarks[i];
      if (bookmark.url.indexOf(searchTerm) !== -1 || bookmark.title.indexOf(searchTerm) !== -1) {
        this.currentFilteredResultsCount++;
        if (true || this.currentFilteredResultsCount < this.maxAllowedFilteredResultCount) {
          matches.push(bookmark);
        }
      }
    }
    return matches;
  };
}
