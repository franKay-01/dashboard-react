import React, { Component } from "react";
import validateEmails from "../../util/validateEmail";
import Parse from "parse";
import { parseSettings as config } from "../../js/serverSettings";
import history from "../../history";
import Loader from "../../components/extra/loader";
import type from "../../js/type";

Parse.initialize(config.appId);
Parse.serverURL = config.url;

class loginCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      loading: false,
      mask: "none"
    };
  }

  setCookie = (name, value, days) => {
    let expires = "";
    if (days) {
      let date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
  };

  handleValidation = () => {
    let errors;
    let formIsValid = true;

    //Name
    if (this.state.email === "" && this.state.password === "") {
      formIsValid = false;
      return formIsValid;
    } else if (this.state.email === "" || this.state.password === "") {
      formIsValid = false;
      return formIsValid;
    } else {
      errors = validateEmails(this.state.email || "");
      if (errors === false) {
        formIsValid = false;
      } else {
        formIsValid = true;
      }
      return formIsValid;
    }
  };

  handleChangeEmail = event => {
    this.setState({ email: event.target.value });
  };

  handleChangePassword = event => {
    this.setState({ password: event.target.value });
  };

  handleSignUp() {
    return function() {
      history.push("/account/create");
    };
  }

  onFormSubmit = e => {
    e.preventDefault();
    let answer = this.handleValidation();
  };

  loginUser = e => {
    e.preventDefault();
    let answer = this.handleValidation();
    if (answer === false) {
      document.getElementById("errorField").innerHTML =
        "Check the username & password";
    } else {
      this.setState({
        loading: true,
        mask: "block"
      });
      document.getElementById("errorField").innerHTML = "";
      Parse.Cloud.run("login", {
        username: this.state.email,
        password: this.state.password
      }).then(
        user => {
          Parse.User.become(user.getSessionToken()).then(
            user => {
              {
                this.setCookie("token", user.getSessionToken(), 30);
              }
              console.log("USER " + JSON.stringify(user.get("type")));
              if (user.get("type") === type.USER.ultimate) {
                window.location = "/home";
              } else if (user.get("type") === type.USER.normal) {
                window.location = "/creator/home";
              }
            },
            error => {
              document.getElementById("errorField").innerText = error.message;
              document.getElementById("errorField").show();
            }
          );
        },
        error => {
          document.getElementById("errorField").innerText = error.message;
          document.getElementById("errorField").show();
        }
      );
    }
  };

  render() {
    return (
      <>
        <Loader loading={this.state.loading} />
        <div id="pageMask" style={{ display: this.state.mask }} />
        <div className="small-12 medium-3 large-3 cell login_card">
          <form onSubmit={this.onFormSubmit} id="login" method="post">
            <fieldset style={{ border: "none" }}>
              <span
                style={{ color: "white", marginLeft: "10px" }}
                id="errorField"
              />
              <input
                style={{
                  marginTop: "30px",
                  font: "1.5rem !important",
                  color: "white"
                }}
                className="box"
                placeholder="Email"
                type="email"
                tabIndex="1"
                name="username"
                id="username"
                onChange={this.handleChangeEmail}
              />

              <label htmlFor="username" id="user" />

              <br />
              <input
                className="box"
                style={{ font: "1.5rem !important", color: "white" }}
                placeholder="Password"
                type="password"
                name="password"
                tabIndex="2"
                id="password"
                onChange={this.handleChangePassword}
              />

              <label htmlFor="password" id="pwdd" />

              <br />
              <br />
              <a name="login" id="btnLogin" onClick={this.loginUser}>
                Login
              </a>

              <br />
              <br />
              <a href="/account/password/forgot" className="forgotten_password">
                Forgot password?
              </a>
              <br />
              <br />

              <a
                style={{
                  fontSize: "25px",
                  marginRight: "80px"
                }}
                id="btnLogin"
                onClick={this.handleSignUp()}
              >
                Sign Up!
              </a>
            </fieldset>
          </form>
        </div>
      </>
    );
  }
}

export default loginCard;
