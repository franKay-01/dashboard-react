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
  faArrowRight
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Loader from "../../components/extra/loader";
import { Redirect } from "react-router-dom";
import type from "../../js/type";

Parse.initialize(config.appId);
Parse.serverURL = config.url;

class PackPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      projects: [],
      stickers: [],
      userId: "",
      pack: {},
      next: "",
      previous: "",
      loading: true,
      mask: "block"
    };
  }

  handleRemoveProject(item, projectId, projectName) {
    let currentProject = projectId;
    let destination = item;
    let name = projectName;
    let packId = this.props.match.params.packId;
    return function() {
      history.push({
        pathname: "/card/create",
        search: "",
        state: {
          element: destination,
          projectId: currentProject,
          itemId: packId,
          projectName: name,
          currentType: "pack"
        }
      });
    };
  }

  handleClickButton(item) {
    let id = this.props.match.params.projectId;
    let packId = this.props.match.params.packId;
    let projects = this.state.pack.projects;
    let url = window.location.href;

    return function() {
      history.push({
        pathname: "/card/create",
        search: "",
        state: {
          element: item,
          projectId: id,
          itemId: packId,
          currentProjects: projects,
          currentType: "editPack",
          url: url
        }
      });
    };
  }

  async componentDidMount() {
    let id = this.props.match.params.projectId;
    let packId = this.props.match.params.packId;
    let currentUser = Parse.User.current();

    if (currentUser) {
      this.setState({
        loading: true,
        mask: "block"
      });
      const response = await Parse.Cloud.run("getPackFeed", {
        admin: currentUser.id,
        projectId: id,
        packId: packId
      });
      let packfeed = {};
      packfeed = await response.data;

      this.setState({
        projects: packfeed.projects,
        userId: currentUser.id,
        stickers: packfeed.stickers,
        pack: packfeed.pack,
        next: packfeed.nextPack,
        previous: packfeed.previousPack,
        loading: false,
        mask: "none",
        redirect: true
      });
    } else {
      history.push("/");
    }
  }

  handleRedirect = event => {
    // history.push("/https://google.com");
    return <Redirect to="https://google.com" />;
  };

  handlePublishing(item, condition) {
    let packId = this.props.match.params.packId;
    let name = this.state.pack.name;
    let itemType = "pack";
    let url = window.location.href;
    url = btoa(url);
    return function() {
      history.push({
        pathname: "/card/create",
        search: "",
        state: {
          element: item,
          itemId: packId,
          name: name,
          condition: condition,
          itemType: itemType,
          url: url
        }
      });
    };
  }

  render() {
    return (
      <div className="App">
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
            {Object.keys(this.state.pack).length !== 0 ? (
              <>
                <b>{this.state.pack.name} Sticker Pack</b>
              </>
            ) : (
              <>
                <b> Sticker Pack</b>
              </>
            )}
          </span>
          {/** Menu Bar */}
          <div className="medium-3 large-3 login_card cell">
            <Menu projectId={this.props.match.params.projectId} />
          </div>
          {/** Menu Bar */}

          {/** Edit Pack Card */}
          <div className="medium-3 large-3 cell icons">
            {Object.keys(this.state.pack).length !== 0 ? (
              <>
                <center>
                  {this.state.pack.art !== "" ? (
                    <p
                      className="none"
                      style={{ width: "200px", margin: "70px 0px" }}
                    >
                      <img src={this.state.pack.art} />
                    </p>
                  ) : (
                    <p className="none" style={{ margin: "150px 90px" }}>
                      {/* <img src="http://placehold.it/135x135.png?text=No+Artwork" /> */}
                      <b>No Artwork</b>
                    </p>
                  )}
                </center>
                <button
                  className="create_button review_tab_bottom"
                  onClick={this.handleClickButton("editPack")}
                >
                  <p className="title">
                    <FontAwesomeIcon className="size" icon={faCircle} />
                    &nbsp;EDIT PACK
                  </p>
                </button>
              </>
            ) : (
              <>
                <center>
                  <p className="none" style={{ margin: "150px 90px" }}>
                    <b>No Artwork</b>
                  </p>
                </center>

                <button
                  className="create_button review_tab_bottom"
                  onClick={this.handleClickButton("editPack")}
                >
                  <p className="title">
                    <FontAwesomeIcon className="size" icon={faCircle} />
                    &nbsp;EDIT PACK
                  </p>
                </button>
              </>
            )}
          </div>
          {/** Edit Pack Card */}

          {/** Current Projects Card */}
          <div className="medium-3 large-3 cell icons">
            <div className="create_new">Projects</div>
            {this.state.projects.length > 0 ? (
              this.state.projects.map(project => (
                <span key={project.id}>
                  <p className="options">
                    {project.name} Project
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
                  </p>
                </span>
              ))
            ) : (
              <p className="none_no_margin">None</p>
            )}

            <button
              className="create_button review_tab_bottom"
              style={{ background: "transparent" }}
              onClick={this.handleClickButton("addProject")}
            >
              <p
                className="title"
                style={{ color: "#af627f", fontWeight: "800" }}
              >
                Add New Project
              </p>
            </button>
          </div>
          {/** Current Projects Card */}

          {/** Upload Stickers Card */}
          <div className="medium-3 large-3 cell icons">
            <div className="create_new">Add Stickers</div>
            <div className="options">Options</div>
            {this.state.pack.type === type.PACK_TYPE.grouped ||
            this.state.pack.type === type.PACK_TYPE.themed ? (
              <a
                // onClick={this.handleClickButton("sticker")}
                // onClick={this.handleRedirect}
                href={
                  "https://cryptic-waters-41617.herokuapp.com/uploads/react/" +
                  this.props.match.params.packId +
                  "/" +
                  this.props.match.params.projectId +
                  "/" +
                  this.state.userId +
                  "/" +
                  btoa(window.location.href)
                }
              >
                <button className="create_button">
                  <p className="title button_font">
                    &nbsp;
                    <FontAwesomeIcon
                      style={{ color: "white" }}
                      className="size"
                      icon={faCircle}
                    />
                    &nbsp;<span style={{ color: "white" }}>FROM COMPUTER</span>
                  </p>
                </button>
              </a>
            ) : (
              <a onClick={this.handleClickButton("stickerPack")}>
                <button className="create_button">
                  <p className="title button_font">
                    &nbsp;
                    <FontAwesomeIcon
                      style={{ color: "white" }}
                      className="size"
                      icon={faCircle}
                    />
                    &nbsp;<span style={{ color: "white" }}>FROM PACK</span>
                  </p>
                </button>
              </a>
            )}
            <center className="indication">
              <span style={{ paddingRight: "125px" }}>
                {/* <% if (previous !== ""){ %> */}
                {this.state.next !== "" ? (
                  <a
                    style={{ color: "#a46580" }}
                    href={
                      "/pack/" +
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
                      "/pack/" +
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
          {/** Upload Stickers Card */}

          {/* Displaying card for publishing */}

          {this.state.pack.type !== type.PACK_TYPE.grouped ? (
            <div className="medium-3 large-3 cell icons">
              <div class="create_new">
                Publishing
                {this.state.pack.is_published === false ? (
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
                ) : (
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
                )}
              </div>
              {this.state.pack.is_published === false ? (
                <button
                  className="create_button"
                  onClick={this.handlePublishing("publishing", "Publish")}
                >
                  <p className="title">
                    <FontAwesomeIcon className="size" icon={faCircle} />
                    &nbsp;PUBLISH
                  </p>
                </button>
              ) : (
                <button
                  className="create_button"
                  onClick={this.handlePublishing("publishing", "Unpublish")}
                >
                  <p className="title">
                    <FontAwesomeIcon className="size" icon={faCircle} />
                    &nbsp;UNPUBLISH
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
                  &nbsp; UNPUBLISHED
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
                  &nbsp; PUBLISHED
                </p>
              </button>
            </div>
          ) : null}

          {/* Displaying card for publishing */}

          {/** Stickers */}
          {this.state.stickers.length > 0 ? (
            <Stickers
              stickers={this.state.stickers}
              type={this.state.pack.type}
              projectId={this.props.match.params.projectId}
              packId={this.props.match.params.packId}
            />
          ) : null}
          {/** Stickers */}
        </div>
      </div>
    );
  }
}

export default PackPage;
