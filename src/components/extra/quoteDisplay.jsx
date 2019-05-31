import React, { Component } from "react";
import {
  faTrash,
  faQuoteLeft,
  faQuoteRight
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import history from "../../history";

class TextAreaDisplay extends Component {
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
    let content = this.props.content;
    let itemId = this.props.storyId;
    let storyItemType = this.props.storyType;
    let url = this.props.url;
    url = btoa(url);
    url = atob(url);

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
          <FontAwesomeIcon
            style={{ color: "#a46580", fontSize: "1rem", marginBottom: "8px" }}
            icon={faQuoteLeft}
          />
          &nbsp;
          <b style={{ color: "#a46580", fontSize: "20px" }}>
            {this.props.content}
          </b>
          &nbsp;
          <FontAwesomeIcon
            style={{ color: "#a46580", fontSize: "1rem", marginBottom: "8px" }}
            icon={faQuoteRight}
          />
        </div>
        <br />
        <a
          style={{ float: "left" }}
          onClick={this.handleEditItem(this.props.storyItem)}
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

export default TextAreaDisplay;
