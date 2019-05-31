import React, { Component } from "react";
import history from "../../history";
import Parse from "parse";
import { parseSettings as config } from "../../js/serverSettings";
import Loader from "../../components/extra/loader";
import { SketchPicker } from "react-color";
import { faTint } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

Parse.initialize(config.appId);
Parse.serverURL = config.url;

const popover = {
  position: "absolute",
  zIndex: "2"
};
const cover = {
  position: "fixed",
  top: "0px",
  right: "0px",
  bottom: "0px",
  left: "0px"
};

class EditHtmlStoryItems extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: "",
      storyItemId: "",
      color: "",
      itemIndex: "",
      storyItemType: "",
      mask: "none",
      loading: false,
      displayColorPicker: false
    };
  }

  handleChangeComplete = color => {
    this.setState({ color: color.hex });
  };

  handleClick = () => {
    this.setState({ displayColorPicker: !this.state.displayColorPicker });
  };

  handleChangeTopColor = event => {
    this.setState({ color: event.target.value });
  };

  handleClose = () => {
    this.setState({ displayColorPicker: false });
  };

  componentDidMount() {
    this.setState({
      content: this.props.content,
      color: this.props.color,
      itemIndex: this.props.itemIndex,
      storyItemId: this.props.storyItemId,
      storyItemType: this.props.storyItemType,
      elementType: this.props.elementType
    });
  }

  submitChanges = event => {
    event.preventDefault();
    let currentUser = Parse.User.current();
    let content = this.state.content;
    let storyItemId = this.state.storyItemId;
    let color = this.state.color;
    let itemIndex = this.state.itemIndex;

    if (currentUser) {
      if (this.state.content !== "") {
        this.setState({
          loading: true,
          mask: "block"
        });
        Parse.Cloud.run("updateHtmlItem", {
          content: content,
          color: color,
          itemIndex: itemIndex,
          storyItemId: storyItemId
        }).then(function(response) {
          if (response.responseCode === 0) {
            history.goBack();
          }
        });
      } else {
        this.setState({ error: "Content can not be empty" });
      }
    } else {
      history.push("/");
    }
  };

  handleChangeContent = event => {
    this.setState({
      content: event.target.value
    });
  };

  handleReturnButton() {
    return function() {
      history.goBack();
    };
  }

  render() {
    return (
      <>
        <div id="pageMask" style={{ display: this.state.mask }} />

        <Loader loading={this.state.loading} />

        <div className="medium-8 large-8 cell create_background">
          <form method="post" id="pack_form">
            <div className="edit_labels medium-12 large-12">
              MAKE CHANGES HERE.
            </div>
            <br />
            <center>
              {this.props.elementType === "Text" ? (
                <>
                  <b style={{ color: "white", float: "left" }}>Text Content:</b>

                  <input
                    type="text"
                    className="_pack common_pack_detail"
                    placeholder="Content"
                    onChange={this.handleChangeContent}
                    value={this.state.content}
                  />
                </>
              ) : null}
              {this.props.elementType === "Italic" ? (
                <>
                  <b style={{ color: "white", float: "left" }}>Text Content:</b>

                  <input
                    type="text"
                    className="_pack common_pack_detail"
                    placeholder="Content"
                    onChange={this.handleChangeContent}
                    value={this.state.content}
                  />
                </>
              ) : null}
              {this.props.elementType === "ItalicBold" ? (
                <>
                  <b style={{ color: "white", float: "left" }}>Text Content:</b>

                  <input
                    type="text"
                    className="_pack common_pack_detail"
                    placeholder="Content"
                    onChange={this.handleChangeContent}
                    value={this.state.content}
                  />
                </>
              ) : null}
              {this.props.elementType === "Bold" ? (
                <>
                  <b style={{ color: "white", float: "left" }}>Text Content:</b>

                  <input
                    type="text"
                    className="_pack common_pack_detail"
                    placeholder="Content"
                    onChange={this.handleChangeContent}
                    value={this.state.content}
                  />
                </>
              ) : null}
              {this.props.elementType === "Color" ? (
                <>
                  <b style={{ color: "white", float: "left" }}>Text Content:</b>
                  <input
                    type="text"
                    className="_pack common_pack_detail"
                    placeholder="Content"
                    onChange={this.handleChangeContent}
                    value={this.state.content}
                  />
                  <div
                    style={{ textAlign: "center", color: "white" }}
                    className="create_new"
                  >
                    Text Color
                  </div>
                  <input
                    style={{ width: "150px", margin: "20px" }}
                    value={this.state.color}
                    onChange={this.handleChangeTopColor}
                  />
                  &nbsp;&nbsp;
                  <a onClick={this.handleClick}>
                    <FontAwesomeIcon
                      className="fa-5x"
                      style={{
                        color: this.state.color,
                        fontSize: "2rem",
                        marginTop: "15px"
                      }}
                      icon={faTint}
                      //   size="xs"
                    />
                  </a>
                  {this.state.displayColorPicker ? (
                    <div style={popover}>
                      <div style={cover} onClick={this.handleClose} />
                      <SketchPicker
                        color={this.state.color}
                        onChangeComplete={this.handleChangeComplete}
                      />
                    </div>
                  ) : null}
                </>
              ) : null}
            </center>
            <br />
            <br />
            <span>
              <button onClick={this.submitChanges} className="create">
                Edit {this.props.elementType} Elememt
              </button>
            </span>
            <span>
              <button
                type="button"
                id="btnCancel"
                className="cancel"
                onClick={this.handleReturnButton()}
              >
                Cancel
              </button>
            </span>
          </form>
        </div>
      </>
    );
  }
}

export default EditHtmlStoryItems;
