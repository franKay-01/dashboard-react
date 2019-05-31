import React, { Component } from "react";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Loader from "../../components/extra/loader";
import history from "../../history";

class HtmlTextAreaDisplay extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      mask: "none"
    };
  }

  handleEditItem(item) {
    let url = "htmlStoryItem";
    let content = this.props.content;
    let itemId = this.props.storyId;
    let storyItemType = this.props.storyType;
    let color = this.props.color;
    let itemIndex = this.props.itemIndex;

    return function() {
      history.push({
        pathname: "/card/create",
        search: "",
        state: {
          element: url,
          content: content,
          itemId: itemId,
          itemIndex: itemIndex,
          elementType: item,
          color: color,
          storyItemType: storyItemType
        }
      });
    };
  }

  handleChangeItem(item) {
    let content = this.props.content;
    let itemId = this.props.storyId;
    let storyItemType = this.props.storyType;
    let itemIndex = this.props.itemIndex;

    return function() {
      history.push({
        pathname: "/card/create",
        search: "",
        state: {
          element: item,
          itemIndex: itemIndex,
          content: content,
          itemId: itemId,
          storyItemType: storyItemType
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
          {this.props.storyItem === "Text" ? (
            <textarea
              className="box_2"
              id="description"
              name="description"
              value={this.props.content}
              style={{ marginBottom: "15px" }}
              cols={30}
              rows={3}
            />
          ) : null}
          {this.props.storyItem === "Italic" ? (
            <i>{this.props.content}</i>
          ) : null}
          {this.props.storyItem === "ItalicBold" ? (
            <i>
              <b>{this.props.content}</b>
            </i>
          ) : null}
          {this.props.storyItem === "Bold" ? <b>{this.props.content}</b> : null}
          {this.props.storyItem === "Color" ? (
            <>
              <b>Color: {this.props.color}</b>
              <br />
              <b>Text:</b>&nbsp;
              <b style={{ color: this.props.color }}>{this.props.content}</b>
            </>
          ) : null}
        </div>
        <a
          style={{ float: "left" }}
          onClick={this.handleEditItem(this.props.storyItem)}
          className="preview"
        >
          Edit {this.props.storyItem}
        </a>
        &nbsp;&nbsp;
        <a
          onClick={this.handleChangeItem("ChangeHtmlType")}
          style={{ float: "left", marginLeft: "10px" }}
          className="preview change"
        >
          Change Type
        </a>
        {/* <a
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
        </a> */}
      </>
    );
  }
}

export default HtmlTextAreaDisplay;
