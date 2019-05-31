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

class ColorSelection extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: "",
      topColor: "",
      bottomColor: "",
      art: "",
      loading: false,
      mask: "none",
      error: "",
      displayColorPicker: false,
      displayColorPicker_2: false
    };
  }

  handleChangeComplete = color => {
    this.setState({ topColor: color.hex });
  };

  handleChangeComplete_2 = color => {
    this.setState({ bottomColor: color.hex });
  };

  handleClick = () => {
    this.setState({ displayColorPicker: !this.state.displayColorPicker });
  };

  handleClick_2 = () => {
    this.setState({ displayColorPicker_2: !this.state.displayColorPicker_2 });
  };

  handleClose = () => {
    this.setState({ displayColorPicker: false });
  };

  handleClose_2 = () => {
    this.setState({ displayColorPicker_2: false });
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

  sumbitColorChange = async event => {
    event.preventDefault();
    let currentUser = Parse.User.current();
    let topColor = this.state.topColor;
    let bottomColor = this.state.bottomColor;
    let storyId = this.props.storyId;
    console.log(storyId);
    if (currentUser) {
      this.setState({
        loading: true,
        mask: "block",
        error: ""
      });

      const response = await Parse.Cloud.run("changeColorScheme", {
        admin: currentUser.id,
        topColor: topColor,
        bottomColor: bottomColor,
        storyId: storyId,
        loading: true,
        mask: "block"
      });

      if (response.responseCode === 0) {
        let colorDetails = response.data;
        this.setState({
          topColor: colorDetails.topColor,
          bottomColor: colorDetails.bottomColor,
          loading: false,
          mask: "none"
        });
      }
    }
  };

  async componentDidMount() {
    let id = this.props.projectId;
    let topColor = this.props.topColor;
    let bottomColor = this.props.bottomColor;
    let art = this.props.art;
    let title = this.props.title;
    var currentUser = Parse.User.current();

    if (currentUser) {
      this.setState({
        topColor: topColor,
        bottomColor: bottomColor,
        art: art,
        title: title
      });
    } else {
      history.push("/");
    }
  }
  render() {
    return (
      <>
        <span
          className="medium-12 large-12 welcome_post"
          style={{ marginBottom: "20px" }}
        >
          <div id="pageMask" style={{ display: this.state.mask }} />
          <Loader loading={this.state.loading} />
        </span>
        <div className="medium-12 large-12 topList">
          <b>Edit {this.state.title} Story Color Scheme</b>
        </div>
        <div className="small-12 medium-12 large-12 cell grid-x grid-padding-x align-spaced">
          <div className="medium-3 large-3 cell icons" id="story_color">
            <div className="create_new">First Color</div>
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
            <br />
            <div className="create_new">Second Color</div>
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
            <a
              id="btnCancel"
              style={{
                color: "#a46580",
                fontWeight: 700,
                margin: "45px 10px",
                fontSize: "20px"
              }}
              onClick={this.sumbitColorChange}
            >
              Submit Change
            </a>
          </div>
          <div
            className="medium-3 large-3 cell icons"
            id="story_color"
            style={{
              backgroundImage:
                "linear-gradient(to bottom, " +
                this.state.topColor +
                "," +
                this.state.bottomColor +
                ")"
            }}
          >
            {this.state.art !== "" ? (
              <img
                className="card-image-size"
                src={this.state.art}
                width="200px"
                height="200px"
              />
            ) : (
              <p className="none" style={{ margin: "150px 80px" }}>
                <b>No Artwork</b>
              </p>
            )}
            <div
              style={{ color: "#ffffff", fontWeight: "800", fontSize: "21px" }}
              className="story_summary truncate_summary"
            >
              {this.state.title}
            </div>
          </div>
        </div>
        <span>
          <button
            type="button"
            id="btnCancel"
            className="cancel_2"
            onClick={this.handleReturnButton()}
          >
            Back
          </button>
        </span>
      </>
    );
  }
}

export default ColorSelection;
