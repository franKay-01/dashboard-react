import React, { Component } from "react";
import Loader from "../../components/extra/loader";
import history from "../../history";
import Parse from "parse";
import { parseSettings as config } from "../../js/serverSettings";
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

class HtmlTextForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: "",
      storyType: "",
      mask: "none",
      topColor: "#000",
      error: "",
      loading: false,
      displayColorPicker: false
    };
  }

  handleChangeComplete = color => {
    this.setState({ topColor: color.hex });
  };

  handleClick = () => {
    this.setState({ displayColorPicker: !this.state.displayColorPicker });
  };

  handleChangeTopColor = event => {
    this.setState({ topColor: event.target.value });
  };

  handleClose = () => {
    this.setState({ displayColorPicker: false });
  };

  submitHtmlItem = async event => {
    event.preventDefault();
    let currentUser = Parse.User.current();
    let elementType = this.props.type;
    let text = this.state.text;
    let color = this.state.topColor;
    let storyType = this.state.type;
    let storyItemId = this.props.storyItemId;

    if (currentUser) {
      if (this.state.text !== "") {
        this.setState({
          loading: true,
          mask: "block"
        });

        const response = await Parse.Cloud.run("addHtmlItem", {
          admin: currentUser.id,
          elementType: elementType,
          content: text,
          color: color,
          storyType: storyType,
          storyItemId: storyItemId
        });

        if (response.responseCode === 0) {
          history.goBack();
        }
      } else {
        this.setState({
          error: "Please Fill the Field."
        });
      }
    } else {
      history.push("/");
    }
  };

  handleReturnButton() {
    return function() {
      history.goBack();
    };
  }

  handleChangeText = event => {
    this.setState({
      text: event.target.value
    });
  };

  render() {
    return (
      <>
        <div id="pageMask" style={{ display: this.state.mask }} />
        <Loader loading={this.state.loading} />
        <div className="small-12 medium-6 large-6 cell create_background">
          <form method="post">
            <center>
              <div
                className="edit_labels medium-12 large-12"
                style={{ marginBottom: "30px !important" }}
              >
                New HTML {this.props.name} Item
              </div>
              <input
                type="text"
                className="_pack common_pack_detail validate"
                placeholder={"Enter " + this.props.name + " Item here"}
                onChange={this.handleChangeText}
              />
              <div style={{ color: "white" }} className="create_new">
                Text Color
              </div>
              <input
                style={{ width: "150px", margin: "20px" }}
                value={this.state.topColor}
                onChange={this.handleChangeTopColor}
              />
              &nbsp;&nbsp;
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
            </center>
            <span>
              <button onClick={this.submitHtmlItem} className="create">
                CREATE
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
        {/* {this.props.projectId} --- ++++++ {this.props.storyId} ++++++{" "}
        {this.props.source} ++++++ {this.props.type} */}
      </>
    );
  }
}

export default HtmlTextForm;
