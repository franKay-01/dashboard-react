import React, { Component } from "react";
import Parse from "parse";
import "../../App.css";
import "../../css/myStyle.css";
import TopHeader from "../../components/cards/header";
import Menu from "../../components/extra/menu";
import NormalMenu from "../../components/extra/normalMenu";
import Loader from "../../components/extra/loader";
import type from "../../js/type";
import StoryItemButtonCreation from "../../components/extra/storyItemButtonCreation";
import { parseSettings as config } from "../../js/serverSettings";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import history from "../../history";

Parse.initialize(config.appId);
Parse.serverURL = config.url;

class StoryItemPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      story: {},
      mainStoryId: "",
      userType: 0,
      members: [],
      mask: "none",
      loading: false
    };
  }

  async componentDidMount() {
    let id = this.props.match.params.projectId;
    let storyId = this.props.match.params.itemId;
    let source = this.props.match.params.source;
    let currentUser = Parse.User.current();
    let accountType = currentUser.get("type");

    if (currentUser) {
      this.setState({
        loading: true,
        mask: "block"
      });

      const response = await Parse.Cloud.run("getStoryItem", {
        admin: currentUser.id,
        projectId: id,
        storyId: storyId,
        source: source
      });

      let storyfeed = {};

      if (response.responseCode === 0) {
        storyfeed = await response.data;

        this.setState({
          story: storyfeed.story,
          members: storyfeed.members,
          userType: accountType,
          loading: false,
          mask: "none"
        });
      }
    }
  }

  handleReturnButton() {
    return function() {
      history.goBack();
    };
  }

  async handleCreateHtml() {
    var currentUser = Parse.User.current();
    let storyId = this.props.match.params.itemId;
    let projectId = this.props.match.params.projectId;
    let source = this.props.match.params.source;

    if (currentUser) {
      this.setState({
        loading: true,
        mask: "block"
      });

      const response = await Parse.Cloud.run("createHtml", {
        storyId: storyId
      });

      let storyfeed = {};
      if (response.responseCode === 0) {
        storyfeed = await response.data;
        let url =
          "/html/storyItem/" +
          source +
          "/" +
          storyId +
          "/" +
          storyfeed.storyId +
          "/" +
          projectId;
        history.push({
          pathname: url,
          search: ""
        });
      }
    }
  }

  handleClickEvent(storyId) {
    let projectId = this.props.match.params.projectId;
    let url = "/storyView/" + storyId + "/" + projectId;
    return function() {
      history.push({
        pathname: url,
        search: ""
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
            <b>{this.state.story.title} - Story Item Details</b>
          </span>
          <div className="medium-3 large-3 cell login_card">
            {this.state.userType === type.USER.normal ? (
              <NormalMenu userId={this.state.userId} />
            ) : (
              <Menu projectId={this.props.match.params.projectId} />
            )}
          </div>
          <div className="small-12 medium-3 large-3 cell icons">
            <div className="create_new">Create New</div>

            <button
              className="create_button"
              onClick={this.handleClickEvent(this.props.match.params.itemId)}
            >
              <p className="title">
                <FontAwesomeIcon className="size" icon={faCircle} />
                Show All
              </p>
            </button>

            {this.state.story.type === type.STORY_TYPE.episodes ||
            this.state.story.type === type.STORY_TYPE.chat_group_episode ||
            this.state.story.type === type.STORY_TYPE.chat_single_episode ? (
              <StoryItemButtonCreation
                name={"Edit Episode Details"}
                destination={"editEpisodes"}
                project={this.props.match.params.projectId}
                source={this.props.match.params.source}
                storyId={this.props.match.params.itemId}
              />
            ) : null}

            {this.state.story.type === type.STORY_TYPE.episodes ? (
              <a
                href={"/episodePreview/" + this.props.match.params.itemId}
                target="_blank"
              >
                <button className="create_button">
                  <p className="title">
                    <FontAwesomeIcon className="size" icon={faCircle} />
                    Preview Episode
                  </p>
                </button>
              </a>
            ) : null}

            {this.state.story.type === type.STORY_TYPE.chat_single_episode ? (
              <a
                href={"/storyPreview/" + this.props.match.params.itemId}
                target="_blank"
              >
                <button className="create_button">
                  <p className="title">
                    <FontAwesomeIcon className="size" icon={faCircle} />
                    Preview Episode
                  </p>
                </button>
              </a>
            ) : null}

            {this.state.story.type === type.STORY_TYPE.chat_group_episode ? (
              <a
                href={"/storyPreview/" + this.props.match.params.itemId}
                target="_blank"
              >
                <button className="create_button">
                  <p className="title">
                    <FontAwesomeIcon className="size" icon={faCircle} />
                    Preview Episode
                  </p>
                </button>
              </a>
            ) : null}
          </div>
          <div className="small-12 medium-3 large-3 cell icons">
            <div className="create_new">Create New</div>

            <StoryItemButtonCreation
              name={"Text"}
              destination={"storyitemform"}
              project={this.props.match.params.projectId}
              source={this.props.match.params.source}
              storyId={this.props.match.params.itemId}
              type={type.STORY_ITEM.text}
              storyType={this.state.story.type}
              members={this.state.members}
            />
            <StoryItemButtonCreation
              name={"Image"}
              destination={"storyitemimage"}
              project={this.props.match.params.projectId}
              source={this.props.match.params.source}
              storyId={this.props.match.params.itemId}
              type={type.STORY_ITEM.image}
              storyType={this.state.story.type}
              members={this.state.members}
            />
            <StoryItemButtonCreation
              name={"Quote"}
              destination={"storyitemform"}
              project={this.props.match.params.projectId}
              source={this.props.match.params.source}
              storyId={this.props.match.params.itemId}
              type={type.STORY_ITEM.quote}
              storyType={this.state.story.type}
              members={this.state.members}
            />
            <StoryItemButtonCreation
              name={"Italic"}
              destination={"storyitemform"}
              project={this.props.match.params.projectId}
              source={this.props.match.params.source}
              storyId={this.props.match.params.itemId}
              type={type.STORY_ITEM.italic}
              storyType={this.state.story.type}
              members={this.state.members}
            />
            <StoryItemButtonCreation
              name={"List"}
              destination={"storyitemlist"}
              project={this.props.match.params.projectId}
              source={this.props.match.params.source}
              storyId={this.props.match.params.itemId}
              type={type.STORY_ITEM.list}
              storyType={this.state.story.type}
            />
          </div>
          <div className="small-12 medium-3 large-3 cell icons">
            <div className="create_new">Create New</div>

            <StoryItemButtonCreation
              name={"Sticker"}
              destination={"storyitemsticker"}
              project={this.props.match.params.projectId}
              source={this.props.match.params.source}
              storyId={this.props.match.params.itemId}
              type={type.STORY_ITEM.sticker}
              storyType={this.state.story.type}
              members={this.state.members}
            />
            <StoryItemButtonCreation
              name={"Divider"}
              destination={"storyitemdivider"}
              project={this.props.match.params.projectId}
              source={this.props.match.params.source}
              storyId={this.props.match.params.itemId}
              type={type.STORY_ITEM.divider}
            />

            <StoryItemButtonCreation
              name={"Bold"}
              destination={"storyitemform"}
              project={this.props.match.params.projectId}
              source={this.props.match.params.source}
              storyId={this.props.match.params.itemId}
              type={type.STORY_ITEM.bold}
              storyType={this.state.story.type}
              members={this.state.members}
            />
            <StoryItemButtonCreation
              name={"Italic Bold"}
              destination={"storyitemform"}
              project={this.props.match.params.projectId}
              source={this.props.match.params.source}
              storyId={this.props.match.params.itemId}
              type={type.STORY_ITEM.italicBold}
              storyType={this.state.story.type}
              members={this.state.members}
            />

            <StoryItemButtonCreation
              name={"Heading"}
              destination={"storyitemheading"}
              project={this.props.match.params.projectId}
              source={this.props.match.params.source}
              storyId={this.props.match.params.itemId}
              type={type.STORY_ITEM.heading}
            />
          </div>
          <div className="small-12 medium-3 large-3 cell icons">
            <div className="create_new">Create New</div>

            <StoryItemButtonCreation
              name={"Side Note"}
              destination={"storyitemform"}
              project={this.props.match.params.projectId}
              source={this.props.match.params.source}
              storyId={this.props.match.params.itemId}
              type={type.STORY_ITEM.sideNote}
            />
            <StoryItemButtonCreation
              name={"Grey Area"}
              destination={"storyitemform"}
              project={this.props.match.params.projectId}
              source={this.props.match.params.source}
              storyId={this.props.match.params.itemId}
              type={type.STORY_ITEM.greyArea}
            />
            <StoryItemButtonCreation
              name={"Source"}
              destination={"storyitemsource"}
              project={this.props.match.params.projectId}
              source={this.props.match.params.source}
              storyId={this.props.match.params.itemId}
              type={type.STORY_ITEM.source}
            />
            <StoryItemButtonCreation
              name={"Link"}
              destination={"storyitemlink"}
              project={this.props.match.params.projectId}
              source={this.props.match.params.source}
              storyId={this.props.match.params.itemId}
              type={type.STORY_ITEM.link}
            />

            <StoryItemButtonCreation
              name={"Background Color"}
              destination={"storyitembgcolor"}
              project={this.props.match.params.projectId}
              source={this.props.match.params.source}
              storyId={this.props.match.params.itemId}
              type={type.STORY_ITEM.backgroundColor}
            />
          </div>
          <div className="small-12 medium-3 large-3 cell icons">
            <div className="create_new">Create New</div>
            <button
              className="create_button"
              style={{ backgroundColor: "green" }}
              onClick={() => this.handleCreateHtml()}
            >
              <p className="title">
                <FontAwesomeIcon className="size" icon={faCircle} />
                HTML
              </p>
            </button>
          </div>
        </div>
        <span className="medium-12 large-12">
          <button
            type="button"
            id="btnCancel"
            className="preview_2"
            style={{ color: "#a46580", fontWeight: 700, marginLeft: "50px" }}
            onClick={this.handleReturnButton()}
          >
            Back
          </button>
        </span>
      </>
    );
  }
}

export default StoryItemPage;
