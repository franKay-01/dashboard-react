import React, { Component } from "react";
import history from "../../history";
import { parseSettings as config } from "../../js/serverSettings";
import Parse from "parse";
import TopHeader from "../../components/cards/header";
import Loader from "../../components/extra/loader";
import ItemDisplayIndication from "../../components/extra/itemDisplayIndication";

Parse.initialize(config.appId);
Parse.serverURL = config.url;

class ReviewStories extends Component {
  constructor(props) {
    super(props);

    this.state = {
      stories: [],
      artworks: [],
      noArtStories: [],
      loading: true,
      mask: "block"
    };
  }

  async componentDidMount() {
    var currentUser = Parse.User.current();

    if (currentUser) {
      this.setState({
        loading: true,
        mask: "block"
      });

      const response = await Parse.Cloud.run("getReviewStories");

      let storyfeed = {};
      if (response.responseCode === 0) {
        storyfeed = await response.data;

        this.setState({
          stories: storyfeed.stories,
          artworks: storyfeed.artStories,
          noArtStories: storyfeed.noArtStories,
          loading: false,
          mask: "none"
        });
      }
    } else {
      history.push("/");
    }
  }

  handleReturnButton() {
    return function() {
      history.goBack();
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

  render() {
    console.log(JSON.stringify(this.state.packs));
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
            <b>All Stories In Review</b>
          </span>
          <div className="small-12 medium-3 large-3 cell login_card">
            <div className="card_head_position">
              <div className="stats">Dashboard</div>
              <div onClick={this.handleReturnButton()} className="_stickers">
                Go Back
              </div>
            </div>
          </div>
          {this.state.stories.length > 0 ? (
            this.state.stories.map(story =>
              this.state.artworks.map(artwork =>
                story.id === artwork.story ? (
                  <a
                    key={story.id}
                    className="medium-3 large-3 cell card-zoom icons"
                    onClick={this.handleClickEvent("reviewStory", story.id)}
                  >
                    <ItemDisplayIndication color="#ffb12f" />
                    <center>
                      <img
                        className="btn_pack_icon"
                        src={artwork.image}
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
                ) : null
              )
            )
          ) : (
            <div className="medium-3 large-3 cell card-zoom icons ">
              <p className="none" style={{ margin: "150px 80px" }}>
                <b>No Stories</b>
              </p>
            </div>
          )}

          {this.state.noArtStories.length > 0
            ? this.state.noArtStories.map(story => (
                <a
                  key={story.id}
                  className="medium-3 large-3 cell card-zoom icons"
                  onClick={this.handleClickEvent("reviewStory", story.id)}
                >
                  <ItemDisplayIndication color="#ffb12f" />
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
              ))
            : null}
        </div>
      </>
    );
  }
}

export default ReviewStories;
