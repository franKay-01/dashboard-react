import React, { Component } from "react";
import Loader from "../../components/extra/loader";
import history from "../../history";
import Parse from "parse";
import { parseSettings as config } from "../../js/serverSettings";
import { faRulerHorizontal } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class StoryItemHeading extends Component {
  constructor(props) {
    super(props);

    this.state = {
      heading: "",
      content: "",
      mask: "none",
      error: "",
      loading: false
    };
  }

  submitStoryItemHeading = async event => {
    event.preventDefault();
    let currentUser = Parse.User.current();
    let elementType = this.props.type;
    let heading = this.state.heading;
    let content = this.state.content;
    let storyId = this.props.storyId;

    if (currentUser) {
      if (this.state.content !== "" && this.state.heading !== "") {
        this.setState({
          loading: true,
          mask: "block"
        });

        const response = await Parse.Cloud.run("addStoryItem", {
          admin: currentUser.id,
          elementType: elementType,
          content: content,
          heading: heading,
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

  handleChangeHeading = event => {
    this.setState({
      heading: event.target.value
    });
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
                placeholder="Heading Title"
                name="title"
                required=""
                aria-required="true"
                onChange={this.handleChangeHeading}
              />
              <br />
              <label
                htmlFor="content"
                style={{ color: "white", fontSize: "25px" }}
              >
                Enter Content Here:
              </label>
              <textarea
                className="box_2"
                id="content"
                style={{ marginBottom: "15px" }}
                onChange={this.handleChangeContent}
                placeholder="Input Content Here"
                cols={30}
                rows={3}
              />
            </center>
            <span>
              <button onClick={this.submitStoryItemHeading} className="create">
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

export default StoryItemHeading;
