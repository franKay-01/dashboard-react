import React, { Component } from "react";
import history from "../../history";
import ChipInput from "material-ui-chip-input";
import Parse from "parse";
import { parseSettings as config } from "../../js/serverSettings";
import Loader from "../../components/extra/loader";

Parse.initialize(config.appId);
Parse.serverURL = config.url;

class StickerForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      stickerId: "",
      description: "",
      mask: "none",
      error: "",
      loading: false
    };
  }

  submitDescriptionChange = event => {
    event.preventDefault();
    var currentUser = Parse.User.current();
    let sticker = this.state.stickerId;
    let description = this.state.description;
    if (currentUser) {
      if (this.state.name !== "") {
        this.setState({
          loading: true,
          mask: "block",
          error: ""
        });
        Parse.Cloud.run("updateDescription", {
          admin: currentUser.id,
          stickerId: sticker,
          description: description
        }).then(function(response) {
          if (response.responseCode === 0) {
            history.goBack();
          }
        });
      } else {
        this.setState({ error: "Description field can not be empty" });
      }
    } else {
      history.push("/");
    }
  };

  componentDidMount() {
    this.setState({
      name: this.props.name,
      stickerId: this.props.stickerId
    });
  }

  handleDescription = event => {
    this.setState({
      description: event.target.value
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
        <div className="small-12 medium-6 large-6 cell create_background">
          <form method="post">
            <center>
              <div
                className="edit_labels medium-12 large-12"
                style={{ marginBottom: "30px !important" }}
              >
                Add Description to{" "}
                <i style={{ color: "#e6892b" }}>{this.state.name}</i> Sticker
              </div>
              <br />
              <label style={{ color: "white" }}>{this.state.error}</label>
              <input
                type="text"
                className="_pack common_pack_detail validate"
                placeholder="Stickers's Description"
                onChange={this.handleDescription}
              />

              <br />
            </center>
            <span>
              <button onClick={this.submitDescriptionChange} className="create">
                Update
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

export default StickerForm;
