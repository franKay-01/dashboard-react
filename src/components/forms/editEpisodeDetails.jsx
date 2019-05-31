import React, { Component } from "react";
import history from "../../history";
import Parse from "parse";
import { parseSettings as config } from "../../js/serverSettings";
import Loader from "../../components/extra/loader";
import $ from "jquery";
import { faCircle, faQuestion } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { green } from "@material-ui/core/colors";

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

class EditEpisodeDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      itemId: "",
      story: {},
      episode: {},
      status: "",
      project: "",
      published: "",
      mask: "none",
      loading: false
    };
  }

  async componentDidMount() {
    // let id = this.props.match.params.projectId;
    let storyId = this.props.storyId;
    var currentUser = Parse.User.current();

    if (currentUser) {
      this.setState({
        loading: true,
        mask: "block"
      });
      const response = await Parse.Cloud.run("getEpisodeDetails", {
        // admin: currentUser.id,
        // projectId: id,
        storyId: storyId
      });
      let episodefeed = {};
      episodefeed = await response.data;

      this.setState({
        // projects: packfeed.projects,
        episodeId: episodefeed.episode.id,
        title: episodefeed.episode.title,
        published: episodefeed.episode.published,
        status: episodefeed.episode.status,
        project: episodefeed.project,
        story: episodefeed.story,
        loading: false,
        mask: "none"
      });
    } else {
      history.push("/");
    }
  }

  handleChangeStatus = event => {
    this.setState({
      status: event.target.value
    });
  };

  submitEpisodeDetails = async event => {
    event.preventDefault();
    let currentUser = Parse.User.current();
    let episodeId = this.state.episodeId;
    let title = this.state.title;
    let status = this.state.status;

    if (currentUser) {
      if (episodeId !== "") {
        this.setState({
          loading: true,
          mask: "block"
        });

        const response = await Parse.Cloud.run("editEpisodeDetails", {
          episodeId: episodeId,
          title: title,
          status: status
        });

        let episodefeed = {};

        if (response.responseCode === 0) {
          episodefeed = response.data;

          this.setState({
            title: episodefeed.episode.title,
            status: episodefeed.episode.status,
            loading: false,
            mask: "none"
          });
        }
      }
    } else {
      history.push("/");
    }
  };

  handleChangeTitle = event => {
    this.setState({
      title: event.target.value
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
        <div className="grid-x grid-padding-x align-spaced">
          <span className="medium-12 large-12 welcome_post">
            {this.state.title !== "" ? (
              <b>{this.state.title} - Episode Details</b>
            ) : (
              <b> Episode Details</b>
            )}
          </span>
          <div className="medium-3 large-3 cell">
            <div className="icons">
              <div className="create_new">
                Publishing
                {this.state.published === false ? (
                  <p style={{ marginTop: "-25px" }}>
                    <FontAwesomeIcon
                      className="size"
                      style={{
                        color: "#f8ab1c",
                        float: "right"
                      }}
                      icon={faCircle}
                    />
                  </p>
                ) : (
                  <p style={{ marginTop: "-25px" }}>
                    <FontAwesomeIcon
                      className="size"
                      style={{
                        color: "#7ed321",
                        float: "right"
                      }}
                      icon={faCircle}
                    />
                  </p>
                )}
              </div>
              {this.state.published === false ? (
                <a href="#" id="showPermission">
                  <button className="create_button">
                    <p className="title" style={{ fontSize: "15px" }}>
                      &nbsp;
                      <FontAwesomeIcon
                        className="size"
                        style={{
                          color: "white"
                        }}
                        icon={faCircle}
                      />
                      &nbsp;PUBLISH
                    </p>
                  </button>
                </a>
              ) : (
                <a href="#" id="showPermission">
                  <button className="create_button">
                    <p className="title" style={{ fontSize: "15px" }}>
                      &nbsp;{" "}
                      <FontAwesomeIcon
                        className="size"
                        style={{
                          color: "white"
                        }}
                        icon={faCircle}
                      />
                      &nbsp;UNPUBLISH
                    </p>
                  </button>
                </a>
              )}
              <button
                className="create_button"
                style={{ backgroundColor: "#f1f1f1" }}
                disabled
              >
                <p className="title button_font">
                  &nbsp;
                  <FontAwesomeIcon
                    className="size"
                    style={{
                      color: "#f8ab1c"
                    }}
                    icon={faCircle}
                  />
                  &nbsp;UNPUBLISHED
                </p>
              </button>

              <button
                className="create_button"
                style={{ backgroundColor: "#f1f1f1" }}
                disabled
              >
                <p className="title button_font">
                  &nbsp;
                  <FontAwesomeIcon
                    className="size"
                    style={{
                      color: "#7ed321"
                    }}
                    icon={faCircle}
                  />
                  &nbsp; PUBLISHED
                </p>
              </button>

              {this.state.published === true ? (
                <button
                  className="create_button"
                  style={{ backgroundColor: "#f1f1f1" }}
                  disabled
                >
                  <p className="title button_font">
                    &nbsp;
                    <FontAwesomeIcon
                      className="size"
                      style={{
                        color: "darkred"
                      }}
                      icon={faCircle}
                    />
                    &nbsp; DELETE
                  </p>
                </button>
              ) : (
                <button
                  className="create_button"
                  style={{ backgroundColor: "#f1f1f1" }}
                >
                  <p className="title button_font">
                    &nbsp;
                    <FontAwesomeIcon
                      className="size"
                      style={{
                        color: "darkred"
                      }}
                      icon={faCircle}
                    />
                    &nbsp; DELETE
                  </p>
                </button>
              )}
            </div>
          </div>
          <div className="small-12 medium-8 large-8 story_form">
            <label className="update_label">Episode Title:</label>
            <input
              placeholder="Story Title"
              style={{ width: "60%", marginBottom: "25px" }}
              className="box_2"
              name="title"
              value={this.state.title}
              onChange={this.handleChangeTitle}
            />
            <label className="update_label">Main Story Title:</label>
            <input
              placeholder="Keywords"
              style={{ width: "60%", marginBottom: "25px" }}
              className="box_2"
              name="title"
              value={this.state.story.title}
              disabled
            />
            <label className="update_label">Project Title:</label>
            <input
              placeholder="Keywords"
              style={{ width: "60%", marginBottom: "25px" }}
              className="box_2"
              name="title"
              value={this.state.project}
              disabled
            />
            <br />
            <label className="update_label">
              Sold
              <FontAwesomeIcon
                style={{
                  color: "#f8ab1c"
                }}
                icon={faQuestion}
              />
            </label>

            <FormControl style={styles.formControl}>
              <InputLabel htmlFor="story_type">Add Story Format</InputLabel>
              <Select
                native
                value={this.state.status}
                onChange={this.handleChangeStatus}
                name="type"
                id="story_type"
                style={{ width: "230px" }}
              >
                <option value="" />
                <option value="true">TRUE</option>
                <option value="false">FALSE</option>
              </Select>
            </FormControl>
            <br />
            <br />
            <a
              onClick={this.submitEpisodeDetails}
              href="#"
              id="submit_story"
              className="preview_2"
            >
              Save Changes
            </a>
            <br />

            <button
              type="button"
              id="btnCancel"
              className="preview_2"
              style={{ color: "#a46580", fontWeight: 700 }}
              onClick={this.handleReturnButton()}
            >
              Back
            </button>
          </div>
        </div>
      </>
    );
  }
}

export default EditEpisodeDetails;
