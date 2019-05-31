import React, { Component } from "react";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Parse from "parse";
import { parseSettings as config } from "../../js/serverSettings";
import { green } from "@material-ui/core/colors";
import history from "../../history";
import type from "../../js/type";

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

class StoryForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: "",
      summary: "",
      type: "",
      format: ""
    };
  }

  submitStory = event => {
    event.preventDefault();
    let currentUser = Parse.User.current();

    if (currentUser) {
      if (this.state.title !== "") {
        Parse.Cloud.run("createNewStory", {
          admin: currentUser.id,
          title: this.state.title,
          summary: this.state.summary,
          type: type.FORMAT_TYPE.default,
          format: this.state.format
        }).then(function(response) {
          if (response.responseCode === 0) {
            history.push("/creator/home");
          }
        });
      } else {
        this.setState({ error: "Name field can not be empty" });
      }
    } else {
      history.push("/");
    }
  };

  handleChangeTitle = event => {
    this.setState({ title: event.target.value });
  };

  handleChangeSummary = event => {
    this.setState({ summary: event.target.value });
  };

  handleChangeFormat = event => {
    this.setState({ format: event.target.value });
  };

  handleChangeType = event => {
    this.setState({ type: event.target.value });
  };

  handleReturnButton() {
    return function() {
      history.goBack();
    };
  }
  render() {
    return (
      <div className="small-12 medium-6 large-6 cell create_background">
        <form method="post">
          <center>
            <div
              className="edit_labels medium-12 large-12"
              style={{ marginBottom: "30px !important" }}
            >
              New Story Item
            </div>
            <input
              type="text"
              className="_pack common_pack_detail validate"
              placeholder="Story Title"
              name="title"
              required=""
              aria-required="true"
              onChange={this.handleChangeTitle}
            />
            <br />
            <textarea
              className="_pack common_pack_detail validate"
              placeholder="Story Summary"
              name="summary"
              required=""
              aria-required="true"
              onChange={this.handleChangeSummary}
            />

            {/* <FormControl style={styles.formControl}>
              <InputLabel htmlFor="story_type">Add Story Format</InputLabel>
              <Select
                native
                value={this.state.format}
                onChange={this.handleChangeFormat}
                name="type"
                id="story_type"
                style={{ width: "230px" }}
              >
                <option value="" />
                <option value={type.FORMAT_TYPE.default}>Default</option>
                <option value={type.FORMAT_TYPE.sideImage}>Side Image</option>
                <option value={type.FORMAT_TYPE.text}>Text</option>
                <option value={type.FORMAT_TYPE.backgroundImage}>
                  Background Image
                </option>
              </Select>
            </FormControl> */}

            {/* <br /> */}

            <FormControl style={styles.formControl}>
              <InputLabel htmlFor="story_type">Add Story Type</InputLabel>
              <Select
                native
                value={this.state.type}
                onChange={this.handleChangeType}
                name="type"
                id="story_type"
                style={{ width: "230px" }}
              >
                <option value="" />
                <option value={type.STORY_TYPE.short_stories}>
                  SHORT STORIES
                </option>
                <option value={type.STORY_TYPE.story}>STORY</option>
                {/* <option value={type.STORY_TYPE.jokes}>JOKES</option>
                <option value={type.STORY_TYPE.quotes}>QUOTES</option>
                <option value={type.STORY_TYPE.facts}>FACTS</option>
                <option value={type.STORY_TYPE.history}>HISTORY</option>
                <option value={type.STORY_TYPE.news}>NEWS</option>
                <option value={type.STORY_TYPE.episodes}>EPISODES</option>
                <option value={type.STORY_TYPE.chat_single}>
                  SINGLE CHATS
                </option>
                <option value={type.STORY_TYPE.chat_single_episode}>
                  SINGLE EPISODE CHATS
                </option>
                <option value={type.STORY_TYPE.chat_group}>GROUP CHATS</option>
                <option value={type.STORY_TYPE.chat_group_episode}>
                  GROUP EPISODE CHATS
                </option> */}
              </Select>
            </FormControl>
            <br />
            <br />
          </center>
          <span>
            <button onClick={this.submitStory} className="create">
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
    );
  }
}

export default StoryForm;
