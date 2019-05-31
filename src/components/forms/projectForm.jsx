import React, { Component } from "react";
import history from "../../history";
import Parse from "parse";
import { parseSettings as config } from "../../js/serverSettings";

Parse.initialize(config.appId);
Parse.serverURL = config.url;

class ProjectForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      error: ""
    };
  }

  projectSubmit = event => {
    event.preventDefault();
    var currentUser = Parse.User.current();

    if (currentUser) {
      if (this.state.name !== "") {
        Parse.Cloud.run("createNewProject", {
          admin: currentUser.id,
          projectName: this.state.name
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

  handleChangeName = event => {
    this.setState({ name: event.target.value });
    console.log(this.state.name);
  };

  handleReturnButton() {
    return function() {
      history.goBack();
    };
  }

  render() {
    return (
      <div className="small-12 medium-6 large-6 cell create_background">
        <form method="post">
          <center>
            <div
              className="edit_labels medium-12 large-12"
              style={{ marginBottom: "30px !important" }}
            >
              New Project
            </div>

            <label htmlFor="projectName" style={{ color: "white" }}>
              {this.state.error}
            </label>
            <input
              type="text"
              className="_pack common_pack_detail validate"
              placeholder="Project name"
              name="projectName"
              required=""
              id="projectName"
              aria-required="true"
              onChange={this.handleChangeName}
            />
            <br />
          </center>
          <span>
            <a onClick={this.projectSubmit} className="create">
              CREATE
            </a>
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
    );
  }
}

export default ProjectForm;
