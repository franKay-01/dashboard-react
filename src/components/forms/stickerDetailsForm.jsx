import React, { Component } from "react";
import Parse from "parse";
import { parseSettings as config } from "../../js/serverSettings";
import Loader from "../extra/loader";
import history from "../../history";
import { green } from "@material-ui/core/colors";
import Select from "react-select";
import Switch from "react-switch";

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

class StickerDetailsForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      stickerId: "",
      name: "",
      description: "",
      categories: [],
      meaning: "",
      art: "",
      status: false,
      loading: true,
      mask: "block",
      next: "",
      previous: "",
      selected: [],
      selectedOption: "",
      feedId: ""
    };
  }

  async componentDidMount() {
    let id = this.props.projectId;
    let packId = this.props.packId;
    let currentUser = Parse.User.current();
    let stickerId = this.props.stickerId;

    this.setState({
      stickerId: stickerId,
      loading: true,
      mask: "block"
    });

    if (currentUser) {
      const response = await Parse.Cloud.run("getStickerDetails", {
        admin: currentUser.id,
        stickerId: stickerId,
        packId: packId,
        projectId: id
      });
      let stickerFeed = {};
      stickerFeed = await response.data;
      this.setState({
        name: stickerFeed.sticker.name,
        art: stickerFeed.sticker.art,
        description: stickerFeed.sticker.description,
        meaning: stickerFeed.sticker.meaning,
        status: stickerFeed.sticker.sold,
        next: stickerFeed.next,
        previous: stickerFeed.previous,
        categories: stickerFeed.categories,
        selected: stickerFeed.selected,
        feedId: stickerFeed.feedId,
        loading: false,
        mask: "none"
      });
    } else {
      history.push("/");
    }
  }

  handleChangeSelected = selectedOption => {
    this.setState({ selectedOption });
  };

  handleChangeStatus = checked => {
    this.setState({ status: checked });
  };

  handleChangeMeaning = event => {
    this.setState({ meaning: event.target.value });
  };

  handleChangeDescription = event => {
    this.setState({ description: event.target.value });
  };

  handleChangeName = event => {
    this.setState({ name: event.target.value });
  };

  handleReturnButton() {
    return function() {
      history.goBack();
    };
  }

  handleReturnDelete(url) {
    window.location = url;
  }

  deleteSticker = async event => {
    event.preventDefault();
    var currentUser = Parse.User.current();
    let stickerId = this.props.stickerId;
    let projectId = this.props.projectId;
    let packId = this.props.packId;
    let destination = "pack";

    if (currentUser) {
      this.setState({
        loading: true,
        mask: "block"
      });

      const response = await Parse.Cloud.run("deleteSticker", {
        stickerId: stickerId
      });

      if (response.responseCode === 0) {
        let url = "/" + destination + "/" + packId + "/" + projectId;

        this.setState({
          loading: false,
          mask: "none"
        });
        this.handleReturnDelete(url);
      }
    } else {
      history.push("/");
    }
  };

  submitStickerDetails = async event => {
    event.preventDefault();
    var currentUser = Parse.User.current();
    let packId = this.props.packId;
    let stickerId = this.props.stickerId;

    if (currentUser) {
      this.setState({
        loading: true,
        mask: "block"
      });

      const response = await Parse.Cloud.run("editSticker", {
        packId: packId,
        stickerId: stickerId,
        name: this.state.name,
        description: this.state.description,
        meaning: this.state.meaning,
        status: this.state.status,
        categories: this.state.categories,
        selected: this.state.selected,
        selectedOption: this.state.selectedOption
      });

      if (response.responseCode === 0) {
        let sticker = response.data.sticker;
        this.setState({
          name: sticker.name,
          description: sticker.description,
          meaning: sticker.meaning,
          status: sticker.sold,
          selected: sticker.selected,
          loading: false,
          mask: "none"
        });
      }
    }
  };

  render() {
    const options = this.state.categories;
    return (
      <>
        <span className="medium-12 large-12 welcome_post">
          <div id="pageMask" style={{ display: this.state.mask }} />

          <center>
            {Object.keys(this.state.name) !== "" ? (
              <>
                <b>Editing {this.state.name} Sticker</b>
              </>
            ) : (
              <>
                <b> Sticker Pack</b>
              </>
            )}
          </center>
          <Loader loading={this.state.loading} />
        </span>
        <div className="small-12 medium-10 large-10 cell grid-x grid-padding-x align-spaced packDetails">
          <div className="small-12 medium-5 large-5 cell">
            <div className="droppableArea">
              <div className="output" name="tfile" />
              {this.state.art !== "" ? (
                <img
                  id="im1"
                  name="im1"
                  style={{ width: "100%", height: "100%" }}
                  src={this.state.art}
                />
              ) : (
                <center>
                  <p className="none">
                    <b>No Artwork</b>
                  </p>
                </center>
              )}
            </div>
          </div>
          <div className="medium-6 large-5 cell">
            <label className="update_label">Sticker Name:</label>

            <input
              placeholder="Sticker Name"
              className="box_2"
              name="stickerName"
              onChange={this.handleChangeName}
              style={{ width: "100%", marginBottom: "25px" }}
              value={this.state.name}
            />
            <br />
            <label className="update_label">Selected Categories:</label>
            <input
              placeholder="Sticker Name"
              className="box_2"
              name="stickerName"
              onChange={this.handleChangeName}
              style={{ width: "100%" }}
              value={this.state.selected}
              disabled
            />

            <Select
              value={this.state.selectedOption}
              onChange={this.handleChangeSelected}
              options={options}
              isMulti
              name="categories"
            />
            <br />
            <label className="update_label">Status of Sticker:</label>
            <label htmlFor="normal-switch">
              <span style={{ fontSize: "20px" }}>
                Is this Sticker for sale? -{" "}
              </span>
              <Switch
                onChange={this.handleChangeStatus}
                checked={this.state.status}
                className="react-switch"
                id="normal-switch"
              />
            </label>
            <br />
            <label className="update_label">Sticker Description:</label>
            <input
              placeholder="Sticker Description"
              className="box_2"
              name="stickerName"
              onChange={this.handleChangeDescription}
              style={{ width: "100%", marginBottom: "25px" }}
              value={this.state.description}
            />
            <br />
            <label className="update_label">Sticker Meaning:</label>
            <input
              placeholder="Sticker Description"
              className="box_2"
              name="stickerName"
              onChange={this.handleChangeMeaning}
              style={{ width: "100%", marginBottom: "25px" }}
              value={this.state.meaning}
            />
          </div>
          <div className="small-12 medium-12 large-12">
            <span style={{ float: "right" }}>
              <button
                style={{ color: "#a46580" }}
                onClick={this.submitStickerDetails}
                className="create"
              >
                Edit
              </button>
            </span>
            {/* {this.state.feedId !== this.props.stickerId ? (
              <span>
                <button
                  style={{ color: "#a46580" }}
                  type="button"
                  className="create"
                  onClick={this.deleteSticker}
                >
                  Delete
                </button>
              </span>
            ) : null} */}

            <span>
              <button
                style={{ color: "#a46580" }}
                type="button"
                id="btnCancel"
                className="cancel"
                onClick={this.handleReturnButton()}
              >
                Cancel
              </button>
            </span>
          </div>
        </div>
      </>
    );
  }
}

export default StickerDetailsForm;
