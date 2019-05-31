import React, { Component } from "react";
import type from "../../js/type";
import history from "../../history";

class StickerCards extends Component {
  constructor(props) {
    super(props);
  }

  handleRemoveCurated(item, stickerId, stickerName) {
    let packId = this.props.packId;

    return function() {
      history.push({
        pathname: "/card/create",
        search: "",
        state: {
          element: item,
          stickerName: stickerName,
          packId: packId,
          stickerId: stickerId
        }
      });
    };
  }

  handleClickButton(item, sticker) {
    let stickerId = sticker;
    let id = this.props.projectId;
    let packId = this.props.packId;

    return function() {
      history.push({
        pathname: "/card/create",
        search: "",
        state: {
          element: item,
          projectId: id,
          packId: packId,
          stickerId: stickerId
        }
      });
    };
  }

  render() {
    return (
      <>
        {this.props.stickers.map(sticker => (
          <div
            key={sticker.id}
            className="medium-3 large-3 cell card-zoom icons"
          >
            <div onClick={this.handleClickButton("stickerDetails", sticker.id)}>
              <img src={sticker.url} className="card-image-size" />
              <div className="name_tag">
                <p className="sticker_name_text">{sticker.name}</p>
              </div>
            </div>
            {/* <% if (pack_type === type.PACK_TYPE.curated){%> */}
            {this.props.type === type.PACK_TYPE.curated ? (
              <a
                onClick={this.handleRemoveCurated(
                  "removeCurated",
                  sticker.id,
                  sticker.name
                )}
              >
                <button
                  className="create_button add_catalogue"
                  style={{
                    background: "transparent",
                    marginTop: "22px",
                    position: "absolute"
                  }}
                >
                  <p
                    className="title"
                    style={{ color: "#af627f", fontWeight: "800" }}
                  >
                    Remove
                  </p>
                </button>
              </a>
            ) : null}
            {/* <%}%> */}
          </div>
        ))}
      </>
    );
  }
}

export default StickerCards;
