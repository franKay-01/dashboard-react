import React, { Component } from "react";
import Loader from "../../components/extra/loader";
import history from "../../history";
import type from "../../js/type";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import { green } from "@material-ui/core/colors";
import Parse from "parse";
import { parseSettings as config } from "../../js/serverSettings";

Parse.initialize(config.appId);
Parse.serverURL = config.url;

const styles = theme => ({
  root: {
    display: "unset",
    color: green[600]
  },
  formControl: {
    margin: theme.spacing.unit * 3
  },
  group: {
    margin: `${theme.spacing.unit}px 0`
  }
});

class StoryItemForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: "",
      members: [],
      storyType: "",
      memberSelected: "",
      mask: "none",
      error: "",
      loading: false
    };
  }

  submitStoryItemNoChats = async event => {
    event.preventDefault();
    let currentUser = Parse.User.current();
    let elementType = this.props.type;
    let text = this.state.text;
    let storyId = this.props.storyId;

    if (currentUser) {
      if (this.state.text !== "") {
        this.setState({
          loading: true,
          mask: "block"
        });

        const response = await Parse.Cloud.run("addStoryItem", {
          admin: currentUser.id,
          elementType: elementType,
          content: text,
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

  submitStoryItem = async event => {
    event.preventDefault();
    let currentUser = Parse.User.current();
    let elementType = this.props.type;
    let text = this.state.text;
    let memberSelected = this.state.memberSelected;
    let storyId = this.props.storyId;
    let storyType = this.props.storyType;

    if (currentUser) {
      if (this.state.text !== "" && memberSelected !== "") {
        const response = await Parse.Cloud.run("addStoryItem", {
          admin: currentUser.id,
          elementType: elementType,
          text: text,
          selectedMember: memberSelected,
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

  handleReturnButton() {
    return function() {
      history.goBack();
    };
  }

  handleChangeText = event => {
    this.setState({
      text: event.target.value
    });
  };

  handleMemberChange = event => {
    console.log(event.target.value);
    this.setState({
      memberSelected: event.target.value
    });
  };

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
                placeholder={"Enter " + this.props.name + " Item here"}
                onChange={this.handleChangeText}
              />
              {this.props.storyType === type.STORY_TYPE.chat_single ||
              this.props.storyType === type.STORY_TYPE.chat_single_episode ||
              this.props.storyType === type.STORY_TYPE.chat_group ||
              this.props.storyType === type.STORY_TYPE.chat_group_episode ? (
                <FormControl style={styles.formControl}>
                  <InputLabel htmlFor="pack_type">Select Member</InputLabel>
                  <Select
                    native
                    value={this.state.memberSelected}
                    onChange={this.handleMemberChange}
                    style={{ width: "250px" }}
                  >
                    <option value="" />
                    <option value="admin">Administrator</option>
                    {this.props.members.map(member => (
                      <option key={member.id} value={member.id}>
                        {member.name}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              ) : null}
            </center>
            <span>
              {this.props.storyType === type.STORY_TYPE.episodes ||
              this.props.storyType === type.STORY_TYPE.chat_group_episode ||
              this.props.storyType === type.STORY_TYPE.chat_single_episode ? (
                <button onClick={this.submitStoryItem} className="create">
                  CREATE
                </button>
              ) : (
                <button
                  onClick={this.submitStoryItemNoChats}
                  className="create"
                >
                  CREATE
                </button>
              )}
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
        {/* {this.props.projectId} --- ++++++ {this.props.storyId} ++++++{" "}
        {this.props.source} ++++++ {this.props.type} */}
      </>
    );
  }
}

export default StoryItemForm;
