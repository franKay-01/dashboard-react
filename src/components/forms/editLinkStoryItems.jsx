import React, { Component } from "react";
import history from "../../history";
import Parse from "parse";
import { parseSettings as config } from "../../js/serverSettings";
import Loader from "../../components/extra/loader";

Parse.initialize(config.appId);
Parse.serverURL = config.url;

class EditLinkStoryItems extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      url: "",
      itemId: "",
      storyItemType: "",
      mask: "none",
      loading: false
    };
  }

  componentDidMount() {
    this.setState({
      name: this.props.name,
      url: this.props.url,
      itemId: this.props.itemId,
      storyItemType: this.props.storyItemType
    });
  }

  submitChanges = event => {
    event.preventDefault();
    let currentUser = Parse.User.current();
    let name = this.state.name;
    let url = this.state.url;
    let itemId = this.state.itemId;
    let storyType = this.state.storyItemType;

    if (currentUser) {
      if (this.state.name !== "") {
        this.setState({
          loading: true,
          mask: "block"
        });
        Parse.Cloud.run("editStoryItem", {
          title: name,
          link: url,
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

  handleChangeName = event => {
    this.setState({
      name: event.target.value
    });
  };

  handleChangeLink = event => {
    this.setState({
      url: event.target.value
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
              <b style={{ color: "white", float: "left" }}>Name:</b>
              <input
                type="text"
                className="_pack common_pack_detail validate"
                placeholder="Link Name"
                value={this.state.name}
                onChange={this.handleChangeName}
              />
              <br />
              <b style={{ color: "white", float: "left" }}>Link:</b>
              <input
                type="text"
                className="_pack common_pack_detail validate"
                placeholder="Link Url"
                value={this.state.url}
                onChange={this.handleChangeLink}
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

export default EditLinkStoryItems;
