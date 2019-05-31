import React, { Component } from "react";
import history from "../../history";
import Parse from "parse";
import "../../App.css";
import "../../css/myStyle.css";
import TopHeader from "../../components/cards/header";
import ViewAll from "../../components/extra/viewAll";
import { parseSettings as config } from "../../js/serverSettings";
import CreationCards from "../../components/cards/createHomeCards";
import GroupCards from "../../components/cards/groupCards";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type from "../../js/type";

Parse.initialize(config.appId);
Parse.serverURL = config.url;

class HomePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      projectId: [],
      packs: [],
      stories: [],
      adverts: [],
      projects: [],
      jokes: [],
      quotes: [],
      histories: [],
      news: [],
      facts: [],
      episodes: [],
      latestStoryTitle: "",
      latestStorySummary: "",
      latestStoryImage: "",
      latestSticker: "",
      latestStickerName: "",
      latestStickerDescription: "",
      categoryLength: 0,
      packLength: 0,
      stickerLength: 0,
      storyLength: 0,
      projectLength: 0
    };
  }

  handleStoryOfWeek(destination) {
    let currentProject = this.props.match.params.projectId;

    return function() {
      history.push({
        pathname: "/card/create",
        search: "",
        state: {
          element: destination,
          projectId: currentProject,
          source: "story"
        }
      });
    };
  }

  handleStickerOfWeek(destination) {
    let currentProject = this.props.match.params.projectId;

    return function() {
      history.push({
        pathname: "/card/create",
        search: "",
        state: {
          element: destination,
          projectId: currentProject,
          source: "sticker"
        }
      });
    };
  }

  async componentDidMount() {
    let id = this.props.match.params.projectId;
    let currentUser = Parse.User.current();
    if (currentUser) {
      const response = await Parse.Cloud.run("getHomeFeed", {
        admin: currentUser.id,
        projectId: id
      });
      let homefeed = {};
      homefeed = await response.data;

      this.setState({
        packs: homefeed.packInfo,
        stories: homefeed.storiesInfo,
        adverts: homefeed.advertInfo,
        projects: homefeed.projectInfo,
        jokes: homefeed.jokeInfo,
        quotes: homefeed.quoteInfo,
        news: homefeed.newsInfo,
        histories: homefeed.historyInfo,
        facts: homefeed.factInfo,
        episodes: homefeed.episodeInfo,
        latestStoryTitle: homefeed.latestStoryTitle,
        latestStorySummary: homefeed.latestStorySummary,
        latestStoryImage: homefeed.latestStorySticker,
        latestSticker: homefeed.latestSticker,
        latestStickerName: homefeed.latestStickerName,
        latestStickerDescription: homefeed.latestStickerDescription,
        categoryLength: homefeed.categoryLength,
        packLength: homefeed.packLength,
        stickerLength: homefeed.stickerLength,
        storyLength: homefeed.storyLength,
        projectLength: homefeed.projectLength
      });
    } else {
      history.push("/");
    }
  }

  render() {
    return (
      <div className="App">
        <div
          className="grid-x grid-padding-x align-left"
          style={{ margin: "50px" }}
        >
          <TopHeader />
        </div>

        <div className="grid-x grid-padding-x align-spaced">
          <div className="medium-3 large-3 cell login_card">
            <div className="card_head_position">
              <div className="stats">Stats</div>
              <div className="_stickers">
                {this.state.stickerLength} Stickers
              </div>
              <div className="_stickers">{this.state.packLength} Packs</div>
              <div className="_stickers">
                {this.state.categoryLength} Categories
              </div>
              <div className="_stickers">
                {this.state.projectLength} Projects
              </div>
              <div className="_stickers">{this.state.storyLength} Stories</div>
            </div>
          </div>

          {/** Create New Cards */}
          <CreationCards projectId={this.props.match.params.projectId} />
          {/** End of Card */}

          {/** Start of Pack Cards */}
          <div className="medium-3 large-3 cell icons">
            <div className="create_new">Sticker Packs</div>
            <div className="card_head_position">
              <div className="recent_labels">Recent Sticker Packs</div>
              {this.state.packs.map(pack => (
                <GroupCards
                  key={pack.id}
                  name={pack.name}
                  destination="pack"
                  itemId={pack.id}
                  projectId={this.props.match.params.projectId}
                />
              ))}
              <ViewAll
                item={this.state.packs}
                projectId={this.props.match.params.projectId}
                url="/packs/"
              />
            </div>
            <a href="/reviews">
              <button className="create_button review_tab_bottom">
                <p className="title">
                  &nbsp; <FontAwesomeIcon className="size" icon={faCircle} />
                  &nbsp;REVIEWS
                </p>
              </button>
            </a>
          </div>
          {/** Start of Pack Cards */}

          {/** Start of Story Cards */}
          <div className="medium-3 large-3 cell icons">
            <div className="create_new">Stories</div>
            <div className="card_head_position">
              <div className="recent_labels">Recent Stories</div>

              {this.state.stories.map(story =>
                story.type === type.STORY_TYPE.story ||
                story.type === type.STORY_TYPE.short_stories ||
                story.type === type.STORY_TYPE.chat_group ||
                story.type === type.STORY_TYPE.chat_single ? (
                  <GroupCards
                    key={story.id}
                    name={story.name}
                    itemId={story.id}
                    destination="story"
                  />
                ) : null
              )}
              <ViewAll
                item={this.state.stories}
                projectId={this.props.match.params.projectId}
                url="/stories/"
              />
            </div>
            <a href="/reviews">
              <button className="create_button review_tab_bottom">
                <p className="title">
                  &nbsp; <FontAwesomeIcon className="size" icon={faCircle} />
                  &nbsp;REVIEWS
                </p>
              </button>
            </a>
          </div>
          {/** Start of Story Cards */}

          {/** Start of Advert Cards */}
          <div className="medium-3 large-3 cell icons">
            <div className="create_new">Adverts</div>
            <div className="card_head_position">
              <div className="recent_labels">Recent Adverts</div>
              {this.state.adverts.length > 0 ? (
                this.state.adverts.map(advert => (
                  <GroupCards
                    key={advert.id}
                    name={advert.name}
                    itemId={advert.id}
                    destination="advert"
                  />
                ))
              ) : (
                <p className="none_no_margin">None</p>
              )}
              <ViewAll item={this.state.adverts} url="/adverts/" />
            </div>
          </div>
          {/** Start of Advert Cards */}

          {/** Start of Project Cards */}
          <div className="medium-3 large-3 cell icons">
            <div className="create_new">Projects</div>
            <div className="card_head_position">
              <div className="recent_labels">Recent Projects</div>
              {this.state.projects.length > 0 ? (
                this.state.projects.map(project => (
                  <GroupCards
                    key={project.id}
                    name={project.name}
                    itemId={project.id}
                    destination="project"
                  />
                ))
              ) : (
                <p className="none_no_margin">None</p>
              )}
              <ViewAll item={this.state.projects} url="/projects/" />
            </div>
          </div>
          {/** Start of Project Cards */}

          {/** Start of Jokes & Quotes Cards */}
          <div className="medium-3 large-3 cell icons">
            <div className="create_new">Jokes</div>
            <div className="card_head_position" style={{ marginTop: "0" }}>
              <div className="recent_labels">Recent Jokes</div>
              {this.state.jokes.length > 0 ? (
                this.state.jokes.map(joke => (
                  <GroupCards
                    key={joke.id}
                    name={joke.name}
                    itemId={joke.id}
                    destination="story"
                  />
                ))
              ) : (
                <p className="none_no_margin">None</p>
              )}
              <ViewAll item={this.state.jokes} url="/projects/" />
            </div>
            <div className="create_new" style={{ marginTop: "55px" }}>
              Quotes
            </div>
            <div className="card_head_position" style={{ marginTop: "0" }}>
              <div className="recent_labels">Recent Quotes</div>
              {this.state.quotes.length > 0 ? (
                this.state.quotes.map(quote => (
                  <GroupCards
                    key={quote.id}
                    name={quote.name}
                    itemId={quote.id}
                    destination="story"
                  />
                ))
              ) : (
                <p className="none_no_margin">None</p>
              )}
              <ViewAll item={this.state.quotes} url="/projects/" />
            </div>
          </div>
          {/** Start of Jokes & Quotes Cards */}

          {/** Start of News & History Cards */}
          <div className="medium-3 large-3 cell icons">
            <div className="create_new">News</div>
            <div className="card_head_position" style={{ marginTop: "0" }}>
              <div className="recent_labels">Recent News</div>

              {this.state.news.length > 0 ? (
                this.state.news.map(newsItem => (
                  <GroupCards
                    key={newsItem.id}
                    name={newsItem.name}
                    itemId={newsItem.id}
                    destination="story"
                  />
                ))
              ) : (
                <p className="none_no_margin">None</p>
              )}
              <ViewAll item={this.state.news} url="/projects/" />
            </div>
            <div className="create_new" style={{ marginTop: "55px" }}>
              History
            </div>
            <div className="card_head_position" style={{ marginTop: "0" }}>
              <div className="recent_labels">Recent History</div>
              {this.state.histories.length > 0 ? (
                this.state.histories.map(history => (
                  <GroupCards
                    key={history.id}
                    name={history.name}
                    itemId={history.id}
                    destination="story"
                  />
                ))
              ) : (
                <p className="none_no_margin">None</p>
              )}
              <ViewAll item={this.state.histories} url="/projects/" />
            </div>
          </div>
          {/** Start of Jokes & Quotes Cards */}

          {/** */}
          <div className="medium-3 large-3 cell icons">
            <div className="title_of_the_day">Story of the Week</div>
            {this.state.latestStoryTitle !== "" ? (
              <a
                className="_stickers_packs"
                onClick={this.handleStoryOfWeek("storyOfTheWeek")}
              >
                <center>
                  <img
                    src={this.state.latestStoryImage}
                    width="200px"
                    height="200px"
                  />
                </center>
                <div>
                  <div className="story_title truncate_story_title">
                    {this.state.latestStoryTitle}
                  </div>
                  <div className="story_summary truncate_summary">
                    {this.state.latestStorySummary}
                  </div>
                </div>
              </a>
            ) : (
              <a
                className="_stickers_packs"
                onClick={this.handleStoryOfWeek("storyOfTheWeek")}
              >
                <center>
                  <p className="none">
                    <b>No Story</b>
                  </p>
                </center>
                <div>
                  <p
                    className="none"
                    style={{ margin: "125px 80px auto", width: "100%" }}
                  >
                    <b>Click to Select</b>
                  </p>
                </div>
              </a>
            )}
          </div>
          {/** */}

          {/** */}
          <div className="medium-3 large-3 cell icons">
            <div className="title_of_the_day">Sticker of the Day</div>
            {this.state.latestSticker !== "" ? (
              <a
                className="_stickers_packs"
                onClick={this.handleStickerOfWeek("stickerOfTheWeek")}
              >
                <center>
                  <img
                    src={this.state.latestSticker}
                    width="200px"
                    height="200px"
                  />
                </center>

                <div
                  style={{ textAlign: "center" }}
                  className="story_title truncate_story_title"
                >
                  {this.state.latestStickerName}
                </div>
                <div className="story_summary truncate_summary">
                  {this.state.latestStickerDescription}
                </div>
              </a>
            ) : (
              <a
                className="_stickers_packs"
                onClick={this.handleStickerOfWeek("stickerOfTheWeek")}
              >
                <center>
                  <p className="none">
                    <b>No Sticker</b>
                  </p>
                </center>

                <p
                  className="none"
                  style={{ margin: "125px 80px auto", width: "100%" }}
                >
                  <b>Click to Select</b>
                </p>
              </a>
            )}
          </div>
          {/** */}
        </div>
      </div>
    );
  }
}

export default HomePage;
