import React, { Component } from "react";
import history from "../../history";
import Parse from "parse";
import "../../App.css";
import "../../css/myStyle.css";
import TopHeader from "../../components/cards/header";
import Menu from "../../components/extra/menu";
import Stickers from "../../components/cards/stickerCards";
import { parseSettings as config } from "../../js/serverSettings";
import {
  faCircle,
  faMinusSquare,
  faArrowLeft,
  faArrowRight,
  faPlusSquare,
  faCamera,
  faSort,
  faIdBadge
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Loader from "../../components/extra/loader";
import type from "../../js/type";
import ClickSelection from "../../components/extra/clickSelection";

Parse.initialize(config.appId);
Parse.serverURL = config.url;

class StoryPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: "",
      keywords: [],
      summary: "",
      next: "",
      type: 0,
      image: {},
      projects: [],
      author: "",
      authorId: "",
      previous: "",
      feedId: "",
      colors: {},
      mask: "none",
      incoming: "",
      outgoing: "",
      published: "",
      loading: false
    };
  }

  async componentDidMount() {
    let id = this.props.match.params.projectId;
    let storyId = this.props.match.params.storyId;
    var currentUser = Parse.User.current();

    if (currentUser) {
      this.setState({
        loading: true,
        mask: "block"
      });

      const response = await Parse.Cloud.run("getStoryDetails", {
        admin: currentUser.id,
        projectId: id,
        storyId: storyId
      });

      let storyfeed = {};
      storyfeed = await response.data;

      this.setState({
        title: storyfeed.story.title,
        summary: storyfeed.story.summary,
        keywords: storyfeed.story.keywords,
        incoming: storyfeed.story.info.incoming,
        outgoing: storyfeed.story.info.outgoing,
        projects: storyfeed.projects,
        next: storyfeed.next,
        previous: storyfeed.previous,
        image: storyfeed.art,
        type: storyfeed.story.type,
        published: storyfeed.story.published,
        feedId: storyfeed.feedId,
        author: storyfeed.authorName,
        authorId: storyfeed.authorId,
        colors: storyfeed.colors,
        currentProjects: storyfeed.story.projects,
        loading: false,
        mask: "none"
      });
    }
  }

  handleRemoveProject(item, projectId, projectName) {
    let currentProject = projectId;
    let destination = item;
    let name = projectName;
    let storyId = this.props.match.params.storyId;
    return function() {
      history.push({
        pathname: "/card/create",
        search: "",
        state: {
          element: destination,
          projectId: currentProject,
          itemId: storyId,
          projectName: name,
          currentType: "story"
        }
      });
    };
  }

  setStoryArt(item, status) {
    let storyId = this.props.match.params.storyId;
    let url = window.location.href;
    return function() {
      history.push({
        pathname: "/card/create",
        search: "",
        state: {
          element: item,
          storyId: storyId,
          url: url,
          status: status
        }
      });
    };
  }

  handleClickFindAuthors(item) {
    let id = this.props.match.params.projectId;
    let storyId = this.props.match.params.storyId;

    return function() {
      history.push({
        pathname: "/card/create",
        search: "",
        state: {
          element: item,
          projectId: id,
          storyId: storyId
        }
      });
    };
  }

  handleSendToStoryItem(destination) {
    let projectId = this.props.match.params.projectId;
    let storyId = this.props.match.params.storyId;
    let source = "story";
    let url =
      "/" + destination + "/" + source + "/" + storyId + "/" + projectId;
    return function() {
      history.push({
        pathname: url,
        search: ""
      });
    };
  }

  handleClickButton(item) {
    let id = this.props.match.params.projectId;
    let storyId = this.props.match.params.storyId;
    let projects = this.state.currentProjects;
    let topColor = this.state.colors.topColor;
    let bottomColor = this.state.colors.bottomColor;
    let incoming = this.state.incoming;
    let outgoing = this.state.outgoing;
    let art = this.state.image.art;
    let title = this.state.title;

    return function() {
      history.push({
        pathname: "/card/create",
        search: "",
        state: {
          element: item,
          projectId: id,
          itemId: storyId,
          currentProjects: projects,
          currentType: "story",
          topColor: topColor,
          bottomColor: bottomColor,
          incoming: incoming,
          outgoing: outgoing,
          art: art,
          title: title
        }
      });
    };
  }

  handleChangeTitle = event => {
    this.setState({ title: event.target.value });
  };

  handleChangeKeywords = event => {
    let newArray = [];
    newArray.push(event.target.value.split(","));
    this.setState({ keywords: newArray });
  };

  handleChangeTextArea = event => {
    this.setState({ summary: event.target.value });
  };

  submitStoryDetails = async event => {
    event.preventDefault();
    let currentUser = Parse.User.current();
    let id = this.props.match.params.projectId;
    let storyId = this.props.match.params.storyId;

    if (currentUser) {
      if (this.state.title !== "") {
        this.setState({
          loading: true,
          mask: "block"
        });
        const response = await Parse.Cloud.run("editStory", {
          admin: currentUser.id,
          storyId: storyId,
          title: this.state.title,
          summary: this.state.summary,
          keywords: this.state.keywords
        });
        let storyDetails = {};
        storyDetails = response.data;

        this.setState({
          title: storyDetails.title,
          summary: storyDetails.summary,
          keywords: storyDetails.keywords,
          loading: false,
          mask: "none"
        });
      }
    } else {
      history.push("/");
    }
  };

  handleClickEvent(destination) {
    let projectId = this.props.match.params.projectId;
    let storyId = this.props.match.params.storyId;
    let url = "/" + destination + "/" + storyId + "/" + projectId;
    return function() {
      history.push({
        pathname: url,
        search: ""
      });
    };
  }

  handleReturnButton() {
    return function() {
      history.goBack();
    };
  }

  render() {
    return (
      <>
        <div id="pageMask" style={{ display: this.state.mask }} />
        <div
          className="grid-x grid-padding-x align-left"
          style={{ margin: "50px" }}
        >
          <TopHeader />
        </div>

        <Loader loading={this.state.loading} />

        <div className="grid-x grid-padding-x align-spaced">
          <span className="medium-12 large-12 welcome_post">
            {this.state.title !== "" ? (
              <b>{this.state.title} - Story Details</b>
            ) : (
              <b> Story Details</b>
            )}
          </span>
          {/** Menu Bar */}
          <div className="medium-3 large-3 cell">
            <div className="login_card">
              <Menu projectId={this.props.match.params.projectId} />
            </div>

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
              {this.state.feedId !== "" ? (
                this.state.feedId === this.props.storyId ? (
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
                )
              ) : null}
              <center className="indication">
                <span style={{ paddingRight: "125px" }}>
                  {/* <% if (previous !== ""){ %> */}
                  {this.state.next !== "" ? (
                    <a
                      style={{ color: "#a46580" }}
                      href={
                        "/story/" +
                        this.state.previous +
                        "/" +
                        this.props.match.params.projectId
                      }
                    >
                      <FontAwesomeIcon size="3x" icon={faArrowLeft} />
                    </a>
                  ) : null}

                  {/* <% } %> */}
                </span>
                <span>
                  {/* <% if (next !== ""){ %> */}
                  {this.state.next !== "" ? (
                    <a
                      style={{ color: "#a46580" }}
                      href={
                        "/story/" +
                        this.state.next +
                        "/" +
                        this.props.match.params.projectId
                      }
                    >
                      <FontAwesomeIcon size="3x" icon={faArrowRight} />
                    </a>
                  ) : null}
                  {/* <% } %> */}
                </span>
              </center>
            </div>
          </div>

          {/** Menu Bar */}
          <div className="small-12 medium-8 large-8 story_form">
            <ClickSelection
              storyId={this.props.match.params.storyId}
              feedId={this.state.feedId}
              type={this.state.type}
            />
            <div id="story_form">
              <center>
                {this.state.image !== {} ? (
                  <img
                    width="200px"
                    height="200px"
                    src={this.state.image.art}
                  />
                ) : (
                  <p
                    className="none"
                    style={{ margin: "30px 100px", padding: "50px 0" }}
                  >
                    <b>No Artwork</b>
                  </p>
                )}
              </center>
              <label className="update_label">Story Title:</label>
              <input
                placeholder="Story Title"
                style={{ width: "60%", marginBottom: "25px" }}
                className="box_2"
                name="title"
                value={this.state.title}
                onChange={this.handleChangeTitle}
              />
              <label className="update_label">Keywords:</label>
              <input
                placeholder="Keywords"
                style={{ width: "60%", marginBottom: "25px" }}
                className="box_2"
                name="title"
                value={this.state.keywords}
                onChange={this.handleChangeKeywords}
              />
              <label className="update_label">Summary:</label>
              <textarea
                className="box_2"
                name="summary"
                value={this.state.summary}
                onChange={this.handleChangeTextArea}
                style={{ marginBottom: "35px" }}
                rows={4}
              />
              <label style={{ marginBottom: "unset" }} className="update_label">
                Author:&nbsp;
                {this.state.author !== "" ? (
                  <p
                    style={{
                      margin: "-22px 100px",
                      color: "#00aa9f",
                      fontWeight: "700"
                    }}
                    className="none_no_margin"
                  >
                    {this.state.author}
                  </p>
                ) : (
                  <p
                    style={{
                      margin: "-22px 100px",
                      color: "#00aa9f",
                      fontWeight: "700"
                    }}
                    className="none_no_margin"
                  >
                    None
                  </p>
                )}
              </label>
              <a
                style={{ marginLeft: "-10px" }}
                onClick={this.handleClickFindAuthors("addAuthor")}
              >
                <FontAwesomeIcon
                  className="size"
                  style={{ color: "green" }}
                  icon={faPlusSquare}
                />
              </a>
              <br /> <br />
              <label className="update_label" style={{ marginBottom: "0" }}>
                Projects Attached :
              </label>
              {this.state.projects.length > 0 ? (
                this.state.projects.map(project => (
                  <span
                    key={project.id}
                    style={{ color: "#00aa9f", fontWeight: "700" }}
                  >
                    {project.name} project
                    {this.state.projects.length > 1 ? (
                      <a
                        style={{ color: "red" }}
                        onClick={this.handleRemoveProject(
                          "removeProject",
                          project.id,
                          project.name
                        )}
                      >
                        <FontAwesomeIcon
                          className="size"
                          icon={faMinusSquare}
                        />
                      </a>
                    ) : null}
                  </span>
                ))
              ) : (
                <p className="none_no_margin">None</p>
              )}
              <br />
              <a
                style={{ marginLeft: "-10px" }}
                onClick={this.handleClickButton("addProject")}
              >
                <FontAwesomeIcon
                  className="size"
                  style={{ color: "green" }}
                  icon={faPlusSquare}
                />
              </a>
              <label className="update_label" style={{ marginTop: "20px" }}>
                Edit Color Scheme:
              </label>
              <span>
                <FontAwesomeIcon
                  className=" fa-5x"
                  style={{ color: this.state.colors.topColor }}
                  icon={faCircle}
                  //   size="xs"
                />
              </span>
              <span style={{ marginLeft: "-30px" }}>
                <FontAwesomeIcon
                  className="fa-5x"
                  style={{ color: this.state.colors.bottomColor }}
                  icon={faCircle}
                  //   size="xs"
                />
              </span>
              <br />
              <a
                onClick={this.handleClickButton("editColor")}
                className="preview_2"
              >
                Edit Color
              </a>
              <br />
              <a
                onClick={this.handleClickButton("defaultColor")}
                className="preview_2"
              >
                Default Colors
              </a>
              <br />
              <br />
              <a
                onClick={this.submitStoryDetails}
                href="#"
                id="submit_story"
                className="preview_2"
              >
                Save Changes
              </a>
              <br />
              {Object.keys(this.state.image).length > 0 ? (
                <a
                  onClick={this.setStoryArt("chooseArtOption", "change")}
                  id="change_image"
                  className="preview_2"
                >
                  Story Artwork&nbsp;
                  <FontAwesomeIcon
                    className="fa-5x"
                    style={{ color: "#cca3b2", fontSize: "1.5rem" }}
                    icon={faCamera}
                  />
                </a>
              ) : (
                <a
                  onClick={this.setStoryArt("chooseArtOption", "new")}
                  id="change_image"
                  className="preview_2"
                >
                  New Story Artwork&nbsp;
                  <FontAwesomeIcon
                    className="fa-5x"
                    style={{ color: "#cca3b2", fontSize: "1.5rem" }}
                    icon={faCamera}
                  />
                </a>
              )}
              <br />
              {this.state.type === type.STORY_TYPE.episodes ||
              this.state.type === type.STORY_TYPE.chat_group_episode ||
              this.state.type === type.STORY_TYPE.chat_single_episode ? (
                <a
                  onClick={this.handleClickEvent("episode")}
                  className="preview_2"
                >
                  View Episodes
                </a>
              ) : (
                <a
                  onClick={this.handleSendToStoryItem("storyitem")}
                  className="preview_2"
                >
                  Add Story Item
                </a>
              )}
              <br />
              {this.state.type === type.STORY_TYPE.chat_single ||
              this.state.type === type.STORY_TYPE.chat_single_episode ? (
                this.state.incoming === "" || this.state.outgoing === "" ? (
                  <a
                    onClick={this.handleClickButton("selectMembers")}
                    className="preview_2"
                  >
                    Add Members&nbsp;&nbsp;
                    <FontAwesomeIcon
                      className="fa-5x"
                      style={{ color: "#cca3b2", fontSize: "1.5rem" }}
                      icon={faIdBadge}
                      //   size="xs"
                    />
                  </a>
                ) : (
                  <a
                    onClick={this.handleClickButton("selectOrder")}
                    className="preview_2"
                  >
                    Select Order of Chat&nbsp;&nbsp;
                    <FontAwesomeIcon
                      className="fa-5x"
                      style={{ color: "#cca3b2", fontSize: "1.5rem" }}
                      icon={faSort}
                      //   size="xs"
                    />
                  </a>
                )
              ) : null}
              <br />
              <br />
              <span>
                <button
                  type="button"
                  id="btnCancel"
                  className="preview_2"
                  style={{ color: "#a46580", fontWeight: 700 }}
                  onClick={this.handleReturnButton()}
                >
                  Back
                </button>
              </span>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default StoryPage;
