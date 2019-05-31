import React, { Component } from "react";
import history from "../../history";
import ChipInput from "material-ui-chip-input";
import Parse from "parse";
import { parseSettings as config } from "../../js/serverSettings";
import Loader from "../../components/extra/loader";

Parse.initialize(config.appId);
Parse.serverURL = config.url;

class AuthorForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      email: "",
      number: "",
      social: "",
      mask: "none",
      error: "",
      loading: false
    };
  }

  submitAuthor = event => {
    event.preventDefault();
    var currentUser = Parse.User.current();

    if (currentUser) {
      if (
        this.state.name !== "" &&
        this.state.email !== "" &&
        this.state.number !== "" &&
        this.state.social !== ""
      ) {
        this.setState({
          loading: true,
          mask: "block",
          error: ""
        });
        Parse.Cloud.run("createNewAuthors", {
          admin: currentUser.id,
          name: this.state.name,
          email: this.state.email,
          number: this.state.number,
          social: this.state.social
        }).then(function(response) {
          if (response.responseCode === 0) {
            history.push("/home");
          }
        });
      } else {
        this.setState({ error: "Name field can not be empty" });
      }
    } else {
      history.push("/");
    }
  };

  handleNameChange = event => {
    this.setState({
      name: event.target.value
    });
  };

  handleNumberChange = event => {
    this.setState({
      number: event.target.value
    });
  };

  handleEmailChange = event => {
    this.setState({
      email: event.target.value
    });
  };

  handleReturnButton() {
    return function() {
      history.goBack();
    };
  }

  handleChange = event => {
    this.setState({
      social: event
    });
  };

  render() {
    return (
      <>
        <div id="pageMask" style={{ display: this.state.mask }} />
        <Loader loading={this.state.loading} />
        <div className="small-12 medium-6 large-6 cell create_background">
          <form method="post">
            <center>
              <div
                className="edit_labels medium-12 large-12"
                style={{ marginBottom: "30px !important" }}
              >
                New Author
              </div>
              <label style={{ color: "white" }}>{this.state.error}</label>
              <input
                type="text"
                className="_pack common_pack_detail validate"
                placeholder="Author's Name"
                name="authorName"
                required=""
                aria-required="true"
                onChange={this.handleNameChange}
              />
              <br />
              <input
                type="email"
                className="_pack common_pack_detail validate"
                placeholder="Email"
                name="authorEmail"
                required=""
                aria-required="true"
                onChange={this.handleEmailChange}
              />
              <br />
              <input
                type="number"
                className="_pack common_pack_detail validate"
                placeholder="Number"
                name="authorNumber"
                required=""
                aria-required="true"
                onChange={this.handleNumberChange}
              />
              <br />
              <label htmlFor="social">List Social Media Handles</label>
              <ChipInput
                //   defaultValue={["foo", "bar"]}
                id="social"
                onChange={chips => this.handleChange(chips)}
              />
              <br />
            </center>
            <span>
              <button onClick={this.submitAuthor} className="create">
                CREATE
              </button>
            </span>
            <span>
              <button
                type="button"
                id="btnCancel"
                className="cancel"
                onClick={this.handleReturnButton()}
              >
                Cancel
              </button>
            </span>
          </form>
        </div>
      </>
    );
  }
}

export default AuthorForm;
