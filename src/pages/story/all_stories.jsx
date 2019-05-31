import React, { Component } from "react";
import history from "../../history";
import Menu from "../../components/extra/menu";
import { parseSettings as config } from "../../js/serverSettings";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import Parse from "parse";
import TopHeader from "../../components/cards/header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Loader from "../../components/extra/loader";
import type from "../../js/type";
import ButtonCreate from "../../components/extra/buttonCreation";
import ItemTypeDisplayButton from "../../components/extra/itemTypeDisplay";
import ItemDisplayIndication from "../../components/extra/itemDisplayIndication";

Parse.initialize(config.appId);
Parse.serverURL = config.url;

class AllStoriesPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      stories: [],
      episodes: [],
      noArtStories: [],
      combined: [],
      loading: true,
      mask: "block"
    };
  }

  handleClickEvent(destination, packId, projectId) {
    let url = "/" + destination + "/" + packId + "/" + projectId;
    return function() {
      history.push({
        pathname: url,
        search: ""
      });
    };
  }

  async componentDidMount() {
    let id = this.props.match.params.projectId;
    var currentUser = Parse.User.current();

    if (currentUser) {
      this.setState({
        loading: true,
        mask: "block"
      });

      const response = await Parse.Cloud.run("getStories", {
        admin: currentUser.id,
        projectId: id
      });

      let storyfeed = {};
      storyfeed = await response.data;

      this.setState({
        stories: storyfeed.stories,
        episodes: storyfeed.episodes,
        combined: storyfeed.combined,
        noArtStories: storyfeed.noArtStories,
        loading: false,
        mask: "none"
      });
    } else {
      history.push("/");
    }
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
            <b>All Stories</b>
          </span>
          {/** Menu Bar */}
          <div className="medium-3 large-3 login_card cell">
            <Menu projectId={this.props.match.params.projectId} />
          </div>

          {/** Menu Bar */}
          <div className="small-12 medium-3 large-3 cell icons">
            <div className="create_new">Create New</div>

            <ButtonCreate
              name={"Story"}
              destination={"story"}
              project={this.props.match.params.projectId}
            />
          </div>
          <div className="medium-3 large-3 cell icons">
            <div className="create_new">Story Type</div>
            <ItemTypeDisplayButton color="#ffb12f" name="SHORT STORY" />
            <ItemTypeDisplayButton color="#28ff7e" name="STORY" />
            <ItemTypeDisplayButton color="#203f80" name="JOKES" />
            <ItemTypeDisplayButton color="#3f7fe6" name="QUOTES" />
            <ItemTypeDisplayButton color="#e83b71" name="FACTS" />
          </div>
          <div className="medium-3 large-3 cell icons">
            <div className="create_new">Story Type</div>
            <ItemTypeDisplayButton color="#b28bc0" name="HISTORY" />
            <ItemTypeDisplayButton color="#f50404" name="NEWS" />
            <ItemTypeDisplayButton color="#b6ff11" name="EPISODES" />
            <ItemTypeDisplayButton color="#81fdd1" name="CHAT EPISODES" />
            <ItemTypeDisplayButton color="#7b0a61" name="CHATS" />
          </div>

          {this.state.stories.map(story =>
            this.state.combined.map(combine =>
              story.id === combine.story ? (
                <div
                  key={story.id}
                  className="medium-3 large-3 cell card-zoom icons"
                >
                  {story.type === type.STORY_TYPE.short_stories ? (
                    <ItemDisplayIndication color="#ffb12f" />
                  ) : null}
                  {story.type === type.STORY_TYPE.story ? (
                    <ItemDisplayIndication color="#28ff7e" />
                  ) : null}
                  {story.type === type.STORY_TYPE.facts ? (
                    <ItemDisplayIndication color="#203f80" />
                  ) : null}
                  {story.type === type.STORY_TYPE.quotes ? (
                    <ItemDisplayIndication color="#3f7fe6" />
                  ) : null}
                  {story.type === type.STORY_TYPE.news ? (
                    <ItemDisplayIndication color="#f50404" />
                  ) : null}
                  {story.type === type.STORY_TYPE.history ? (
                    <ItemDisplayIndication color="#b28bc0" />
                  ) : null}
                  {story.type === type.STORY_TYPE.jokes ? (
                    <ItemDisplayIndication color="#203f80" />
                  ) : null}
                  {story.type === type.STORY_TYPE.episodes ? (
                    <ItemDisplayIndication color="#b6ff11" />
                  ) : null}
                  {story.type === type.STORY_TYPE.chat_single ||
                  story.type === type.STORY_TYPE.chat_group ? (
                    <ItemDisplayIndication color="#7b0a61" />
                  ) : null}
                  {story.type === type.STORY_TYPE.chat_group_episode ||
                  story.type === type.STORY_TYPE.chat_single_episode ? (
                    <ItemDisplayIndication color="#81fdd1" />
                  ) : null}

                  <a
                    onClick={this.handleClickEvent(
                      "story",
                      story.id,
                      this.props.match.params.projectId
                    )}
                  >
                    <center>
                      <img
                        className="btn_pack_icon"
                        src={combine.image}
                        style={{ height: "200px", width: "250px" }}
                      />
                    </center>
                    <div className="story_title truncate_story_title">
                      {story.title}
                    </div>

                    <div className="story_summary truncate_summary">
                      {story.summary}
                    </div>
                  </a>
                </div>
              ) : null
            )
          )}
          {this.state.noArtStories.length > 0
            ? this.state.noArtStories.map(story => (
                <div
                  key={story.id}
                  className="medium-3 large-3 cell card-zoom icons"
                >
                  <a
                    onClick={this.handleClickEvent(
                      "story",
                      story.id,
                      this.props.match.params.projectId
                    )}
                  >
                    <center>
                      <p className="none">
                        <b>No Artwork</b>
                      </p>
                    </center>
                    <div className="story_title truncate_story_title">
                      {story.title}
                    </div>

                    <div className="story_summary truncate_summary">
                      {story.summary}
                    </div>
                  </a>
                </div>
              ))
            : null}
        </div>
      </>
    );
  }
}

export default AllStoriesPage;
