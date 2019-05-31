import React, { Component } from "react";
import Loader from "../../components/extra/loader";
import history from "../../history";
import type from "../../js/type";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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

class StoryItemImage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      members: [],
      storyId: "",
      storyType: "",
      memberSelected: "",
      mask: "none",
      error: "",
      loading: false
    };
  }

  changeUrl() {}

  handleReturnButton() {
    return function() {
      history.goBack();
    };
  }

  componentDidMount() {
    this.setState({
      members: this.props.members
    });
  }

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
          <center>
            <div
              className="edit_labels medium-12 large-12"
              style={{ marginBottom: "30px !important" }}
            >
              New {this.props.name} Item
            </div>
            {this.state.members.length > 0 ? (
              this.state.memberSelected !== "" ? (
                <a
                  href={
                    "https://cryptic-waters-41617.herokuapp.com/upload/image/react/" +
                    this.props.storyId +
                    "/" +
                    this.state.memberSelected
                  }
                >
                  <button
                    className="create_button"
                    style={{ background: "white" }}
                  >
                    <p className="title button_font">
                      &nbsp;
                      <FontAwesomeIcon
                        style={{ color: "#de3c35" }}
                        className="size"
                        icon={faCircle}
                      />
                      &nbsp;
                      <span style={{ color: "#de3c35" }}>SELECT IMAGE</span>
                    </p>
                  </button>
                </a>
              ) : (
                <button
                  className="create_button"
                  style={{ background: "white" }}
                  disabled
                >
                  <p className="title button_font">
                    &nbsp;
                    <FontAwesomeIcon
                      style={{ color: "#de3c35" }}
                      className="size"
                      icon={faCircle}
                    />
                    &nbsp;
                    <span style={{ color: "#de3c35" }}>SELECT IMAGE</span>
                  </p>
                </button>
              )
            ) : (
              <a
                href={
                  "https://cryptic-waters-41617.herokuapp.com/upload/image/react/" +
                  this.props.storyId +
                  "/none"
                }
              >
                <button
                  className="create_button"
                  style={{ background: "white" }}
                >
                  <p className="title button_font">
                    &nbsp;
                    <FontAwesomeIcon
                      style={{ color: "#de3c35" }}
                      className="size"
                      icon={faCircle}
                    />
                    &nbsp;
                    <span style={{ color: "#de3c35" }}>SELECT IMAGE</span>
                  </p>
                </button>
              </a>
            )}

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
            <button
              type="button"
              id="btnCancel"
              className="cancel"
              onClick={this.handleReturnButton()}
            >
              Cancel
            </button>
          </span>
        </div>
        {/* {this.props.projectId} --- ++++++ {this.props.storyId} ++++++{" "}
        {this.props.source} ++++++ {this.props.type} */}
      </>
    );
  }
}

export default StoryItemImage;
