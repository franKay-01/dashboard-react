import React, { Component } from "react";
import Loader from "../../components/extra/loader";
import history from "../../history";
import Parse from "parse";
import { parseSettings as config } from "../../js/serverSettings";
import { faRulerHorizontal } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class StoryItemSource extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      description: "",
      link: "",
      mask: "none",
      error: "",
      loading: false
    };
  }

  submitStoryItemSource = async event => {
    event.preventDefault();
    let currentUser = Parse.User.current();
    let elementType = this.props.type;
    let name = this.state.name;
    let description = this.state.description;
    let link = this.state.link;
    let storyId = this.props.storyId;

    if (currentUser) {
      if (this.state.name !== "" && this.state.description !== "") {
        this.setState({
          loading: true,
          mask: "block"
        });

        const response = await Parse.Cloud.run("addStoryItem", {
          admin: currentUser.id,
          elementType: elementType,
          author: name,
          description: description,
          link: link,
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
                placeholder="Author Name"
                name="title"
                required=""
                aria-required="true"
                onChange={this.handleChangeName}
              />
              <p style={{ float: "left", color: "white", fontSize: "25px" }}>
                Enter Description Here:
              </p>
              <textarea
                className="box_2"
                id="content"
                style={{
                  marginBottom: "15px"
                }}
                onChange={this.handleChangeDescription}
                placeholder="Input Content Here"
                cols={30}
                rows={3}
              />

              <input
                type="text"
                className="_pack common_pack_detail validate"
                placeholder="Link"
                name="title"
                required=""
                aria-required="true"
                onChange={this.handleChangeLink}
              />
            </center>
            <span>
              <button onClick={this.submitStoryItemSource} className="create">
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

export default StoryItemSource;
