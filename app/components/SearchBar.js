import React, { Component } from "react";
import { func } from "prop-types";
import style from "./SearchBar.css";

export default class SearchBar extends Component {
  static propTypes = {
    onInputChange: func
  };

  static defaultProps = {
    onInputChange: () => {}
  };

  constructor(props) {
    super(props);

    this.placeholder = "Bookmark Search";
  }

  keyPressHandler = event => {
    if (event.key === "Enter") {
      this.props.onInputChange(event);
    }
  };

  render() {
    return (
      <div className={style.searchBar}>
        <input
          onChange={this.props.onInputChange}
          onKeyPress={this.keyPressHandler}
          placeholder={this.placeholder}
          /* eslint jsx-a11y/tabindex-no-positive: 0 */
          tabIndex={1}
          autoFocus
          id={"bookmark-search-input"}
        />
      </div>
    );
  }
}
