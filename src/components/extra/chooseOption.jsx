import React, { Component } from "react";
import Parse from "parse";
import { parseSettings as config } from "../../js/serverSettings";
import history from "../../history";
import { faImage, faStickyNote } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

Parse.initialize(config.appId);
Parse.serverURL = config.url;

class ChooseOption extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: ""
    };
  }

  //   chooseImage(){
  //     document.getElementById("error_div").innerHTML =
  //      ;
  //   };

  chooseArtwork(item) {
    let storyId = this.props.storyId;
    let url = this.props.url;
    let status = this.props.status;
    let route = "story";
    return function() {
      history.push({
        pathname: "/card/create",
        search: "",
        state: {
          element: item,
          storyId: storyId,
          url: url,
          route: route,
          status: status
        }
      });
    };
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
        />
        <div className="medium-12 large-12 topList">
          <b>Choosing Option for Sticker Artwork for Story</b>
        </div>
        <div
          className="medium-12 large-12"
          id="error_div"
          style={{
            color: "red",
            fontWeight: 700,
            fontSize: "20px",
            background: "white"
          }}
        >
          <center>{this.state.error}</center>
        </div>
        <div className="medium-12 large-12 grid-x grid-padding-x align-spaced">
          <div
            className="medium-3 large-3 cell icons"
            onClick={this.chooseArtwork("setStoryArt")}
          >
            <center>
              <p className="none" style={{ margin: "150px 80px" }}>
                <FontAwesomeIcon
                  style={{ color: "#de3c35", margin: "10px", fontSize: "80px" }}
                  //   className="size"
                  icon={faStickyNote}
                />
              </p>
            </center>

            <span className="name_tag" style={{ position: "unset" }}>
              <p className="sticker_name_text"> Sticker Option </p>
            </span>
          </div>
          <div
            className="medium-3 large-3 cell icons"
            //   style={{ pointerEvents: "none" }}
            onClick={() => {
              this.setState({
                error: "This is still being worked on. Use the First Option"
              });
            }}
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
              <p className="sticker_name_text"> Image Option </p>
            </span>
          </div>
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

export default ChooseOption;
