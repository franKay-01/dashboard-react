import React, { Component } from "react";
import Loader from "../../components/extra/loader";
import history from "../../history";
import type from "../../js/type";
import Parse from "parse";
import { parseSettings as config } from "../../js/serverSettings";
import { faRulerHorizontal } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

Parse.initialize(config.appId);
Parse.serverURL = config.url;

class StoryItemDivider extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mask: "none",
      error: "",
      loading: false
    };
  }

  submitStoryItemDivider = async event => {
    event.preventDefault();
    let currentUser = Parse.User.current();
    let elementType = this.props.type;
    let storyId = this.props.storyId;

    if (currentUser) {
      this.setState({
        loading: true,
        mask: "block"
      });

      const response = await Parse.Cloud.run("addStoryItem", {
        admin: currentUser.id,
        elementType: elementType,
        storyId: storyId
      });

      if (response.responseCode === 0) {
        history.goBack();
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
        <Loader loading={this.state.loading} />
        <div className="small-12 medium-6 large-6 cell create_background">
          <form method="post">
            <center>
              <div
                className="edit_labels medium-12 large-12"
                style={{ marginBottom: "30px !important" }}
              >
                New {this.props.name} Item
              </div>

              <FontAwesomeIcon
                style={{
                  color: "white",
                  fontSize: "170px"
                }}
                icon={faRulerHorizontal}
              />
            </center>
            <br />
            <span>
              <button onClick={this.submitStoryItemDivider} className="create">
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

export default StoryItemDivider;
