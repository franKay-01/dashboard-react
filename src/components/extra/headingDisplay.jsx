import React, { Component } from "react";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import history from "../../history";

class HeadingDisplay extends Component {
  constructor(props) {
    super(props);
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
      <div style={{ marginTop: "25px" }}>
        <b style={{ color: "black" }}>Heading:</b>
        <b style={{ color: "#a46580", fontSize: "20px" }}>
          &nbsp;{this.props.content.heading}
        </b>
        <br />
        <b style={{ color: "black" }}>Text:</b>
        <b style={{ color: "#a46580", fontSize: "20px" }}>
          &nbsp;{this.props.content.text}
        </b>
        <br />
        <div style={{ marginTop: "5px" }}>
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
        </div>
      </div>
    );
  }
}

export default HeadingDisplay;
