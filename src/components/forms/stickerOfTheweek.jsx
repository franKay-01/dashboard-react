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

  async handleFinalSelection(items) {
    var currentUser = Parse.User.current();
    let id = this.props.projectId;

    if (items !== "") {
      this.setState({
        loading: true,
        mask: "block",
        error: ""
      });

      const response = await Parse.Cloud.run("setStickerFeed", {
        admin: currentUser.id,
        itemIds: items,
        projectId: id,
        source: "sticker",
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
  }

  handleSelectedSticker = event => {
    event.preventDefault();
    let items = "";
    let name = "";
    var currentUser = Parse.User.current();
    items = document.getElementById("stickerIds").value;
    name = document.getElementById("stickerDescription").value;

    if (currentUser) {
      if (name) {
        this.handleFinalSelection(items);
      } else {
        document.getElementById("error_div").innerHTML =
          "Check Sticker Description";
      }
    } else {
      history.push("/");
    }
  };

  handleChangeDescription(stickerId, destination, name) {
    return function() {
      history.push({
        pathname: "/card/create",
        search: "",
        state: {
          element: destination,
          stickerId: stickerId,
          name: name
        }
      });
    };
  }

  async componentDidMount() {
    $(function() {
      let selectedItems = [];
      let selectedDescription = [];
      let counter = 0;
      let word;
      $("#easySelectable").easySelectable({
        onSelected: function(el) {
          selectedItems.push(el.attr("data-id"));
          selectedDescription.push(el.attr("data-name"));
          el.css({
            // "border-color": "#00bcd4",
            "border-color": "#e57373",
            "border-width": "4px",
            "border-style": "solid"
          });
          counter = counter + 1;
          if (counter < 2) {
            $("#stickerIds").val(selectedItems);
            $("#stickerDescription").val(selectedDescription);
            $(".add-sticker-btn").removeAttr("disabled");
            word = "ADD " + counter + " STORY";
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
          selectedDescription = selectedDescription.filter(function(obj) {
            return obj !== el.attr("data-name");
          });
          el.css({ border: "none" });
          $("#stickerIds").val(selectedItems);
          $("#stickerDescription").val(selectedDescription);

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

    let currentUser = Parse.User.current();

    if (currentUser) {
      this.setState({
        loading: true,
        mask: "block"
      });

      const response = await Parse.Cloud.run("getStickerOfTheWeek", {
        admin: currentUser.id
      });

      let stickerfeed = {};
      stickerfeed = await response.data;

      this.setState({
        stickers: stickerfeed.stickers,
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
          <b>Setting Sticker Of The Week</b>
        </div>
        <div className="medium-4 large-4">
          <button
            className="waves-effect #e57373 red lighten-2 btn add-sticker-btn"
            style={{ position: "fixed", borderRadius: "10.8px" }}
            onClick={this.handleSelectedSticker}
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
                data-name={sticker.description}
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
                {sticker.description === "" ? (
                  <a
                    style={{
                      color: "red",
                      bottom: 0,
                      position: "absolute",
                      fontWeight: 800
                    }}
                    onClick={this.handleChangeDescription(
                      sticker.id,
                      "stickerDescription",
                      sticker.name
                    )}
                  >
                    Set/Change Description
                  </a>
                ) : null}
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

          <input
            type="hidden"
            id="stickerDescription"
            name="stickerDescription"
          />
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

export default StoryOfTheDay;
