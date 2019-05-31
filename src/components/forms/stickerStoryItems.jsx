import React, { Component } from "react";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import { green } from "@material-ui/core/colors";
import Loader from "../../components/extra/loader";
import Parse from "parse";
import { parseSettings as config } from "../../js/serverSettings";
import history from "../../history";
import $ from "jquery";

Parse.initialize(config.appId);
Parse.serverURL = config.url;

class StickerStoryItems extends Component {
  constructor(props) {
    super(props);

    this.state = {
      storyId: "",
      members: [],
      stickers: [],
      storyType: "",
      mask: "none",
      error: "",
      loading: false
    };
  }

  handleSelection = async event => {
    event.preventDefault();
    let items = "";
    let url = "";
    let currentUser = Parse.User.current();
    items = document.getElementById("stickerIds").value;
    url = document.getElementById("stickerUrl").value;

    if (currentUser) {
      if (items !== "") {
        this.setState({
          loading: true,
          mask: "block",
          error: ""
        });

        const response = await Parse.Cloud.run("setStickerItem", {
          admin: currentUser.id,
          storyId: this.props.storyId,
          stickerId: items,
          stickerUrl: url,
          members: this.state.members,
          loading: true,
          mask: "block",
          error: ""
        });

        if (response.responseCode === 0) {
          history.goBack();
        }
      } else {
        this.setState({
          error: "Select One Card"
        });
      }
    } else {
      history.push("/");
    }
  };

  async componentDidMount() {
    $(function() {
      let selectedItems = [];
      let selectedUrl = [];
      let counter = 0;
      let word;
      $("#easySelectable").easySelectable({
        onSelected: function(el) {
          selectedItems.push(el.attr("data-id"));
          selectedUrl.push(el.attr("data-url"));
          el.css({
            // "border-color": "#00bcd4",
            "border-color": "#e57373",
            "border-width": "4px",
            "border-style": "solid"
          });
          counter = counter + 1;
          if (counter < 2) {
            $("#stickerIds").val(selectedItems);
            $("#stickerUrl").val(selectedUrl);
            $(".add-sticker-btn").removeAttr("disabled");
            word = "ADD " + counter + " STICKER";
            word = word.bold();
            $(".add-sticker-btn").html(word);
          } else {
            let word =
              "You can not select more than one STICKER. Subsequent Additions will not be added to the list";
            word.bold();
            $("#error_div").html(word);
          }
        },
        onUnSelected: function(el) {
          selectedItems = selectedItems.filter(function(obj) {
            return obj !== el.attr("data-id");
          });
          selectedUrl = selectedUrl.filter(function(obj) {
            return obj !== el.attr("data-url");
          });
          el.css({ border: "none" });
          $("#stickerIds").val(selectedItems);
          $("#stickerUrl").val(selectedUrl);

          counter = counter - 1;
          word = "ADD " + counter + " STICKER";
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

    let currentUser = Parse.User.current();
    let storyId = this.props.storyId;
    let source = this.props.source;
    if (currentUser) {
      this.setState({
        loading: true,
        mask: "block"
      });

      console.log(currentUser.id);

      const response = await Parse.Cloud.run("getStoryItemStickers", {
        admin: currentUser.id,
        itemId: storyId,
        source: source
      });

      let storyfeed = {};

      if (response.responseCode === 0) {
        storyfeed = await response.data;

        this.setState({
          storyId: storyfeed.storyId,
          members: this.props.members,
          stickers: storyfeed.stickers,
          loading: false,
          mask: "none"
        });
      }
    } else {
      history.push("/");
    }
  }

  handleReturnButton() {
    return function() {
      history.goBack();
    };
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
          <b>Adding Sticker to StoryItem</b>
        </div>
        <div className="medium-4 large-4">
          <button
            className="waves-effect #e57373 red lighten-2 btn add-sticker-btn"
            style={{ position: "fixed", borderRadius: "10.8px" }}
            onClick={this.handleSelection}
          >
            <b>ADD STICKER</b>
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
          {this.state.stickers.length > 0 ? (
            this.state.stickers.map(sticker => (
              <div
                className="medium-3 large-3 cell icons"
                data-id={sticker.id}
                data-url={sticker.image}
                key={sticker.id}
              >
                <center>
                  {sticker.image !== "" ? (
                    <img width="200px" height="200px" src={sticker.image} />
                  ) : (
                    <p className="none" style={{ margin: "150px 80px" }}>
                      <b>No Artwork</b>
                    </p>
                  )}
                </center>

                <span className="name_tag" style={{ position: "unset" }}>
                  <p className="sticker_name_text"> {sticker.name} </p>
                </span>
              </div>
            ))
          ) : (
            <span className="medium-3 large-3 cell icons">
              <center>
                <p className="none" style={{ margin: "150px 80px" }}>
                  <b>No Stickers</b>
                </p>
              </center>
            </span>
          )}

          <input type="hidden" id="stickerUrl" name="stickerUrl" />
          <input type="hidden" id="stickerIds" name="itemIds" />
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

export default StickerStoryItems;
