import React, { Component } from "react";
import history from "../../history";

class Menu extends Component {
  constructor(props) {
    super(props);
  }

  handleClickEvent(destination, projectId) {
    let url = "/" + destination + "/" + projectId;
    return function() {
      history.push({
        pathname: url,
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
              onClick={this.handleClickEvent(
                "open/project",
                this.props.projectId
              )}
            >
              Home
            </a>
          </div>
          <div>
            <a
              className="_stickers"
              onClick={this.handleClickEvent("packs", this.props.projectId)}
            >
              Packs
            </a>
          </div>
          <div>
            <a
              className="_stickers_packs"
              onClick={this.handleClickEvent("members", this.props.projectId)}
            >
              Members
            </a>
          </div>
          <div>
            <a
              className="_stickers_packs"
              onClick={this.handleClickEvent("stories", this.props.projectId)}
            >
              Stories
            </a>
          </div>

          <div>
            <a
              className="_stickers_packs"
              onClick={this.handleClickEvent("adverts", this.props.projectId)}
            >
              Adverts
            </a>
          </div>
          <div>
            <a
              className="_stickers_packs"
              onClick={this.handleClickEvent("products", this.props.projectId)}
            >
              Product IDs
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
