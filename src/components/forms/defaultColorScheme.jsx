import React, { Component } from "react";
import history from "../../history";
import Parse from "parse";
import { parseSettings as config } from "../../js/serverSettings";
import Loader from "../../components/extra/loader";

import type from "../../js/type";
import DefaultColorCard from "../extra/defaultColorCards";

Parse.initialize(config.appId);
Parse.serverURL = config.url;

class DefaultColorSelection extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: "",
      topColor: "",
      bottomColor: "",
      art: "",
      loading: false,
      mask: "none",
      error: "",
      displayColorPicker: false,
      displayColorPicker_2: false
    };
  }

  handleReturnButton() {
    return function() {
      history.goBack();
    };
  }

  async componentDidMount() {
    let id = this.props.projectId;
    let topColor = this.props.topColor;
    let bottomColor = this.props.bottomColor;
    let art = this.props.art;
    let title = this.props.title;
    var currentUser = Parse.User.current();

    if (currentUser) {
      this.setState({
        topColor: topColor,
        bottomColor: bottomColor,
        art: art,
        title: title
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
        <div className="medium-12 large-12 topList">
          <b>Edit {this.state.title} Story Color Scheme</b>
        </div>
        <center style={{ marginBottom: "20px" }}>
          <b
            style={{
              color: "#db4d6d",
              fontSize: "20px",
              fontWeight: 700,
              background: "white"
            }}
          >
            Clicking any of the CARDS will change the COLOR SCHEME!!
          </b>
        </center>

        <div className="small-12 medium-12 large-12 cell grid-x grid-padding-x align-spaced">
          <DefaultColorCard
            art={this.state.art}
            topColor={type.COLOR_TYPE.color1.topColor}
            bottomColor={type.COLOR_TYPE.color1.bottomColor}
            number={1}
            storyId={this.props.storyId}
          />
          <DefaultColorCard
            art={this.state.art}
            topColor={type.COLOR_TYPE.color2.topColor}
            bottomColor={type.COLOR_TYPE.color2.bottomColor}
            number={2}
            storyId={this.props.storyId}
          />
          <DefaultColorCard
            art={this.state.art}
            topColor={type.COLOR_TYPE.color3.topColor}
            bottomColor={type.COLOR_TYPE.color3.bottomColor}
            number={3}
            storyId={this.props.storyId}
          />
          <DefaultColorCard
            art={this.state.art}
            topColor={type.COLOR_TYPE.color4.topColor}
            bottomColor={type.COLOR_TYPE.color4.bottomColor}
            number={4}
            storyId={this.props.storyId}
          />
          <DefaultColorCard
            art={this.state.art}
            topColor={type.COLOR_TYPE.color5.topColor}
            bottomColor={type.COLOR_TYPE.color5.bottomColor}
            number={5}
            storyId={this.props.storyId}
          />
          <DefaultColorCard
            art={this.state.art}
            topColor={type.COLOR_TYPE.color6.topColor}
            bottomColor={type.COLOR_TYPE.color6.bottomColor}
            number={6}
            storyId={this.props.storyId}
          />
          <DefaultColorCard
            art={this.state.art}
            topColor={type.COLOR_TYPE.color7.topColor}
            bottomColor={type.COLOR_TYPE.color7.bottomColor}
            number={7}
            storyId={this.props.storyId}
          />
        </div>
        <span>
          <button
            type="button"
            id="btnCancel"
            className="cancel"
            style={{ color: "#a46580", fontWeight: 700 }}
            onClick={this.handleReturnButton()}
          >
            Back
          </button>
        </span>
      </>
    );
  }
}

export default DefaultColorSelection;
