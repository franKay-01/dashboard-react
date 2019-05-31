import React, { Component } from "react";
import history from "../../history";
import Menu from "../../components/extra/normalMenu";
import { parseSettings as config } from "../../js/serverSettings";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import Parse from "parse";
import TopHeader from "../../components/cards/header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Loader from "../../components/extra/loader";

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
      mask: "block",
      userId: ""
    };
  }

  handleClickEvent(destination, storyId) {
    let url = "/" + destination + "/" + storyId;
    return function() {
      history.push({
        pathname: url,
        search: ""
      });
    };
  }

  async componentDidMount() {
    var currentUser = Parse.User.current();

    if (currentUser) {
      this.setState({
        loading: true,
        mask: "block"
      });

      const response = await Parse.Cloud.run("getNormalStories", {
        admin: currentUser.id
      });

      let storyfeed = {};
      storyfeed = await response.data;

      this.setState({
        stories: storyfeed.stories,
        episodes: storyfeed.episodes,
        combined: storyfeed.combined,
        noArtStories: storyfeed.noArtStories,
        loading: false,
        mask: "none",
        userId: currentUser.id
      });
    } else {
      history.push("/");
    }
  }

  handleClickButton(item) {
    return function() {
      history.push({
        pathname: "/card/create",
        search: "",
        state: { element: item }
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
            <b>All Stories</b>
          </span>
          {/** Menu Bar */}
          <div className="medium-3 large-3 login_card cell">
            <Menu userId={this.state.userId} />
          </div>

          {/** Menu Bar */}
          <div className="small-12 medium-3 large-3 cell icons">
            <div className="create_new">Create New</div>

            <button
              onClick={this.handleClickButton("allNormalStories")}
              className="create_button"
            >
              <p className="title">
                <FontAwesomeIcon className="size" icon={faCircle} />
                Story
              </p>
            </button>
          </div>
          {this.state.stories.length > 0
            ? this.state.stories.map(story =>
                this.state.combined.map(combine =>
                  story.id === combine.story ? (
                    <div
                      key={story.id}
                      className="medium-3 large-3 cell card-zoom icons"
                    >
                      <a
                        onClick={this.handleClickEvent("normalStory", story.id)}
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
              )
            : null}
          {this.state.noArtStories.length > 0
            ? this.state.noArtStories.map(story => (
                <div
                  key={story.id}
                  className="medium-3 large-3 cell card-zoom icons"
                >
                  <a onClick={this.handleClickEvent("normalStory", story.id)}>
                    <center>
                      <p style={{ margin: "100px 80px" }} className="none">
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
