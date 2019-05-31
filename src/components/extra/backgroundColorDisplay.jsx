import React, { Component } from "react";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type from "../../js/type";
import history from "../../history";

class BackgroundColorDisplay extends Component {
  constructor(props) {
    super(props);

    this.state = {
      contentType: parseInt(this.props.content.type)
    };
  }

  handleEditItem(item) {
    let content = this.props.content;
    let itemId = this.props.storyId;
    let storyItemType = this.props.storyType;

    return function() {
      history.push({
        pathname: "/card/create",
        search: "",
        state: {
          element: item,
          content: content,
          itemId: itemId,
          storyItemType: storyItemType
        }
      });
    };
  }

  handleChangeItem(item) {
    let content = "";
    let itemId = this.props.storyId;
    let storyItemType = this.props.storyType;
    let url = this.props.url;
    url = btoa(url);

    return function() {
      history.push({
        pathname: "/card/create",
        search: "",
        state: {
          element: item,
          content: content,
          itemId: itemId,
          url: url,
          storyItemType: storyItemType
        }
      });
    };
  }

  render() {
    return (
      <>
        <div style={{ marginTop: "25px" }}>
          {this.state.contentType === type.FORMAT_TYPE.regular ? (
            <>
              <label className="preview_2">
                <b>Type:</b>&nbsp;
                <span style={{ color: "green" }}>REGULAR</span>
              </label>

              <label className="preview_2">
                <b>Color 1:</b>&nbsp;
                {this.props.content.color}
              </label>
            </>
          ) : null}
          {this.state.contentType === type.FORMAT_TYPE.gradient ? (
            <>
              <label className="preview_2">
                <b>Type:</b>&nbsp;
                <span style={{ color: "green" }}>GRADIENT</span>
              </label>
              <label className="preview_2">
                <b>Color 1:</b>&nbsp;
                {this.props.content.topColor}
              </label>

              <label className="preview_2">
                <b>Color 2:</b>&nbsp;
                {this.props.content.bottomColor}
              </label>
            </>
          ) : null}
        </div>
        <br />
        <a
          onClick={this.handleEditItem(this.props.storyItem)}
          style={{ float: "left" }}
          className="preview"
        >
          Edit {this.props.storyItem}
        </a>
        &nbsp;&nbsp;
        <a
          onClick={this.handleChangeItem("ChangeType")}
          style={{ float: "left", marginLeft: "10px" }}
          className="preview change"
        >
          Change Type
        </a>
        <a
          href="#"
          style={{
            float: "left",
            marginLeft: "10px"
          }}
          className="preview_3"
        >
          Delete
          <FontAwesomeIcon
            style={{
              color: "#cc0000",
              fontSize: "15px",
              margin: "2px 5px"
            }}
            icon={faTrash}
          />
        </a>
      </>
    );
  }
}

export default BackgroundColorDisplay;
