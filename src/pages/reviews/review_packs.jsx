import React, { Component } from "react";
import history from "../../history";
import { parseSettings as config } from "../../js/serverSettings";
import Parse from "parse";
import TopHeader from "../../components/cards/header";
import Loader from "../../components/extra/loader";

Parse.initialize(config.appId);
Parse.serverURL = config.url;

class ReviewPacks extends Component {
  constructor(props) {
    super(props);

    this.state = {
      packs: [],
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

      const response = await Parse.Cloud.run("getReviewPacks");

      let packfeed = {};
      if (response.responseCode === 0) {
        packfeed = await response.data;

        this.setState({
          packs: packfeed,
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

  handleClickEvent(destination, packId) {
    let url = "/" + destination + "/" + packId;
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
            <b>All Packs In Review</b>
          </span>
          <div className="small-12 medium-3 large-3 cell login_card">
            <div className="card_head_position">
              <div className="stats">Dashboard</div>
              <div onClick={this.handleReturnButton()} className="_stickers">
                Go Back
              </div>
            </div>
          </div>
          {this.state.packs.length > 0 ? (
            this.state.packs.map(pack => (
              <a
                key={pack.id}
                className="medium-3 large-3 cell card-zoom icons "
                onClick={this.handleClickEvent("reviewPack", pack.id)}
              >
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
            <div className="medium-3 large-3 cell card-zoom icons ">
              <p className="none" style={{ margin: "150px 80px" }}>
                <b>No Packs</b>
              </p>
            </div>
          )}
        </div>
      </>
    );
  }
}

export default ReviewPacks;
