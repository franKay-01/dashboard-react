import React, { Component } from "react";
import history from "../../history";
import Parse from "parse";
import { parseSettings as config } from "../../js/serverSettings";
import Loader from "../../components/extra/loader";

Parse.initialize(config.appId);
Parse.serverURL = config.url;

class ProjectRemoval extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      mask: "none"
    };
  }

  deleteStoryItem = async event => {
    event.preventDefault();
    var currentUser = Parse.User.current();
    let itemId = this.props.itemId;

    if (currentUser) {
      if (itemId) {
        this.setState({
          loading: true,
          mask: "block"
        });

        const response = await Parse.Cloud.run("deleteStoryItem", {
          itemId: itemId
        });

        if (response.responseCode === 0) {
          history.goBack();
        }
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

  render() {
    return (
      <>
        <div id="pageMask" style={{ display: this.state.mask }} />
        <span
          className="medium-12 large-12 welcome_post"
          style={{ marginBottom: "20px" }}
        >
          <center>
            <b>
              Removing <b style={{ color: "#ec8c2a" }}>{this.props.content}</b>{" "}
              Story Item
            </b>
          </center>
          <Loader loading={this.state.loading} />
        </span>

        <div
          style={{ zIndex: "0" }}
          className="small-12 medium-6 large-6 cell create_background"
        >
          <div
            className="edit_labels medium-12 large-12"
            style={{ marginBottom: "30px !important" }}
          >
            Are you sure??
          </div>
          <div
            className="edit_labels medium-12 large-12"
            style={{
              fontSize: "30px",
              fontWeight: "500"
            }}
          >
            Removing <b style={{ color: "#ec8c2a" }}>{this.props.content}</b>{" "}
            Element is permanent!! You will have to re-add if this is a mistake.
          </div>
          <br />
          <br />
          <span style={{ float: "right" }}>
            <button
              style={{ color: "white" }}
              onClick={this.deleteStoryItem}
              className="create"
            >
              Remove
            </button>
          </span>
          <span>
            <button
              style={{ color: "white" }}
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

export default ProjectRemoval;
