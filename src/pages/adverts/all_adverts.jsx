import React, { Component } from "react";
import history from "../../history";
import Menu from "../../components/extra/menu";
import { parseSettings as config } from "../../js/serverSettings";
import Parse from "parse";
import TopHeader from "../../components/cards/header";
import Loader from "../../components/extra/loader";
import type from "../../js/type";
import ButtonCreate from "../../components/extra/buttonCreation";

Parse.initialize(config.appId);
Parse.serverURL = config.url;

class AllAdvertPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      adverts: [],
      loading: true,
      mask: "block"
    };
  }

  handleClickEvent(destination, advertId, projectId) {
    let url = "/" + destination + "/" + advertId + "/" + projectId;
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

      const response = await Parse.Cloud.run("allAdverts", {
        admin: currentUser.id,
        projectId: id
      });

      let advertfeed = {};
      advertfeed = await response.data;

      this.setState({
        adverts: advertfeed.ads,
        loading: false,
        mask: "none"
      });
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
            <b>All Members</b>
          </span>
          {/** Menu Bar */}
          <div className="medium-3 large-3 login_card cell">
            <Menu projectId={this.props.match.params.projectId} />
          </div>

          {/** Menu Bar */}
          <div className="small-12 medium-3 large-3 cell icons">
            <div className="create_new">Create New</div>

            <ButtonCreate
              name={"Advert"}
              destination={"advert"}
              project={this.props.match.params.projectId}
            />
          </div>

          {this.state.adverts.length > 0 ? (
            this.state.adverts.map(
              advert => (
                // this.props.projectId !== project.id ? (
                <a
                  key={advert.id}
                  onClick={this.handleClickEvent(
                    "advert",
                    advert.id,
                    this.props.match.params.projectId
                  )}
                >
                  <div
                    className="medium-3 large-3 cell icons"
                    data-id={advert.id}
                    data-name={advert.name}
                    key={advert.id}
                  >
                    <center>
                      {advert.image !== "" ? (
                        <img
                          style={{ marginTop: "45px" }}
                          width="200px"
                          height="200px"
                          src={advert.image}
                        />
                      ) : (
                        <p className="none" style={{ margin: "150px 80px" }}>
                          <b>No Artwork</b>
                        </p>
                      )}
                    </center>

                    <span className="name_tag" style={{ position: "unset" }}>
                      <p className="sticker_name_text"> {advert.name} </p>
                    </span>
                  </div>
                </a>
              )
              // ) : null
            )
          ) : (
            <span className="medium-3 large-3 cell icons">
              <center>
                <p className="none" style={{ margin: "150px 80px" }}>
                  <b>No Adverts</b>
                </p>
              </center>
            </span>
          )}
        </div>
      </>
    );
  }
}

export default AllAdvertPage;
