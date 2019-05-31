import React, { Component } from "react";
import history from "../../history";
import Parse from "parse";
import { parseSettings as config } from "../../js/serverSettings";
import Loader from "../../components/extra/loader";
import $ from "jquery";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { green } from "@material-ui/core/colors";
import { faCircle, faHandPointRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
Parse.initialize(config.appId);
Parse.serverURL = config.url;

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

class ChangeStoryType extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: "",
      itemId: "",
      text: "none",
      sticker: "none",
      image: "none",
      divider: "none",
      storyItemType: "",
      newStoryItemType: "",
      mask: "none",
      loading: false
    };
  }

  componentDidMount() {
    console.log("ID OF " + this.props.itemId);
    this.setState({
      content: this.props.content,
      itemId: this.props.itemId,
      storyItemType: this.props.storyItemType
    });
  }

  submitChanges = event => {
    event.preventDefault();
    let currentUser = Parse.User.current();
    let content = this.state.content;
    let itemId = this.state.itemId;
    let storyType = this.state.storyItemType;
    let newStoryItemType = this.state.newStoryItemType;

    if (currentUser) {
      if (newStoryItemType !== "") {
        this.setState({
          loading: true,
          mask: "block"
        });
        Parse.Cloud.run("changeStoryItem", {
          content: content,
          itemId: itemId,
          newStoryItemType: newStoryItemType,
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

  handleChangeType = event => {
    let value = event.target.value;
    if (
      value === "0" ||
      value === "2" ||
      value === "5" ||
      value === "6" ||
      value === "8"
    ) {
      this.setState({
        text: "block",
        sticker: "none",
        image: "none",
        divider: "none"
      });
    } else if (value === "1") {
      this.setState({
        text: "none",
        sticker: "none",
        image: "block",
        divider: "none"
      });
    } else if (value === "4") {
      this.setState({
        text: "none",
        sticker: "none",
        image: "none",
        divider: "block"
      });
    } else if (value === "3") {
      this.setState({
        text: "none",
        sticker: "block",
        image: "none",
        divider: "none"
      });
    }
    this.setState({
      newStoryItemType: value
    });
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

  changeSticker(item) {
    let storyId = this.props.itemId;

    history.push({
      pathname: "/card/create",
      search: "",
      state: {
        element: item,
        storyId: storyId
      }
    });
  }

  render() {
    return (
      <>
        <div id="pageMask" style={{ display: this.state.mask }} />

        <Loader loading={this.state.loading} />

        <div className="medium-8 large-8 cell create_background">
          <div className="edit_labels medium-12 large-12">
            MAKE CHANGES HERE.
          </div>
          <br />
          <center>
            <FormControl style={styles.formControl}>
              <InputLabel htmlFor="pack_type">Change/Select Type</InputLabel>
              <Select
                native
                value={this.state.type}
                onChange={this.handleChangeType}
                name="type"
                id="pack_type"
                style={{ width: "230px" }}
              >
                <option value="" />
                <option value="0">TEXT</option>
                <option value="1">IMAGE</option>
                <option value="2">QUOTE</option>
                <option value="3">STICKER</option>
                <option value="4">DIVIDER</option>
                <option value="5">ITALIC</option>
                <option value="6">BOLD</option>
                <option value="8">BOLD & ITALIC</option>
              </Select>
            </FormControl>
            <div style={{ display: this.state.text, marginTop: "30px" }}>
              <b style={{ color: "white" }}>Content</b>
              <input
                type="text"
                className="_pack common_pack_detail"
                placeholder="Content"
                onChange={this.handleChangeContent}
                value={this.state.content}
              />
            </div>
            <div style={{ display: this.state.sticker, marginTop: "30px" }}>
              <b style={{ color: "white", fontSize: "25px" }}>
                Click Here{" "}
                <FontAwesomeIcon
                  style={{ color: "#de3c35" }}
                  icon={faHandPointRight}
                />
              </b>
              <a onClick={() => this.changeSticker("storychangesticker")}>
                <button
                  className="create_button"
                  style={{ background: "white" }}
                >
                  <p className="title button_font">
                    &nbsp;
                    <FontAwesomeIcon
                      style={{ color: "#de3c35" }}
                      className="size"
                      icon={faCircle}
                    />
                    &nbsp;
                    <span style={{ color: "#de3c35" }}>SELECT STICKER</span>
                  </p>
                </button>
              </a>
            </div>
            <div style={{ display: this.state.image, marginTop: "30px" }}>
              <b style={{ color: "white", fontSize: "25px" }}>
                Click Here{" "}
                <FontAwesomeIcon
                  style={{ color: "#de3c35" }}
                  icon={faHandPointRight}
                />
              </b>
              <a
                href={
                  "https://cryptic-waters-41617.herokuapp.com/change_image/react/" +
                  this.props.itemId +
                  "/" +
                  this.props.url
                }
              >
                <button
                  className="create_button"
                  style={{ background: "white" }}
                >
                  <p className="title button_font">
                    &nbsp;
                    <FontAwesomeIcon
                      style={{ color: "#de3c35" }}
                      className="size"
                      icon={faCircle}
                    />
                    &nbsp;
                    <span style={{ color: "#de3c35" }}>SELECT IMAGE</span>
                  </p>
                </button>
              </a>
            </div>
            <div style={{ display: this.state.divider, marginTop: "30px" }}>
              <input
                type="text"
                className="_pack common_pack_detail"
                placeholder="Content"
                onChange={this.handleChangeContent}
                value={this.state.content}
              />
            </div>
            {/* <div style={{ display: this.state.link, marginTop: "30px" }}>
              <input
                type="text"
                className="_pack common_pack_detail validate"
                placeholder="Link Name"
                name="title"
                required=""
                aria-required="true"
                onChange={this.handleChangeName}
              />

              <input
                type="text"
                className="_pack common_pack_detail validate"
                placeholder="Link Url"
                name="title"
                required=""
                aria-required="true"
                onChange={this.handleChangeLink}
              />
              </div> */}
          </center>
          <br />
          <br />
          <span>
            <button onClick={this.submitChanges} className="create">
              CHANGE
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
        </div>
      </>
    );
  }
}

export default ChangeStoryType;
