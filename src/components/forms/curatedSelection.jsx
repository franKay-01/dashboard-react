import React, { Component } from "react";
import history from "../../history";
import Parse from "parse";
import { parseSettings as config } from "../../js/serverSettings";
import Loader from "../../components/extra/loader";
import "../../js/easySelectable";
import $ from "jquery";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ItemDisplayIndication from "../../components/extra/itemDisplayIndication";

Parse.initialize(config.appId);
Parse.serverURL = config.url;

class CuratedSelection extends Component {
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

  handleFinalSelection = async event => {
    event.preventDefault();
    let items = document.getElementById("stickerIds").value;
    var currentUser = Parse.User.current();
    let id = this.props.projectId;
    let packId = this.props.packId;

    if (currentUser) {
      if (items !== "") {
        this.setState({
          loading: true,
          mask: "block",
          error: ""
        });

        const response = await Parse.Cloud.run("setCuratedStickers", {
          admin: currentUser.id,
          itemIds: items,
          packId: packId,
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

          $("#stickerIds").val(selectedItems);
          $("#stickerDescription").val(selectedDescription);
          $(".add-sticker-btn").removeAttr("disabled");
          word = "ADD " + counter + " STICKERS";
          word = word.bold();
          $(".add-sticker-btn").html(word);
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
          word = "ADD " + counter + " STICKERS";
          word = word.bold();
          $("#error_div").html("");
          $(".add-sticker-btn").html(word);

          if (selectedItems.length === 0) {
            word = "ADD STICKERS";
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

      const response = await Parse.Cloud.run("getCuratedStickers", {
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
          <b>Adding Stickers To Curated Packs</b>
          <br />
          <button
            className="create_button"
            style={{ backgroundColor: "#f1f1f1" }}
            disabled
          >
            <p className="title button_font" style={{ color: "black" }}>
              &nbsp;{" "}
              <FontAwesomeIcon
                className=" display_icons"
                style={{ color: "#ffb12f" }}
                icon={faCircle}
              />
              &nbsp; FREE
            </p>
          </button>

          <button
            className="create_button"
            style={{ backgroundColor: "#f1f1f1" }}
            disabled
          >
            <p className="title button_font" style={{ color: "black" }}>
              &nbsp;{" "}
              <FontAwesomeIcon
                className=" display_icons"
                style={{ color: "#2fff2f" }}
                icon={faCircle}
              />
              &nbsp; PAID
            </p>
          </button>
          <br />
        </div>
        <div className="medium-4 large-4">
          <button
            className="waves-effect #e57373 red lighten-2 btn add-sticker-btn"
            style={{ position: "fixed", borderRadius: "10.8px" }}
            onClick={this.handleFinalSelection}
          >
            <b>ADD STICKERS</b>
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
          style={{ marginTop: "20px" }}
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
                {sticker.status === true ? (
                  <ItemDisplayIndication color="#2fff2f" />
                ) : (
                  <ItemDisplayIndication color="#ffb12f" />
                )}
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

export default CuratedSelection;
