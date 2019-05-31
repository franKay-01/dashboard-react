import React, { Component } from "react";
import history from "../../history";
import Parse from "parse";
import { parseSettings as config } from "../../js/serverSettings";
import Loader from "../../components/extra/loader";
import $ from "jquery";
import {
  faCameraRetro,
  faImage,
  faKeyboard,
  faFolderOpen
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type from "../../js/type";

Parse.initialize(config.appId);
Parse.serverURL = config.url;

class RejectItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      itemId: "",
      name: "",
      currentType: "",
      loading: true,
      mask: "block"
    };
  }

  componentDidMount() {
    let itemId = this.props.itemId;
    let name = this.props.name;
    let currentUser = Parse.User.current();
    let currentType = this.props.currentType;

    if (currentUser) {
      this.setState({
        itemId: itemId,
        name: name,
        currentType: currentType,
        loading: false,
        mask: "none"
      });
    }

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

          console.log("INSIDE");
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
          $("#error_div").html("");
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
  }

  handleSelectedOrder = async event => {
    event.preventDefault();
    let items = "";
    let currentUser = Parse.User.current();
    let accountType = currentUser.get("type");
    items = document.getElementById("stickerIds").value;
    let itemId = this.props.itemId;
    let currentType = this.props.currentType;
    let reportTitle = "Report for " + this.state.name;
    if (currentUser) {
      if (accountType === type.USER.ultimate) {
        if (items !== "") {
          this.setState({
            loading: true,
            mask: "block",
            error: ""
          });

          const response = await Parse.Cloud.run("addReports", {
            selected: items,
            itemId: itemId,
            reportTitle: reportTitle,
            currentType: currentType,
            loading: true,
            mask: "block",
            error: ""
          });

          if (response.responseCode === 0) {
            history.goBack();
          }
        } else {
          this.setState({
            error: "You Must Select One or more Reasons"
          });
        }
      } else {
        this.setState({
          error: "You do not have permission to submit this report"
        });
      }
    } else {
      history.push("/");
    }
  };

  handleReturnButton() {
    return function() {
      history.goBack();
    };
  }

  render() {
    return (
      <>
        <div id="pageMask" style={{ display: this.state.mask }} />
        <span
          className="medium-12 large-12 welcome_post"
          style={{ marginBottom: "20px" }}
        >
          <center>
            <b>
              Rejecting <b style={{ color: "#ec8c2a" }}>{this.state.name}</b>{" "}
              {this.state.currentType}
            </b>
          </center>
          <Loader loading={this.state.loading} />
        </span>

        <div className="medium-8 large-8 topList">
          <b>Selecting Reasons!</b>
          <br />
        </div>
        <div className="medium-4 large-4">
          <button
            type="submit"
            className="waves-effect #e57373 red lighten-2 btn add-sticker-btn"
            style={{ position: "fixed", borderRadius: "10.8px" }}
            onClick={this.handleSelectedOrder}
          >
            <b>ADD SELECTED</b>
          </button>
        </div>
        <input
          type="hidden"
          className="sticker_id"
          id="stickerIds"
          name="itemIds"
          onChange={this.handleSelectedIds}
        />
        <div
          id="easySelectable"
          className="small-12 medium-12 large-12 cell grid-x grid-padding-x align-spaced"
        >
          <div
            className="medium-3 large-3 cell icons"
            data-id={1}
            data-name={"artwork"}
            key={1}
          >
            <center>
              <p className="none" style={{ margin: "150px 80px" }}>
                <FontAwesomeIcon
                  style={{ color: "#de3c35", margin: "10px", fontSize: "80px" }}
                  //   className="size"
                  icon={faCameraRetro}
                />
              </p>
            </center>
            <span className="name_tag" style={{ position: "unset" }}>
              <p className="sticker_name_text"> Artwork Problem </p>
            </span>
          </div>
          <div
            className="medium-3 large-3 cell icons"
            data-id={2}
            data-name={"stickers"}
            key={2}
          >
            <center>
              <p className="none" style={{ margin: "150px 80px" }}>
                <FontAwesomeIcon
                  style={{ color: "#de3c35", margin: "10px", fontSize: "80px" }}
                  //   className="size"
                  icon={faImage}
                />
              </p>
            </center>
            <span className="name_tag" style={{ position: "unset" }}>
              <p className="sticker_name_text"> Stickers Problem </p>
            </span>
          </div>
          <div
            className="medium-3 large-3 cell icons"
            data-id={3}
            data-name={"names"}
            key={3}
          >
            <center>
              <p className="none" style={{ margin: "150px 80px" }}>
                <FontAwesomeIcon
                  style={{ color: "#de3c35", margin: "10px", fontSize: "80px" }}
                  //   className="size"
                  icon={faKeyboard}
                />
              </p>
            </center>
            <span className="name_tag" style={{ position: "unset" }}>
              <p className="sticker_name_text"> Names Problem </p>
            </span>
          </div>
          <div
            className="medium-3 large-3 cell icons"
            data-id={4}
            data-name={"names"}
            key={4}
          >
            <center>
              <p className="none" style={{ margin: "150px 80px" }}>
                <FontAwesomeIcon
                  style={{ color: "#de3c35", margin: "10px", fontSize: "80px" }}
                  //   className="size"
                  icon={faFolderOpen}
                />
              </p>
            </center>
            <span className="name_tag" style={{ position: "unset" }}>
              <p className="sticker_name_text"> Story Content </p>
            </span>
          </div>
        </div>
        <span style={{ background: "white" }}>
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

export default RejectItem;
