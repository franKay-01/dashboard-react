import React, { Component } from "react";
import history from "../../history";
import Parse from "parse";
import { parseSettings as config } from "../../js/serverSettings";
import Loader from "../../components/extra/loader";
import "../../js/easySelectable";
import $ from "jquery";

Parse.initialize(config.appId);
Parse.serverURL = config.url;

class StoryOfTheDay extends Component {
  constructor(props) {
    super(props);

    this.state = {
      stories: [],
      stickers: [],
      loading: false,
      mask: "none",
      error: ""
    };
  }

  handleReturnButton() {
    return function() {
      history.goBack();
    };
  }

  handleSelectedStory = async event => {
    event.preventDefault();
    let items = "";
    var currentUser = Parse.User.current();
    items = document.getElementById("stickerIds").value;
    let storyId = this.props.storyId;
    let id = this.props.projectId;

    if (currentUser) {
      if (items !== "") {
        this.setState({
          loading: true,
          mask: "block",
          error: ""
        });

        const response = await Parse.Cloud.run("setStoryFeed", {
          admin: currentUser.id,
          itemIds: items,
          storyId: storyId,
          projectId: id,
          source: "story",
          loading: true,
          mask: "block",
          error: ""
        });

        if (response.responseCode === 0) {
          history.goBack();
        }
      } else {
        this.setState({
          error: "You Must Select One or more Story Item"
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
          if (counter < 2) {
            $("#stickerIds").val(selectedItems);
            $(".add-sticker-btn").removeAttr("disabled");
            word = "ADD " + counter + " STORY";
            word = word.bold();
            $(".add-sticker-btn").html(word);
          } else {
            let word =
              "You can not select more than one STORY. Subsequent Additions will not be added to the list";
            word.bold();
            $("#error_div").html(word);
          }
        },
        onUnSelected: function(el) {
          selectedItems = selectedItems.filter(function(obj) {
            return obj !== el.attr("data-id");
          });
          el.css({ border: "none" });
          $("#stickerIds").val(selectedItems);

          counter = counter - 1;
          word = "ADD " + counter + " STORY";
          word = word.bold();
          $("#error_div").html("");
          $(".add-sticker-btn").html(word);

          if (selectedItems.length === 0) {
            word = "ADD STORY";
            word = word.bold();

            $(".add-sticker-btn").attr("disabled", true);
            $(".add-sticker-btn").html(word);
          }
        }
      });
    });

    let id = this.props.projectId;
    let currentUser = Parse.User.current();

    if (currentUser) {
      this.setState({
        loading: true,
        mask: "block"
      });

      const response = await Parse.Cloud.run("getStoryOfTheDay", {
        admin: currentUser.id,
        projectId: id
      });

      let storyfeed = {};
      storyfeed = await response.data;

      this.setState({
        stories: storyfeed.stories,
        stickers: storyfeed.stickers,
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
        <div className="medium-8 large-8 topList">
          <b>Setting Story Of The Week</b>
        </div>
        <div className="medium-4 large-4">
          <button
            type="submit"
            className="waves-effect #e57373 red lighten-2 btn add-sticker-btn"
            style={{ position: "fixed", borderRadius: "10.8px" }}
            onClick={this.handleSelectedStory}
          >
            <b>ADD STORY</b>
          </button>
        </div>
        <div
          id="error_div"
          style={{
            color: "red",
            fontWeight: 700,
            fontSize: "20px",
            background: "white"
          }}
        >
          {this.state.error}
        </div>
        <div
          id="easySelectable"
          className="small-12 medium-12 large-12 cell grid-x grid-padding-x align-spaced"
        >
          {this.state.stories.length > 0 ? (
            this.state.stories.map(story =>
              this.state.stickers.map(sticker =>
                story.id === sticker.story ? (
                  <>
                    <div
                      className="medium-3 large-3 cell icons"
                      data-id={story.id}
                      data-name={story.title}
                      key={story.id}
                    >
                      <center>
                        {sticker.image !== "" ? (
                          <img
                            width="200px"
                            height="200px"
                            src={sticker.image}
                          />
                        ) : (
                          <p className="none" style={{ margin: "150px 80px" }}>
                            <b>No Artwork</b>
                          </p>
                        )}
                      </center>

                      <span className="name_tag" style={{ position: "unset" }}>
                        <p className="sticker_name_text"> {story.title} </p>
                      </span>
                    </div>
                  </>
                ) : null
              )
            )
          ) : (
            <span className="medium-3 large-3 cell icons">
              <center>
                <p className="none" style={{ margin: "150px 80px" }}>
                  <b>No Story</b>
                </p>
              </center>
            </span>
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
            className="cancel_2"
            onClick={this.handleReturnButton()}
          >
            Back
          </button>
        </span>
      </>
    );
  }
}

export default StoryOfTheDay;
