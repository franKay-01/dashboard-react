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

class StoryItemHtmlPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      story: {},
      storyItemId: "",
      userId: "",
      members: [],
      show: "none",
      mask: "none",
      loading: false
    };
  }

  async componentDidMount() {
    let id = this.props.match.params.projectId;
    let storyId = this.props.match.params.itemId;
    let source = this.props.match.params.source;
    let storyItemId = this.props.match.params.storyItemId;
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
          userId: currentUser.id,
          userType: accountType,
          story: storyfeed.story,
          storyItemId: storyItemId,
          loading: false,
          mask: "none"
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
          </div>
          <div className="small-12 medium-3 large-3 cell icons">
            <div className="create_new">Create New</div>

            <StoryItemButtonCreation
              name={"Text"}
              destination={"htmlform"}
              project={this.props.match.params.projectId}
              source={this.props.match.params.source}
              storyId={this.props.match.params.itemId}
              type={type.STORY_ITEM.text}
              storyType={this.state.story.type}
              storyItemId={this.state.storyItemId}
            />

            <StoryItemButtonCreation
              name={"Italic"}
              destination={"htmlform"}
              project={this.props.match.params.projectId}
              source={this.props.match.params.source}
              storyId={this.props.match.params.itemId}
              type={type.STORY_ITEM.italic}
              storyType={this.state.story.type}
              storyItemId={this.state.storyItemId}
            />
            <StoryItemButtonCreation
              name={"Bold"}
              destination={"htmlform"}
              project={this.props.match.params.projectId}
              source={this.props.match.params.source}
              storyId={this.props.match.params.itemId}
              type={type.STORY_ITEM.bold}
              storyType={this.state.story.type}
              storyItemId={this.state.storyItemId}
            />
            <StoryItemButtonCreation
              name={"Italic Bold"}
              destination={"htmlform"}
              project={this.props.match.params.projectId}
              source={this.props.match.params.source}
              storyId={this.props.match.params.itemId}
              type={type.STORY_ITEM.italicBold}
              storyType={this.state.story.type}
              storyItemId={this.state.storyItemId}
            />
            <StoryItemButtonCreation
              name={"Color"}
              destination={"htmlformcolor"}
              project={this.props.match.params.projectId}
              source={this.props.match.params.source}
              storyId={this.props.match.params.itemId}
              type={type.STORY_ITEM.color}
              storyType={this.state.story.type}
              storyItemId={this.state.storyItemId}
            />
          </div>
          <span className="medium-12 large-12">
            <button
              type="button"
              id="btnCancel"
              className="preview_2"
              style={{ marginLeft: "90px", color: "#a46580", fontWeight: 700 }}
              onClick={this.handleReturnButton()}
            >
              Back
            </button>
          </span>
        </div>
      </>
    );
  }
}

export default StoryItemHtmlPage;
