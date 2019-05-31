import React, { Component } from "react";
import history from "../../history";
import Parse from "parse";
import { parseSettings as config } from "../../js/serverSettings";
import Loader from "../../components/extra/loader";

Parse.initialize(config.appId);
Parse.serverURL = config.url;

class EditTextStoryItems extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: "",
      itemId: "",
      storyItemType: "",
      mask: "none",
      loading: false
    };
  }

  componentDidMount() {
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

    if (currentUser) {
      if (this.state.content !== "") {
        this.setState({
          loading: true,
          mask: "block"
        });
        Parse.Cloud.run("editStoryItem", {
          content: content,
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
                type="text"
                className="_pack common_pack_detail"
                placeholder="Content"
                onChange={this.handleChangeContent}
                value={this.state.content}
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

export default EditTextStoryItems;
