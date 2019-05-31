import React, { Component } from "react";
import Loader from "../../components/extra/loader";
import history from "../../history";
import Parse from "parse";
import { parseSettings as config } from "../../js/serverSettings";
import { faRulerHorizontal } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class StoryItemLink extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      link: "",
      mask: "none",
      error: "",
      loading: false
    };
  }

  submitStoryItemLink = async event => {
    event.preventDefault();
    let currentUser = Parse.User.current();
    let elementType = this.props.type;
    let name = this.state.name;
    let link = this.state.link;
    let storyId = this.props.storyId;

    if (currentUser) {
      if (this.state.name !== "" && this.state.link !== "") {
        this.setState({
          loading: true,
          mask: "block"
        });

        const response = await Parse.Cloud.run("addStoryItem", {
          admin: currentUser.id,
          elementType: elementType,
          author: name,
          url: link,
          storyId: storyId
        });

        if (response.responseCode === 0) {
          history.goBack();
        }
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
        <div className="small-12 medium-6 large-6 cell create_background">
          <form method="post">
            <center>
              <div
                className="edit_labels medium-12 large-12"
                style={{ marginBottom: "30px !important" }}
              >
                New {this.props.name} Item
              </div>
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
            </center>
            <span>
              <button onClick={this.submitStoryItemLink} className="create">
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

export default StoryItemLink;
