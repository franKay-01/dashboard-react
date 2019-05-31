import React, { Component } from "react";
import Loader from "../../components/extra/loader";
import history from "../../history";
import Parse from "parse";
import { SketchPicker } from "react-color";
import { parseSettings as config } from "../../js/serverSettings";
import { faTint } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { green } from "@material-ui/core/colors";
import type from "../../js/type";

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

const styles = theme => ({
  root: {
    display: "unset",
    color: green[600]
  },
  formControl: {
    margin: theme.spacing.unit * 3
  },
  group: {
    margin: `${theme.spacing.unit}px 0`
  }
});

class StoryItemLink extends Component {
  constructor(props) {
    super(props);

    this.state = {
      topColor: "#fff",
      bottomColor: "#000",
      displayFirst: "block",
      displaySecond: "none",
      colorFormat: 4,
      mask: "none",
      error: "",
      loading: false,
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

  submitStoryItemLink = async event => {
    event.preventDefault();
    let currentUser = Parse.User.current();
    let elementType = this.props.type;
    let topColor = this.state.topColor;
    let bottomColor = this.state.bottomColor;
    let storyId = this.props.storyId;
    let colorFormat = this.state.colorFormat;

    if (currentUser) {
      this.setState({
        loading: true,
        mask: "block"
      });

      const response = await Parse.Cloud.run("addStoryItem", {
        admin: currentUser.id,
        elementType: elementType,
        topColor: topColor,
        bottomColor: bottomColor,
        storyId: storyId,
        colorFormat: colorFormat
      });

      if (response.responseCode === 0) {
        history.goBack();
      }
    } else {
      history.push("/");
    }
  };

  handleChangeColor = event => {
    let response = event.target.value;
    let GRADIENT = "gradient";
    let NORMAL = "normal";

    if (response === GRADIENT) {
      this.setState({
        displaySecond: "block",
        colorFormat: type.FORMAT_TYPE.gradient
      });
    } else if (response === NORMAL) {
      this.setState({
        displaySecond: "none",
        colorFormat: type.FORMAT_TYPE.regular
      });
    }
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
        <div className="small-12 medium-7 large-7 cell create_background">
          <form method="post">
            <center>
              <div
                className="edit_labels medium-12 large-12"
                style={{ marginBottom: "30px !important" }}
              >
                New {this.props.name} Item
              </div>
              <FormControl style={styles.formControl}>
                <InputLabel htmlFor="pack_type">Select Color Type</InputLabel>
                <Select
                  native
                  //   value={this.state.colorFormat}
                  onChange={this.handleChangeColor}
                  name="type"
                  id="pack_type"
                  style={{ width: "230px" }}
                >
                  <option value="normal">NORMAL</option>
                  <option value="gradient">GRADIENT</option>
                </Select>
              </FormControl>
              <div style={{ display: this.state.displayFirst }}>
                <div style={{ color: "white" }} className="create_new">
                  First Color
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
              </div>
              <br />
              <div style={{ display: this.state.displaySecond }}>
                <div style={{ color: "white" }} className="create_new">
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
              </div>
            </center>
            <span>
              <button onClick={this.submitStoryItemLink} className="create">
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
      </>
    );
  }
}

export default StoryItemLink;
