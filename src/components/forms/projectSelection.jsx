import React, { Component } from "react";
import history from "../../history";
import Parse from "parse";
import { parseSettings as config } from "../../js/serverSettings";
import Loader from "../../components/extra/loader";
import "../../js/easySelectable";
// import "../../js/selectable";
import $ from "jquery";

Parse.initialize(config.appId);
Parse.serverURL = config.url;

class ProjectSelection extends Component {
  constructor(props) {
    super(props);

    this.state = {
      projects: [],
      currentProjects: [],
      loading: true,
      mask: "block",
      error: ""
    };
  }

  handleReturnButton() {
    return function() {
      history.goBack();
    };
  }

  handleSelectedProject = async event => {
    event.preventDefault();
    let items = "";
    var currentUser = Parse.User.current();
    items = document.getElementById("stickerIds").value;

    let projectId = this.props.projectId;
    let itemId = this.props.itemId;
    let currentType = this.props.currentType;

    if (currentUser) {
      if (items !== "") {
        this.setState({
          loading: true,
          mask: "block",
          error: ""
        });

        const response = await Parse.Cloud.run("addNewProject", {
          admin: currentUser.id,
          itemType: currentType,
          itemIds: items,
          projectId: projectId,
          itemId: itemId,
          loading: true,
          mask: "block",
          error: ""
        });

        if (response.responseCode === 0) {
          history.goBack();
        }
      } else {
        this.setState({
          error: "You Must Select One or more Projects"
        });
      }
    } else {
      history.push("/");
    }
  };

  async componentDidMount() {
    $(function() {
      let selectedItems = [];
      let counter = 0;
      let word;
      $("#easySelectable").easySelectable({
        onSelected: function(el) {
          selectedItems.push(el.attr("data-id"));
          el.css({
            // "border-color": "#00bcd4",
            "border-color": "#e57373",
            "border-width": "4px",
            "border-style": "solid"
          });
          counter = counter + 1;
          $("#stickerIds").val(selectedItems);
          $(".add-sticker-btn").removeAttr("disabled");
          word = "ADD " + counter + " ITEM(S)";
          word = word.bold();
          $(".add-sticker-btn").html(word);
        },
        onUnSelected: function(el) {
          selectedItems = selectedItems.filter(function(obj) {
            return obj !== el.attr("data-id");
          });
          el.css({ border: "none" });
          $("#stickerIds").val(selectedItems);
          counter = counter - 1;
          word = "ADD " + counter + " ITEM(S)";
          word = word.bold();

          $(".add-sticker-btn").html(word);

          if (selectedItems.length === 0) {
            word = "ADD ITEM(S)";
            word = word.bold();

            $(".add-sticker-btn").attr("disabled", true);
            $(".add-sticker-btn").html(word);
          }
        }
      });
    });
    let currentProjects = this.props.currentProjects;
    let currentUser = Parse.User.current();
    if (currentUser) {
      this.setState({
        loading: true,
        mask: "block",
        currentProjects: currentProjects
      });

      const response = await Parse.Cloud.run("getProjectsList", {
        admin: currentUser.id,
        currentProjects: currentProjects
      });
      let projectFeed = {};
      projectFeed = await response.data;
      this.setState({
        projects: projectFeed.projects,
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
        <span
          className="medium-12 large-12 welcome_post"
          style={{ marginBottom: "20px" }}
        >
          <div id="pageMask" style={{ display: this.state.mask }} />
          <Loader loading={this.state.loading} />
        </span>
        <div className="medium-6 large-6 topList">
          <b>Adding New Projects</b>
        </div>
        <div className="medium-6 large-6">
          <button
            type="submit"
            className="waves-effect #e57373 red lighten-2 btn add-sticker-btn"
            style={{ position: "fixed", borderRadius: "10.8px" }}
            onClick={this.handleSelectedProject}
          >
            <b>ADD SELECTED</b>
          </button>
        </div>
        <div style={{ color: "red" }}>{this.state.error}</div>

        <div
          id="easySelectable"
          className="small-12 medium-12 large-12 cell grid-x grid-padding-x align-spaced"
        >
          {this.state.projects.map(
            project => (
              // this.props.projectId !== project.id ? (
              <div
                className="medium-3 large-3 cell icons"
                data-id={project.id}
                data-name={project.name}
                key={project.id}
              >
                {project.image === "" ? (
                  <center>
                    <p className="none" style={{ margin: "150px 80px" }}>
                      <b>No Artwork</b>
                    </p>
                  </center>
                ) : (
                  <img src={project.image} className="card-image-size" />
                )}
                <span className="name_tag" style={{ position: "unset" }}>
                  <p className="sticker_name_text"> {project.name} </p>
                </span>
              </div>
            )
            // ) : null
          )}
          <input
            type="hidden"
            className="sticker_id"
            id="stickerIds"
            name="itemIds"
            onChange={this.handleSelectedIds}
          />
        </div>
        <div className="cell grid-x grid-padding-x align-left">
          <button
            style={{ color: "#a46580", margin: "35px" }}
            type="button"
            id="btnCancel"
            className="cancel"
            onClick={this.handleReturnButton()}
          >
            Back
          </button>
        </div>
      </>
    );
  }
}

export default ProjectSelection;
