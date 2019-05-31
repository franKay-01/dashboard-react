import React, { Component } from "react";
import history from "../../history";
import Parse from "parse";
import "../../App.css";
import "../../css/myStyle.css";
import TopHeader from "../../components/cards/header";
import Menu from "../../components/extra/menu";
import Loader from "../../components/extra/loader";
import ButtonCreate from "../../components/extra/buttonCreation";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class Episodes extends Component {
  constructor(props) {
    super(props);

    this.state = {
      episodes: [],
      products: [],
      story: {},
      mask: "none",
      loading: false
    };
  }

  handleClickEvent(destination, storyId) {
    let projectId = this.props.match.params.projectId;
    let source = "episode";
    let url =
      "/" + destination + "/" + source + "/" + storyId + "/" + projectId;
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

  async componentDidMount() {
    let projectId = this.props.match.params.projectId;
    let storyId = this.props.match.params.storyId;
    var currentUser = Parse.User.current();

    if (currentUser) {
      this.setState({
        loading: true,
        mask: "block"
      });

      const response = await Parse.Cloud.run("getStoryEpisodes", {
        admin: currentUser.id,
        projectId: projectId,
        storyId: storyId
      });

      let episodefeed = {};
      episodefeed = await response.data;

      this.setState({
        episodes: episodefeed.episodes,
        products: episodefeed.products,
        story: episodefeed.story,
        loading: false,
        mask: "none"
      });
    }
  }

  handleClickButton(destination) {
    let location = destination;
    let project = this.props.match.params.projectId;
    let storyId = this.state.story.id;
    let products = this.state.products;
    return function() {
      history.push({
        pathname: "/card/create",
        search: "",
        state: {
          element: location,
          projectId: project,
          storyId: storyId,
          products: products
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
          <div className="medium-3 large-3 cell login_card">
            <Menu projectId={this.props.match.params.projectId} />
          </div>
          <div className="small-12 medium-3 large-3 cell icons">
            <div className="create_new">Create New</div>

            <button
              className="create_button"
              onClick={this.handleClickButton("episode")}
            >
              <p className="title">
                <FontAwesomeIcon className="size" icon={faCircle} />
                Episode
              </p>
            </button>
          </div>
          {this.state.episodes.map(episode => (
            <a
              key={episode.id}
              className="medium-3 large-3 cell card-zoom icons"
              onClick={this.handleClickEvent("storyitem", episode.id)}
            >
              <div
                style={{ margin: "150px 10px auto" }}
                className="story_title truncate_story_title"
              >
                {episode.name}
              </div>
            </a>
          ))}
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

export default Episodes;
