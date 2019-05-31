import React, { Component } from "react";
import logo from "../../logo.svg";
import Parse from "parse";
import TopHeader from "../../components/cards/header";
import history from "../../history";
import Loader from "../../components/extra/loader";
import { parseSettings as config } from "../../js/serverSettings";
import "../../App.css";
import Menu from "../../components/extra/normalMenu";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ItemDisplayIndication from "../../components/extra/itemDisplayIndication";

Parse.initialize(config.appId);
Parse.serverURL = config.url;

class CreatorHome extends Component {
  constructor(props) {
    super(props);

    this.state = {
      artworks: [],
      stories: [],
      noArtStories: [],
      packs: [],
      userId: "",
      loading: true,
      mask: "block"
    };
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

  handleClickEvent(destination, itemId) {
    let url = "/" + destination + "/" + itemId;
    return function() {
      history.push({
        pathname: url,
        search: ""
      });
    };
  }

  async componentDidMount() {
    let currentUser = Parse.User.current();
    if (currentUser) {
      this.setState({
        loading: true,
        mask: "block"
      });

      const response = await Parse.Cloud.run("getNormalHomeFeed", {
        admin: currentUser.id
      });

      let homefeed = {};

      homefeed = await response.data;

      this.setState({
        artworks: homefeed.artStories,
        noArtStories: homefeed.noArtStories,
        stories: homefeed.stories,
        packs: homefeed.packs,
        loading: false,
        mask: "none",
        userId: currentUser.id
      });
    } else {
      history.push("/");
    }
  }

  render() {
    return (
      <div className="App background">
        <div id="pageMask" style={{ display: this.state.mask }} />
        <Loader loading={this.state.loading} />
        <div
          className="grid-x grid-padding-x align-left"
          style={{ margin: "50px" }}
        >
          <TopHeader />
        </div>
        <div
          style={{ marginTop: "100px" }}
          className="grid-x grid-padding-x align-spaced"
        >
          <div
            style={{ marginLeft: "30px" }}
            className="small-12 medium-12 large-12 welcome_post"
          >
            <b>Welcome to Publisher</b>
          </div>
          <div className="medium-3 large-3 login_card cell">
            <Menu userId={this.state.userId} />
          </div>
          <div className="small-12 medium-3 large-3 cell icons">
            <div className="create_new">Create New</div>
            <button
              className="create_button"
              onClick={this.handleClickButton("normalPack")}
            >
              <p className="title">
                <FontAwesomeIcon className="size" icon={faCircle} />
                Pack
              </p>
            </button>
            <button
              onClick={this.handleClickButton("normalStory")}
              className="create_button"
            >
              <p className="title">
                <FontAwesomeIcon className="size" icon={faCircle} />
                Story
              </p>
            </button>
          </div>
          <div className="medium-3 large-3 cell icons">
            <div className="create_new">Pack Type</div>
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
                &nbsp; STORY ITEM
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
                  style={{ color: "#28ff7e" }}
                  icon={faCircle}
                />{" "}
                &nbsp; PACK ITEM
              </p>
            </button>
          </div>
          {this.state.stories.length > 0
            ? this.state.stories.map(story =>
                this.state.artworks.map(artwork =>
                  story.id === artwork.story ? (
                    <a
                      key={story.id}
                      className="medium-3 large-3 cell card-zoom icons"
                      onClick={this.handleClickEvent("normalStory", story.id)}
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
            : null}

          {this.state.noArtStories.length > 0
            ? this.state.noArtStories.map(story => (
                <a
                  key={story.id}
                  className="medium-3 large-3 cell card-zoom icons"
                  onClick={this.handleClickEvent("normalStory", story.id)}
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

          {this.state.packs.length > 0 ? (
            this.state.packs.map(pack => (
              <a
                key={pack.id}
                className="medium-3 large-3 cell card-zoom icons "
                onClick={this.handleClickEvent("normalPacks", pack.id)}
              >
                <ItemDisplayIndication color="#28ff7e" />
                {pack.art !== "" ? (
                  <center>
                    <img
                      className="pack_artwork"
                      src={pack.art}
                      style={{ height: "250px" }}
                    />
                  </center>
                ) : (
                  <center>
                    <p className="none">
                      <b>No Artwork</b>
                    </p>
                  </center>
                )}
                <div className="name_tag" style={{ position: "unset" }}>
                  <p className="pack_name_text">{pack.name}</p>
                </div>
              </a>
            ))
          ) : (
            <p>NO PACKS</p>
          )}
        </div>
      </div>
    );
  }
}

export default CreatorHome;
