import React, { Component } from "react";
import "../../App.css";

import LoginCard from "./loginCard";

class StickerList extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div
        style={{ marginTop: "100px" }}
        className="grid-x grid-padding-x align-spaced"
      >
        <LoginCard />

        {this.props.stickers.map(sticker => (
          <div
            key={sticker.id}
            className="small-12 medium-3 large-3 cell icons"
          >
            <img src={sticker.url} alt={sticker.name} />
          </div>
        ))}
      </div>
    );
  }
}

export default StickerList;
