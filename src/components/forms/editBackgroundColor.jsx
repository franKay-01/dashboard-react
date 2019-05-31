import React, { Component } from "react";
import history from "../../history";
import Parse from "parse";
import { parseSettings as config } from "../../js/serverSettings";
import Loader from "../extra/loader";
import { SketchPicker } from "react-color";
import { faTint } from "@fortawesome/free-solid-svg-icons";
import type from "../../js/type";
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

class EditBackgroundColor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      itemId: "",
      oneColor: "",
      topColor: "",
      bottomColor: "",
      storyItemType: "",
      itemType: "",
      mask: "none",
      loading: false,
      displayColorPicker: false,
      displayColorPicker_2: false,
      displayColorPickerOneColor: false
    };
  }

  componentDidMount() {
    this.setState({
      oneColor: this.props.content.color,
      topColor: this.props.content.topColor,
      bottomColor: this.props.content.bottomColor,
      itemType: parseInt(this.props.content.type),
      itemId: this.props.itemId,
      storyItemType: this.props.storyItemType
    });
  }

  submitChanges = event => {
    event.preventDefault();
    let currentUser = Parse.User.current();
    let itemId = this.state.itemId;
    let oneColor = this.state.oneColor;
    let topColor = this.state.topColor;
    let bottomColor = this.state.bottomColor;
    let formatCategory = this.state.itemType;
    let storyType = this.state.storyItemType;

    if (currentUser) {
      if (formatCategory !== "") {
        this.setState({
          loading: true,
          mask: "block"
        });
        Parse.Cloud.run("editStoryItem", {
          oneColor: oneColor,
          topColor: topColor,
          bottomColor: bottomColor,
          formatCategory: formatCategory,
          itemId: itemId,
          storyType: storyType
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

  handleChangeCompleteOne = color => {
    this.setState({ oneColor: color.hex });
  };

  handleChangeComplete = color => {
    this.setState({ topColor: color.hex });
  };

  handleChangeComplete_2 = color => {
    this.setState({ bottomColor: color.hex });
  };

  handleClose = () => {
    this.setState({ displayColorPicker: false });
  };

  handleClose_2 = () => {
    this.setState({ displayColorPicker_2: false });
  };

  handleCloseOneColor = () => {
    this.setState({ displayColorPickerOneColor: false });
  };

  handleClickOneColor = () => {
    this.setState({
      displayColorPickerOneColor: !this.state.displayColorPickerOneColor
    });
  };

  handleClick = () => {
    this.setState({ displayColorPicker: !this.state.displayColorPicker });
  };

  handleClick_2 = () => {
    this.setState({ displayColorPicker_2: !this.state.displayColorPicker_2 });
  };

  handleChangeOneColor = event => {
    this.setState({ oneColor: event.target.value });
  };

  handleChangeTopColor = event => {
    this.setState({ topColor: event.target.value });
  };

  handleChangeBottomColor = event => {
    this.setState({ bottomColor: event.target.value });
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
              {this.state.itemType === type.FORMAT_TYPE.regular ? (
                <>
                  <label className="preview_2">
                    <b style={{ color: "white" }}>Type:</b>&nbsp;
                    <span style={{ color: "grey" }}>REGULAR</span>
                  </label>
                  <div
                    style={{ textAlign: "center", color: "white" }}
                    className="create_new"
                  >
                    First Color
                  </div>
                  <input
                    style={{ width: "150px", margin: "20px" }}
                    value={this.state.oneColor}
                    onChange={this.handleChangeOneColor}
                  />
                  <a onClick={this.handleClickOneColor}>
                    <FontAwesomeIcon
                      className="fa-5x"
                      style={{
                        color: this.state.oneColor,
                        fontSize: "2rem",
                        marginTop: "15px"
                      }}
                      icon={faTint}
                      //   size="xs"
                    />
                  </a>
                  {this.state.displayColorPickerOneColor ? (
                    <div style={popover}>
                      <div style={cover} onClick={this.handleCloseOneColor} />
                      <SketchPicker
                        color={this.state.oneColor}
                        onChangeComplete={this.handleChangeCompleteOne}
                      />
                    </div>
                  ) : null}
                </>
              ) : null}
              {this.state.itemType === type.FORMAT_TYPE.gradient ? (
                <>
                  <label className="preview_2">
                    <b style={{ color: "white" }}>Type:</b>&nbsp;
                    <span style={{ color: "grey" }}>GRADIENT</span>
                  </label>
                  <div
                    style={{ textAlign: "center", color: "white" }}
                    className="create_new"
                  >
                    First Color
                  </div>
                  <input
                    style={{ width: "150px", margin: "20px" }}
                    value={this.state.topColor}
                    onChange={this.handleChangeTopColor}
                  />
                  <a onClick={this.handleClick}>
                    <FontAwesomeIcon
                      className="fa-5x"
                      style={{
                        color: this.state.topColor,
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
                        color={this.state.topColor}
                        onChangeComplete={this.handleChangeComplete}
                      />
                    </div>
                  ) : null}
                  <div
                    style={{ textAlign: "center", color: "white" }}
                    className="create_new"
                  >
                    Second Color
                  </div>
                  <input
                    style={{ width: "150px", margin: "20px" }}
                    value={this.state.bottomColor}
                    onChange={this.handleChangeBottomColor}
                  />
                  &nbsp;&nbsp;
                  <a onClick={this.handleClick_2}>
                    <FontAwesomeIcon
                      className="fa-5x"
                      style={{
                        color: this.state.bottomColor,
                        fontSize: "2rem",
                        marginTop: "15px"
                      }}
                      icon={faTint}
                      //   size="xs"
                    />
                  </a>
                  {this.state.displayColorPicker_2 ? (
                    <div style={popover}>
                      <div style={cover} onClick={this.handleClose_2} />
                      <SketchPicker
                        color={this.state.bottomColor}
                        onChangeComplete={this.handleChangeComplete_2}
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
                EDIT
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

export default EditBackgroundColor;
