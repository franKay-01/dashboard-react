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
import ItemDisplayIndication from "../../components/extra/itemDisplayIndication";

Parse.initialize(config.appId);
Parse.serverURL = config.url;

class AllPacksPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      packs: [],
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

      const response = await Parse.Cloud.run("getPacks", {
        admin: currentUser.id,
        projectId: id
      });

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
            <b>All Packs</b>
          </span>
          {/** Menu Bar */}
          <div className="medium-3 large-3 login_card cell">
            <Menu projectId={this.props.match.params.projectId} />
          </div>
          {/** Menu Bar */}

          <div className="small-12 medium-3 large-3 cell icons">
            <div className="create_new">Create New</div>

            <ButtonCreate
              name={"Sticker Pack"}
              destination={"pack"}
              project={this.props.match.params.projectId}
            />
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
                &nbsp; GROUPED
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
                &nbsp; THEMED
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
                  style={{ color: "#203f80" }}
                  icon={faCircle}
                />{" "}
                &nbsp; CURATED
              </p>
            </button>
          </div>
          {this.state.packs.length > 0
            ? this.state.packs.map(pack => (
                <div
                  key={pack.id}
                  className="medium-3 large-3 cell card-zoom icons "
                >
                  {pack.type === type.PACK_TYPE.grouped ? (
                    <ItemDisplayIndication color="#ffb12f" />
                  ) : null}
                  {pack.type === type.PACK_TYPE.themed ? (
                    <ItemDisplayIndication color="#28ff7e" />
                  ) : null}
                  {pack.type === type.PACK_TYPE.curated ? (
                    <ItemDisplayIndication color="#203f80" />
                  ) : null}
                  <a
                    onClick={this.handleClickEvent(
                      "pack",
                      pack.id,
                      this.props.match.params.projectId
                    )}
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
                </div>
              ))
            : null}
        </div>
      </>
    );
  }
}

export default AllPacksPage;
