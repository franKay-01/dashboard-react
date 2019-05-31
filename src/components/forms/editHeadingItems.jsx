import React, { Component } from "react";
import history from "../../history";
import Parse from "parse";
import { parseSettings as config } from "../../js/serverSettings";
import Loader from "../extra/loader";
import $ from "jquery";

Parse.initialize(config.appId);
Parse.serverURL = config.url;

class EditHeadingItems extends Component {
  constructor(props) {
    super(props);

    this.state = {
      heading: "",
      text: "",
      itemId: "",
      storyItemType: "",
      mask: "none",
      loading: false
    };
  }

  componentDidMount() {
    this.setState({
      heading: this.props.content.heading,
      text: this.props.content.text,
      itemId: this.props.itemId,
      storyItemType: this.props.storyItemType
    });
  }

  submitChanges = event => {
    event.preventDefault();
    let currentUser = Parse.User.current();
    let itemId = this.state.itemId;
    let heading = this.state.heading;
    let text = this.state.text;
    let storyType = this.state.storyItemType;

    if (currentUser) {
      if (this.state.heading !== "") {
        this.setState({
          loading: true,
          mask: "block"
        });
        Parse.Cloud.run("editStoryItem", {
          heading: heading,
          content: text,
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

  handleChangeHeading = event => {
    this.setState({
      heading: event.target.value
    });
  };

  handleChangeText = event => {
    this.setState({
      text: event.target.value
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

        <div className="medium-8 large-8 cell create_background">
          <form method="post" id="pack_form">
            <div className="edit_labels medium-12 large-12">
              MAKE CHANGES HERE.
            </div>
            <br />
            <center>
              <input
                className="box_2 validate"
                style={{ color: "white" }}
                value={this.state.heading}
                onChange={this.handleChangeHeading}
              />
              <br />
              <textarea
                className="box_2"
                value={this.state.text}
                style={{ marginBottom: "15px" }}
                cols={20}
                rows={3}
                onChange={this.handleChangeText}
              />
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

export default EditHeadingItems;
