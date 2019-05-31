import React, { Component } from "react";
import history from "../../history";
import Parse from "parse";
import { parseSettings as config } from "../../js/serverSettings";
import Loader from "../../components/extra/loader";

Parse.initialize(config.appId);
Parse.serverURL = config.url;

class SubmitForReview extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      mask: "none"
    };
  }

  submitForReview = async event => {
    event.preventDefault();
    var currentUser = Parse.User.current();
    let itemId = this.props.itemId;
    let itemType = this.props.itemType;

    if (currentUser) {
      if (itemId) {
        this.setState({
          loading: true,
          mask: "block"
        });

        const response = await Parse.Cloud.run("submitForReview", {
          itemId: itemId,
          itemType: itemType
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
              Submitting <b style={{ color: "#ec8c2a" }}>{this.props.name}</b>{" "}
              {this.props.itemType} Item
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
            You are about to submit{" "}
            <b style={{ color: "#ec8c2a" }}>{this.props.name}</b> for Review.
            Click Submit if you are certain!
          </div>
          <br />
          <br />
          <span style={{ float: "right" }}>
            <button
              style={{ color: "white" }}
              onClick={this.submitForReview}
              className="create"
            >
              Submit
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

export default SubmitForReview;
