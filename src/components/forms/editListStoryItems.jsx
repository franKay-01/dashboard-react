import React, { Component } from "react";
import history from "../../history";
import Parse from "parse";
import { parseSettings as config } from "../../js/serverSettings";
import Loader from "../../components/extra/loader";
import $ from "jquery";

Parse.initialize(config.appId);
Parse.serverURL = config.url;

class EditListStoryItems extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: [],
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
    let itemId = this.state.itemId;
    let storyType = this.state.storyItemType;

    var taskArray = new Array();
    $("input[name=content]").each(function() {
      taskArray.push($(this).val());
    });

    if (currentUser) {
      if (taskArray.length > 0) {
        this.setState({
          loading: true,
          mask: "block"
        });
        Parse.Cloud.run("editStoryItem", {
          content: taskArray,
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

  handleChangeList(element) {
    let answer = $("input[id=" + element + "]").val();
    let newArray = this.state.content;
    newArray[element] = answer;
    this.setState({
      content: newArray
    });
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
              {this.props.content.map((list, index) => (
                <input
                  key={index}
                  id={index}
                  className="box_2 validate"
                  style={{ color: "white" }}
                  name="content"
                  value={list}
                  onChange={() => this.handleChangeList(index)}
                />
              ))}
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

export default EditListStoryItems;
