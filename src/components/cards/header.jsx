import React, { Component } from "react";
import history from "../../history";
import glogo from "../../assets/G_logo.png";
import "../../css/myStyle.css";
import Parse from "parse";
import { parseSettings as config } from "../../js/serverSettings";

Parse.initialize(config.appId);
Parse.serverURL = config.url;

class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: false
    };
  }

  logoutUser() {
    let cookies = document.cookie.split(";");
    console.log("COOKIES TO BE DELETED " + cookies);
    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i];
      let eqPos = cookie.indexOf("=");
      let name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }

    Parse.User.logOut().then(function() {
      history.push("/");
    });
  }

  componentDidMount() {
    let currentUser = Parse.User.current();
    if (currentUser) {
      this.setState({
        user: true
      });
    }
  }

  render() {
    return (
      <>
        <div
          className="medium-6 large-6 cell"
          onClick={() => {
            if (Parse.User.current()) {
              history.push("/home");
            }
          }}
        >
          <img src={glogo} width="200" />
        </div>
        {this.state.user !== false ? (
          <div className="medium-6 large-6 cell" style={{ marginTop: "50px" }}>
            <a
              id="signoutLink"
              onClick={() => {
                this.logoutUser();
              }}
            >
              LOGOUT
            </a>
          </div>
        ) : null}

        {/* <div className="small-12 medium-12 large-12 cell welcome_post">
          
        </div> */}
      </>
    );
  }
}

export default Header;
