import React, { Component } from "react";
import Parse from "parse";
import history from "../../history";
import { parseSettings as config } from "../../js/serverSettings";

Parse.initialize(config.appId);
Parse.serverURL = config.url;

class DefaultColorCards extends Component {
  constructor(props) {
    super(props);
  }

  async handleChangeColor(topColor, bottomColor) {
    let currentUser = Parse.User.current();
    let storyId = this.props.storyId;

    console.log(storyId);
    if (currentUser) {
      this.setState({
        loading: true,
        mask: "block",
        error: ""
      });

      const response = await Parse.Cloud.run("changeColorScheme", {
        admin: currentUser.id,
        topColor: topColor,
        bottomColor: bottomColor,
        storyId: storyId,
        loading: true,
        mask: "block"
      });

      if (response.responseCode === 0) {
        history.goBack();
      }
    } else {
      history.push("/");
    }
  }

  sumbitColorChange = async event => {
    event.preventDefault();
    let currentUser = Parse.User.current();
    let topColor = this.state.topColor;
    let bottomColor = this.state.bottomColor;
    let storyId = this.props.storyId;
    console.log(storyId);
    if (currentUser) {
      this.setState({
        loading: true,
        mask: "block",
        error: ""
      });

      const response = await Parse.Cloud.run("changeColorScheme", {
        admin: currentUser.id,
        topColor: topColor,
        bottomColor: bottomColor,
        storyId: storyId,
        loading: true,
        mask: "block"
      });

      if (response.responseCode === 0) {
        let colorDetails = response.data;
        this.setState({
          topColor: colorDetails.topColor,
          bottomColor: colorDetails.bottomColor,
          loading: false,
          mask: "none"
        });
      }
    }
  };

  render() {
    return (
      <div
        onClick={() =>
          this.handleChangeColor(this.props.topColor, this.props.bottomColor)
        }
        className="medium-3 large-3 cell icons"
        id="story_color"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, " +
            this.props.topColor +
            "," +
            this.props.bottomColor +
            ")"
        }}
      >
        <span class="display_icons" id="circle" style={{ color: "#0a0a0a" }}>
          <b>{this.props.number}</b>
        </span>
        {this.props.art !== "" ? (
          <img
            className="card-image-size"
            src={this.props.art}
            width="200px"
            height="200px"
          />
        ) : (
          <p className="none" style={{ margin: "150px 80px" }}>
            <b>No Artwork</b>
          </p>
        )}
      </div>
    );
  }
}

export default DefaultColorCards;
