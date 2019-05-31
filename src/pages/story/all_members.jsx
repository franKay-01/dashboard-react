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

class AllMembersPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      members: [],
      loading: true,
      mask: "block"
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

      const response = await Parse.Cloud.run("getAllMembers", {
        admin: currentUser.id,
        projectId: id
      });

      let memberfeed = {};
      memberfeed = await response.data;

      this.setState({
        members: memberfeed.members,
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
              name={"Member"}
              destination={"member"}
              project={this.props.match.params.projectId}
            />
          </div>

          {this.state.members.length > 0 ? (
            this.state.members.map(
              member => (
                // this.props.projectId !== project.id ? (
                <div
                  className="medium-3 large-3 cell icons"
                  data-id={member.id}
                  data-name={member.name}
                  key={member.id}
                >
                  <center>
                    {member.image !== "" ? (
                      <img width="200px" height="200px" src={member.image} />
                    ) : (
                      <p className="none" style={{ margin: "150px 80px" }}>
                        <b>No Artwork</b>
                      </p>
                    )}
                  </center>

                  <span className="name_tag" style={{ position: "unset" }}>
                    <p className="sticker_name_text"> {member.name} </p>
                  </span>
                </div>
              )
              // ) : null
            )
          ) : (
            <span className="medium-3 large-3 cell icons">
              <center>
                <p className="none" style={{ margin: "150px 80px" }}>
                  <b>No Member</b>
                </p>
              </center>
            </span>
          )}
        </div>
      </>
    );
  }
}

export default AllMembersPage;
