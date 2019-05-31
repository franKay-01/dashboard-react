import React, { Component } from "react";
import history from "../../history";
import Parse from "parse";
import { parseSettings as config } from "../../js/serverSettings";
import Loader from "../../components/extra/loader";
import "../../js/easySelectable";
import $ from "jquery";

Parse.initialize(config.appId);
Parse.serverURL = config.url;

class AuthorSelection extends Component {
  constructor(props) {
    super(props);

    this.state = {
      authors: [],
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
    let storyId = this.props.storyId;

    if (currentUser) {
      if (items !== "") {
        this.setState({
          loading: true,
          mask: "block",
          error: ""
        });

        const response = await Parse.Cloud.run("addAuthor", {
          admin: currentUser.id,
          itemIds: items,
          storyId: storyId,
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

    let currentProject = this.props.projectId;
    let currentUser = Parse.User.current();
    if (currentUser) {
      this.setState({
        loading: true,
        mask: "block"
      });

      const response = await Parse.Cloud.run("getAuthorsList", {
        admin: currentUser.id,
        currentProject: currentProject
      });
      let projectFeed = {};
      projectFeed = await response.data;
      this.setState({
        authors: projectFeed.authors,
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
          <b>Adding New Authors</b>
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
          {this.state.authors.map(
            author => (
              // this.props.projectId !== project.id ? (
              <div
                className="medium-3 large-3 cell icons"
                data-id={author.id}
                data-name={author.name}
                key={author.id}
              >
                <center>
                  <p className="none" style={{ margin: "150px 80px" }}>
                    <b>No Artwork</b>
                  </p>
                </center>

                <span className="name_tag" style={{ position: "unset" }}>
                  <p className="sticker_name_text"> {author.name} </p>
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
      </>
    );
  }
}

export default AuthorSelection;
