import React, { Component } from "react";
import history from "../../history";
import { parseSettings as config } from "../../js/serverSettings";
import Parse from "parse";
import TopHeader from "../../components/cards/header";
import Loader from "../../components/extra/loader";
import {
  faCircle,
  faThumbsUp,
  faThumbsDown
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Stickers from "../../components/cards/stickerCards";

Parse.initialize(config.appId);
Parse.serverURL = config.url;

class PackReportPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pack: {},
      stickers: [],
      loading: false,
      mask: "none"
    };
  }

  async componentDidMount() {
    let packId = this.props.match.params.packId;
    let currentUser = Parse.User.current();

    if (currentUser) {
      this.setState({
        loading: true,
        mask: "block"
      });

      const response = await Parse.Cloud.run("getPackReport", {
        packId: packId
      });

      let packfeed = {};
      packfeed = await response.data;

      this.setState({
        stickers: packfeed.stickers,
        pack: packfeed.pack,
        loading: false,
        mask: "none"
      });
    } else {
      history.push("/");
    }
  }

  handleClickButton(item) {
    let packId = this.state.pack.id;
    let packName = this.state.pack.name;
    return function() {
      history.push({
        pathname: "/card/create",
        search: "",
        state: {
          element: item,
          itemId: packId,
          currentType: "Pack",
          itemName: packName
        }
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
          <div className="small-12 medium-3 large-3 cell icons">
            <div className="create_new">Review PACK</div>
            <button
              onClick={this.handleClickButton("approveItems")}
              className="create_button"
              style={{ backgroundColor: "#82cb4c" }}
            >
              <p className="title">
                <FontAwesomeIcon className="size" icon={faCircle} />
                Approve
              </p>
            </button>
            <button
              onClick={this.handleClickButton("rejectItem")}
              className="create_button"
              style={{ backgroundColor: "#cb574c" }}
            >
              <p className="title">
                <FontAwesomeIcon className="size" icon={faCircle} />
                Reject
              </p>
            </button>
            <span
              style={{
                background: "white",
                bottom: 0,
                position: "absolute",
                margin: "15px"
              }}
            >
              <button
                type="button"
                id="btnCancel"
                className="cancel_2"
                onClick={this.handleReturnButton()}
              >
                Back
              </button>
            </span>
          </div>
          <div className="medium-3 large-3 cell icons">
            <p>
              <b style={{ color: "#cb574c" }}>Name:</b>
            </p>
            <p>
              <b>{this.state.pack.name} Sticker Pack</b>
            </p>
            <br />
            <p>
              <b style={{ color: "#cb574c" }}>Description:</b>
            </p>
            <p>
              <b>{this.state.pack.description} Sticker Pack</b>
            </p>
            <p>
              <b style={{ color: "#cb574c" }}>Status:</b>
            </p>
            {this.state.pack.status === 2 ? (
              <p>
                <b style={{ color: "#82cb4c" }}>Approved</b>&nbsp;
                <FontAwesomeIcon
                  style={{ color: "#de3c35", margin: "2px" }}
                  //   className="size"
                  icon={faThumbsUp}
                />
              </p>
            ) : (
              <p>
                <b style={{ color: "#82cb4c" }}>Rejected</b>&nbsp;
                <FontAwesomeIcon
                  style={{ color: "#de3c35", margin: "2px" }}
                  //   className="size"
                  icon={faThumbsDown}
                />
              </p>
            )}
          </div>
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
                      <b>No Artwork</b>
                    </p>
                  )}
                </center>
              </>
            ) : (
              <>
                <center>
                  <p className="none" style={{ margin: "150px 90px" }}>
                    <b>No Artwork</b>
                  </p>
                </center>
              </>
            )}
          </div>
          {this.state.stickers.length > 0 ? (
            <Stickers
              stickers={this.state.stickers}
              type={this.state.pack.type}
              projectId={this.props.match.params.projectId}
              packId={this.props.match.params.packId}
            />
          ) : null}
        </div>
      </div>
    );
  }
}

export default PackReportPage;
