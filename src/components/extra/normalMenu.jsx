import React, { Component } from "react";
import history from "../../history";

class Menu extends Component {
  constructor(props) {
    super(props);
  }

  handleClickEvent(destination) {
    let userId = this.props.userId;
    let url = "/" + destination + "/" + userId;
    return function() {
      history.push({
        pathname: url,
        search: ""
      });
    };
  }

  handleClickHome(destination) {
    return function() {
      history.push({
        pathname: destination,
        search: ""
      });
    };
  }

  render() {
    return (
      <>
        <div className="card_head_position">
          <div className="stats">Menu</div>
          <div>
            <a
              className="_stickers"
              onClick={this.handleClickHome("/creator/home")}
            >
              Home
            </a>
          </div>
          <div>
            <a
              className="_stickers"
              onClick={this.handleClickEvent("allNormalPacks")}
            >
              Packs
            </a>
          </div>

          <div>
            <a
              className="_stickers_packs"
              onClick={this.handleClickEvent("allNormalStories")}
            >
              Stories
            </a>
          </div>

          <div style={{ marginTop: "25px" }}>
            <p className="_stickers_packs">Sticker# - </p>
            <br />
          </div>
        </div>
      </>
    );
  }
}

export default Menu;
