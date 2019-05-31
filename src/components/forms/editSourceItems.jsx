import React, { Component } from "react";
import history from "../../history";
import Parse from "parse";
import { parseSettings as config } from "../../js/serverSettings";
import Loader from "../extra/loader";
import $ from "jquery";

Parse.initialize(config.appId);
Parse.serverURL = config.url;

class EditSourceItems extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      description: "",
      link: "",
      storyItemType: "",
      mask: "none",
      loading: false
    };
  }

  componentDidMount() {
    this.setState({
      name: this.props.content.name,
      description: this.props.content.description,
      link: this.props.content.link,
      itemId: this.props.itemId,
      storyItemType: this.props.storyItemType
    });
  }

  submitChanges = event => {
    event.preventDefault();
    let currentUser = Parse.User.current();
    let itemId = this.state.itemId;
    let name = this.state.name;
    let description = this.state.description;
    let link = this.state.link;
    let storyType = this.state.storyItemType;

    if (currentUser) {
      if (this.state.heading !== "") {
        this.setState({
          loading: true,
          mask: "block"
        });
        Parse.Cloud.run("editStoryItem", {
          title: name,
          description: description,
          link: link,
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

  handleChangeDescription = event => {
    this.setState({
      description: event.target.value
    });
  };

  handleChangeLink = event => {
    this.setState({
      link: event.target.value
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
                className="box_2 validate"
                style={{ color: "white" }}
                value={this.state.name}
                onChange={this.handleChangeName}
              />
              <br />
              <b style={{ color: "white", float: "left" }}>Link:</b>

              <input
                className="box_2 validate"
                style={{ color: "white" }}
                value={this.state.link}
                onChange={this.handleChangeLink}
              />
              <br />
              <b style={{ color: "white", float: "left" }}>Description:</b>

              <textarea
                className="box_2"
                value={this.state.description}
                style={{ marginBottom: "15px" }}
                cols={20}
                rows={3}
                onChange={this.handleChangeDescription}
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

export default EditSourceItems;
