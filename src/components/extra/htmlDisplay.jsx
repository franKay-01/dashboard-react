import React, { Component } from "react";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type from "../../js/type";
import history from "../../history";
import TopHeader from "../../components/cards/header";
import Loader from "../../components/extra/loader";

class BackgroundColorDisplay extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: [],
      mask: "none",
      loading: false
    };
  }

  handleClickEvent(storyItemId) {
    // let projectId = this.props.projectId;
    let storyId = this.props.storyId;

    let url = "/htmlEdit/" + storyItemId + "/" + storyId;
    return function() {
      history.push({
        pathname: url,
        search: ""
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

  componentDidMount() {
    let html = this.props.content.html;

    let htmlArray = [];
    for (let i = 0; i < html.length; i++) {
      let _html = html[i];
      let _type = Object.keys(_html)[0];
      let _content = Object.values(_html)[0];

      htmlArray.push({ type: parseInt(_type), content: _content });
    }

    this.setState({
      content: htmlArray
    });
  }

  render() {
    return (
      <>
        <div style={{ marginTop: "25px" }}>
          {this.state.content.map(item => (
            <>
              {item.type === 0 ? <span>{item.content.text}</span> : null}
              {item.type === 5 ? (
                <span>
                  <i>{item.content.text}</i>&nbsp;
                </span>
              ) : null}
              {item.type === 6 ? (
                <span>
                  <b>{item.content.text}</b>&nbsp;
                </span>
              ) : null}
              {item.type === 8 ? (
                <span>
                  <b>
                    <i>{item.content.text}</i>&nbsp;
                  </b>
                  &nbsp;
                </span>
              ) : null}
              {item.type === 14 ? (
                <span style={{ color: item.content.color }}>
                  {item.content.text}&nbsp;
                </span>
              ) : null}
            </>
          ))}
          <br />
          <a
            style={{ float: "left" }}
            onClick={this.handleClickEvent(this.props.storyItemId)}
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
      </>
    );
  }
}

export default BackgroundColorDisplay;
