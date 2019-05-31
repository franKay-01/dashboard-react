import React, { Component } from "react";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Loader from "../../components/extra/loader";
import history from "../../history";

class ImageItemDisplay extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      mask: "none"
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
          storyItemType: storyItemType,
          url: url
        }
      });
    };
  }

  handleDeleteItem(item) {
    let itemId = this.props.storyId;
    let storyItemType = this.props.storyItem;

    return function() {
      history.push({
        pathname: "/card/create",
        search: "",
        state: {
          element: item,
          content: storyItemType,
          itemId: itemId
        }
      });
    };
  }

  render() {
    return (
      <>
        <div id="pageMask" style={{ display: this.state.mask }} />
        <Loader loading={this.state.loading} />
        <div style={{ marginTop: "25px" }}>
          <img width="200px" src={this.props.content.uri} />
        </div>

        <a
          style={{ float: "left", marginLeft: "10px" }}
          className="preview change"
        >
          Image Item
        </a>

        <a
          onClick={this.handleChangeItem("ChangeType")}
          style={{ float: "left", marginLeft: "10px" }}
          className="preview change"
        >
          Change Type
        </a>
        <a
          onClick={this.handleDeleteItem("DeleteItem")}
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
        <br />
      </>
    );
  }
}

export default ImageItemDisplay;
