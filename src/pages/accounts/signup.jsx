import React, { Component } from "react";
import logo from "../../logo.svg";
import Parse from "parse";
import TopHeader from "../../components/cards/header";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { parseSettings as config } from "../../js/serverSettings";
import "../../App.css";
import history from "../../history";
import type from "../../js/type";
import glogo from "../../assets/G_logo.png";

Parse.initialize(config.appId);
Parse.serverURL = config.url;

class SignUp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      gender: "",
      error: "",
      signError: ""
    };
  }

  handleChangeName = e => {
    this.setState({
      name: e.target.value
    });
  };

  handleChangeUsername = e => {
    this.setState({
      email: e.target.value
    });
  };
  handleChangePass = e => {
    this.setState({
      password: e.target.value
    });
  };
  handleChangeConfirm = e => {
    this.setState({
      confirmPassword: e.target.value
    });
  };
  onGenderChanged = e => {
    this.setState({
      gender: e.target.value
    });
  };

  checkForm = e => {
    if (
      this.state.name === "" ||
      this.state.password === "" ||
      this.state.email === "" ||
      this.state.gender === "" ||
      this.state.confirmPassword === ""
    ) {
      this.setState({
        error: "Please Each Field"
      });
      return false;
    } else if (this.state.password !== this.state.confirmPassword) {
      this.setState({
        error: "Please Make sure passwords are equal"
      });
    } else {
      return true;
    }
  };

  signUser = e => {
    e.preventDefault();
    let check = this.checkForm();
    console.log(
      this.state.name +
        this.state.email +
        this.state.password +
        this.state.gender
    );
    if (check === true) {
      var user = new Parse.User();
      user.set("name", this.state.name);
      user.set("username", this.state.email);
      user.set("email", this.state.email);
      user.set("password", this.state.password);
      user.set("type", type.USER.normal);
      user.set("gender", this.state.gender);
      user.set("image_set", false);

      user.signUp().then(
        function(user) {
          if (user) {
            window.location = "/";
          }
        },
        function(error) {
          this.setState({
            signError: error.message
          });
        }
      );
    } else {
      this.setState({
        signError: "Make Sure to Tick the box"
      });
    }
  };

  handleReturnButton() {
    return function() {
      history.push("/");
    };
  }

  PolicyChanged = e => {
    this.setState({
      policy: e.target.value
    });
  };

  render() {
    return (
      <div className="App background">
        <div
          className="grid-x grid-padding-x align-center"
          style={{ margin: "50px" }}
        >
          <div
            className="medium-6 large-6 cell"
            onClick={() => {
              history.push("/home");
            }}
          >
            <img src={glogo} width="200" />
          </div>
        </div>
        <div
          style={{ marginTop: "100px" }}
          className="grid-x grid-padding-x align-spaced"
        >
          <div className="small-12 medium-6 large-6 cell sign_form">
            <form id="signForm" method="post" onSubmit={this.signUser}>
              <center>
                <div
                  id="errorHandle"
                  className="policy_label small-12 medium-6 large-6 cell"
                  style={{ textAlign: "center" }}
                >
                  {this.state.error}
                </div>
                <input
                  type="text"
                  className="_signup_textbox"
                  placeholder="Name"
                  style={{ color: "white" }}
                  onChange={this.handleChangeName}
                />
                <label htmlFor="name" id="nameField" />
                <br />
                <input
                  type="email"
                  className="_signup_textbox"
                  placeholder="Email"
                  style={{ color: "white" }}
                  onChange={this.handleChangeUsername}
                />
                <label htmlFor="username" id="user" />
                <br />
                <input
                  type="password"
                  className="_signup_textbox"
                  placeholder="Password"
                  style={{ color: "white" }}
                  onChange={this.handleChangePass}
                />
                <label htmlFor="password" id="pwd" />
                <br />
                <input
                  type="password"
                  className="_signup_textbox"
                  placeholder="Confirm Password"
                  style={{ color: "white" }}
                  onChange={this.handleChangeConfirm}
                />
                <label htmlFor="confirm_password" id="confirm" />
                <br />
                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="Male"
                    className="with-gap"
                    checked={this.state.gender === "Male"}
                    onChange={this.onGenderChanged}
                  />
                  <span className="_label" style={{ margin: "0px 120px auto" }}>
                    Male
                  </span>
                </label>
                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="Female"
                    className="with-gap"
                    checked={this.state.gender === "Female"}
                    onChange={this.onGenderChanged}
                  />
                  <span className="_label" style={{ margin: "0px 120px auto" }}>
                    Female
                  </span>
                </label>
                <br />
                <label>
                  <input
                    type="checkbox"
                    className="filled-in"
                    name="terms_policy"
                    checked={true}
                    onChange={this.PolicyChanged}
                  />
                  <span style={{ margin: "0px 120px auto" }}>
                    I accept{" "}
                    <a href="#" className="policy_label">
                      Terms and Conditions
                    </a>
                  </span>
                </label>
                <br />
                <a
                  style={{ textAlign: "center" }}
                  onClick={this.signUser}
                  className="btnSignUp"
                >
                  Sign up!
                </a>
                <br />
                <button
                  style={{ textAlign: "center" }}
                  type="submit"
                  className="btnSignUp"
                >
                  <a onClick={this.handleReturnButton()} className="_btnLogin">
                    Go back to Login Page
                  </a>
                </button>
                <div
                  id="errorHandle"
                  className="policy_label small-12 medium-6 large-6 cell"
                  style={{ textAlign: "center" }}
                >
                  {this.state.signError}
                </div>
              </center>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default SignUp;
