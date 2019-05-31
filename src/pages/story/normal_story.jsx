import React, { Component } from "react";
import history from "../../history";
import Parse from "parse";
import "../../App.css";
import "../../css/myStyle.css";
import TopHeader from "../../components/cards/header";
import Menu from "../../components/extra/normalMenu";
import { parseSettings as config } from "../../js/serverSettings";
import {
  faCircle,
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
      status: 0,
      colors: {},
      mask: "none",
      incoming: "",
      userId: "",
      outgoing: "",
      reports: false,
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
        status: storyfeed.story.status,
        next: storyfeed.next,
        previous: storyfeed.previous,
        image: storyfeed.art,
        userId: currentUser.id,
        type: storyfeed.story.type,
        reports: storyfeed.reports,
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
    let storyId = this.props.match.params.storyId;
    let url = "/" + destination + "/" + storyId;
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

  handleSubmitReview(item) {
    let storyId = this.props.match.params.storyId;
    let name = this.state.title;
    let itemType = "Story";
    return function() {
      history.push({
        pathname: "/card/create",
        search: "",
        state: {
          element: item,
          itemId: storyId,
          name: name,
          itemType: itemType
        }
      });
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
              <b>Story Details</b>
            )}
          </span>
          {/** Menu Bar */}
          <div className="medium-3 large-3 cell">
            <div className="login_card">
              <Menu userId={this.state.userId} />
              <center style={{ marginTop: "60px" }}>
                <span style={{ paddingRight: "125px" }}>
                  {/* <% if (previous !== ""){ %> */}
                  {this.state.next !== "" ? (
                    <a
                      style={{ color: "white" }}
                      href={"/normalStory/" + this.state.previous}
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
                      style={{ color: "white" }}
                      href={"/normalStory/" + this.state.next}
                    >
                      <FontAwesomeIcon size="3x" icon={faArrowRight} />
                    </a>
                  ) : null}
                  {/* <% } %> */}
                </span>
              </center>
            </div>

            <div className="icons">
              <div className="create_new">
                Publishing
                {this.state.status === type.PACK_STATUS.approved ? (
                  <p style={{ marginTop: "-25px" }}>
                    <FontAwesomeIcon
                      className="size"
                      style={{
                        color: "#2fff2f",
                        float: "right"
                      }}
                      icon={faCircle}
                    />
                  </p>
                ) : null}
                {this.state.status === type.PACK_STATUS.pending ? (
                  <p style={{ marginTop: "-25px" }}>
                    <FontAwesomeIcon
                      className="size"
                      style={{
                        color: "#ffb12f",
                        float: "right"
                      }}
                      icon={faCircle}
                    />
                  </p>
                ) : null}
                {this.state.status === type.PACK_STATUS.review ? (
                  <p style={{ marginTop: "-25px" }}>
                    <FontAwesomeIcon
                      className="size"
                      style={{
                        color: "#2fc2ff",
                        float: "right"
                      }}
                      icon={faCircle}
                    />
                  </p>
                ) : null}
                {this.state.status === type.PACK_STATUS.rejected ? (
                  <p style={{ marginTop: "-25px" }}>
                    <FontAwesomeIcon
                      className="size"
                      style={{
                        color: "#f90707",
                        float: "right"
                      }}
                      icon={faCircle}
                    />
                  </p>
                ) : null}
              </div>
              {this.state.status === type.PACK_STATUS.approved ? (
                this.state.published === false ? (
                  <button
                    className="create_button"
                    // onClick={this.handleClickButton("editPack")}
                  >
                    <p className="title">
                      <FontAwesomeIcon className="size" icon={faCircle} />
                      &nbsp;PUBLISH
                    </p>
                  </button>
                ) : (
                  <button
                    className="create_button"
                    // onClick={this.handleClickButton("editPack")}
                  >
                    <p className="title">
                      <FontAwesomeIcon className="size" icon={faCircle} />
                      &nbsp;UNPUBLISH
                    </p>
                  </button>
                )
              ) : this.state.status === type.PACK_STATUS.review ? (
                <button className="create_button">
                  <p className="title">
                    <FontAwesomeIcon className="size" icon={faCircle} />
                    &nbsp;Wait For Feedback
                  </p>
                </button>
              ) : (
                <button
                  className="create_button"
                  onClick={this.handleSubmitReview("submitForReview")}
                >
                  <p className="title">
                    <FontAwesomeIcon className="size" icon={faCircle} />
                    &nbsp;Submit For Review
                  </p>
                </button>
              )}
              <button
                className="create_button"
                style={{ backgroundColor: "#f1f1f1" }}
                disabled
              >
                <p className="title button_font" style={{ color: "black" }}>
                  &nbsp;{" "}
                  <FontAwesomeIcon
                    className=" display_icons"
                    style={{ color: "#ffb12f" }}
                    icon={faCircle}
                  />
                  &nbsp; PENDING
                </p>
              </button>
              <button
                className="create_button"
                style={{ backgroundColor: "#f1f1f1" }}
                disabled
              >
                <p className="title button_font" style={{ color: "black" }}>
                  &nbsp;{" "}
                  <FontAwesomeIcon
                    className=" display_icons"
                    style={{ color: "#2fc2ff" }}
                    icon={faCircle}
                  />
                  &nbsp; IN REVIEW
                </p>
              </button>
              <button
                className="create_button"
                style={{ backgroundColor: "#f1f1f1" }}
                disabled
              >
                <p className="title button_font" style={{ color: "black" }}>
                  &nbsp;{" "}
                  <FontAwesomeIcon
                    className=" display_icons"
                    style={{ color: "#2fff2f" }}
                    icon={faCircle}
                  />
                  &nbsp; APPROVED
                </p>
              </button>
              <button
                className="create_button"
                style={{ backgroundColor: "#f1f1f1" }}
                disabled
              >
                <p className="title button_font" style={{ color: "black" }}>
                  &nbsp;{" "}
                  <FontAwesomeIcon
                    className=" display_icons"
                    style={{ color: "#f90707" }}
                    icon={faCircle}
                  />
                  &nbsp; REJECTED
                </p>
              </button>
              {/* {this.state.feedId !== "" ? (
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
              ) : null} */}
            </div>
          </div>

          {/** Menu Bar */}
          <div className="small-12 medium-8 large-8 story_form">
            <ClickSelection
              storyId={this.props.match.params.storyId}
              feedId={this.state.feedId}
              type={this.state.type}
              reports={this.state.reports}
            />

            <div id="story_form">
              <center>
                {this.state.image !== "" ? (
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
