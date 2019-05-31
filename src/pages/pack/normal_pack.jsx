import React, { Component } from "react";
import history from "../../history";
import Menu from "../../components/extra/normalMenu";
import { parseSettings as config } from "../../js/serverSettings";
import Parse from "parse";
import TopHeader from "../../components/cards/header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Loader from "../../components/extra/loader";
import Stickers from "../../components/cards/stickerCards";
import {
  faCircle,
  faArrowLeft,
  faArrowRight,
  faExclamationCircle
} from "@fortawesome/free-solid-svg-icons";
import type from "../../js/type";

Parse.initialize(config.appId);
Parse.serverURL = config.url;

class AllNormalPacksPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      projects: [],
      stickers: [],
      pack: {},
      next: "",
      previous: "",
      reports: false,
      loading: true,
      mask: "block",
      userId: ""
    };
  }

  async componentDidMount() {
    let id = this.props.match.params.packId;
    var currentUser = Parse.User.current();

    if (currentUser) {
      this.setState({
        loading: true,
        mask: "block"
      });

      const response = await Parse.Cloud.run("getPackFeed", {
        admin: currentUser.id,
        packId: id
      });

      let packfeed = {};
      packfeed = await response.data;

      this.setState({
        projects: packfeed.projects,
        stickers: packfeed.stickers,
        pack: packfeed.pack,
        next: packfeed.nextPack,
        previous: packfeed.previousPack,
        userId: currentUser.id,
        reports: packfeed.reports,
        loading: false,
        mask: "none",
        redirect: true
      });
    } else {
      history.push("/");
    }
  }

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

  handleClickButton(item) {
    let packId = this.props.match.params.packId;
    let name = this.state.pack.name;
    let itemType = "Pack";
    let url = window.location.href;

    return function() {
      history.push({
        pathname: "/card/create",
        search: "",
        state: {
          element: item,
          itemId: packId,
          name: name,
          itemType: itemType,
          currentType: "editPack",
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
            <Menu userId={this.state.userId} />
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

          {/** Upload Stickers Card */}
          <div className="medium-3 large-3 cell icons">
            <div className="create_new">Add Stickers</div>
            <div className="options">Options</div>

            <a
              // onClick={this.handleClickButton("sticker")}
              // onClick={this.handleRedirect}
              href={
                "https://cryptic-waters-41617.herokuapp.com/uploads/normal/react/" +
                this.props.match.params.packId +
                "/" +
                this.state.userId
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
            <center className="indication">
              <span style={{ paddingRight: "125px" }}>
                {/* <% if (previous !== ""){ %> */}
                {this.state.next !== "" ? (
                  <a
                    style={{ color: "#a46580" }}
                    href={"/normalPacks/" + this.state.previous}
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
                    href={"/normalPacks/" + this.state.next}
                  >
                    <FontAwesomeIcon size="3x" icon={faArrowRight} />
                  </a>
                ) : null}
                {/* <% } %> */}
              </span>
            </center>
          </div>
          {/** Upload Stickers Card */}

          <div className="medium-3 large-3 cell icons">
            <div className="create_new">
              Publishing
              {this.state.pack.status === type.PACK_STATUS.approved ? (
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
              {this.state.pack.status === type.PACK_STATUS.pending ? (
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
              {this.state.pack.status === type.PACK_STATUS.review ? (
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
              {this.state.pack.status === type.PACK_STATUS.rejected ? (
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
            {this.state.pack.status === type.PACK_STATUS.approved ? (
              this.state.pack.is_published === false ? (
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
              )
            ) : this.state.pack.status === type.PACK_STATUS.review ? (
              <button className="create_button">
                <p className="title">
                  <FontAwesomeIcon className="size" icon={faCircle} />
                  &nbsp;Wait For Feedback
                </p>
              </button>
            ) : (
              <button
                className="create_button"
                onClick={this.handleClickButton("submitForReview")}
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
          </div>
          <div className="medium-3 large-3 cell icons">
            <div className="create_new">Reports</div>
            {this.state.reports === true ? (
              <button
                className="create_button"
                style={{ backgroundColor: "#f1f1f1" }}
                onClick={this.handleClickButton("checkReports")}
              >
                <p className="title" style={{ color: "black" }}>
                  <FontAwesomeIcon className="size" icon={faCircle} />
                  &nbsp;Reports
                  <FontAwesomeIcon
                    style={{ color: "red", margin: "4px", float: "right" }}
                    icon={faExclamationCircle}
                  />
                </p>
              </button>
            ) : (
              <button
                className="create_button"
                onClick={this.handleClickButton("checkReports")}
              >
                <p className="title">
                  <FontAwesomeIcon className="size" icon={faCircle} />
                  &nbsp;Reports
                </p>
              </button>
            )}
          </div>

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

export default AllNormalPacksPage;
