import React, { Component } from "react";
import Parse from "parse";
import "../../App.css";
import "../../css/myStyle.css";
import TopHeader from "../../components/cards/header";
import Menu from "../../components/extra/menu";
import Loader from "../../components/extra/loader";
import type from "../../js/type";
import { parseSettings as config } from "../../js/serverSettings";
import history from "../../history";
import TextAreaDisplay from "../../components/extra/htmlTextAreaDisplay";

Parse.initialize(config.appId);
Parse.serverURL = config.url;

class StoryViewPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      storyType: "",
      storyItemId: "",
      storyItems: [],
      mask: "none",
      loading: false
    };
  }

  async componentDidMount() {
    let id = this.props.match.params.projectId;
    let storyItemId = this.props.match.params.storyItemId;
    var currentUser = Parse.User.current();
    console.log(storyItemId);
    if (currentUser) {
      this.setState({
        loading: true,
        mask: "block"
      });

      const response = await Parse.Cloud.run("getHtmlItems", {
        projectId: id,
        storyItemId: storyItemId
      });

      let storyfeed = {};

      if (response.responseCode === 0) {
        storyfeed = await response.data;

        let html = storyfeed.storyItems.content.html;

        let htmlArray = [];
        for (let i = 0; i < html.length; i++) {
          let _html = html[i];
          let _type = Object.keys(_html)[0];
          let _content = Object.values(_html)[0];

          htmlArray.push({
            type: parseInt(_type),
            content: _content,
            index: i
          });
        }

        this.setState({
          storyItemId: storyfeed.storyItems.id,
          storyItems: htmlArray,
          loading: false,
          mask: "none"
        });
      }
    } else {
      history.pushState("/");
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
        <div id="pageMask" style={{ display: this.state.mask }} />
        <div
          className="grid-x grid-padding-x align-left"
          style={{ margin: "50px" }}
        >
          <TopHeader />
        </div>
        <Loader loading={this.state.loading} />

        <div className="grid-x grid-padding-x align-spaced">
          <span className="medium-12 large-12 welcome_post">
            <b>Editing {this.state.storyType} Item Details</b>
          </span>
          <div className="medium-3 large-3 cell login_card">
            <Menu projectId={this.props.match.params.projectId} />
          </div>

          <div className="story_form medium-8 large-8 cell">
            {this.state.storyItems.map(storyItem => (
              <>
                {storyItem.type === type.STORY_ITEM.text ? (
                  <TextAreaDisplay
                    content={storyItem.content.text}
                    storyId={this.state.storyItemId}
                    storyType={storyItem.type}
                    itemIndex={storyItem.index}
                    storyItem="Text"
                  />
                ) : null}

                {storyItem.type === type.STORY_ITEM.italic ? (
                  <TextAreaDisplay
                    content={storyItem.content.text}
                    storyId={this.state.storyItemId}
                    storyType={storyItem.type}
                    itemIndex={storyItem.index}
                    storyItem="Italic"
                  />
                ) : null}
                {storyItem.type === type.STORY_ITEM.bold ? (
                  <TextAreaDisplay
                    content={storyItem.content.text}
                    storyId={this.state.storyItemId}
                    storyType={storyItem.type}
                    itemIndex={storyItem.index}
                    storyItem="Bold"
                  />
                ) : null}
                {storyItem.type === type.STORY_ITEM.italicBold ? (
                  <TextAreaDisplay
                    content={storyItem.content.text}
                    storyId={this.state.storyItemId}
                    storyType={storyItem.type}
                    itemIndex={storyItem.index}
                    storyItem="ItalicBold"
                  />
                ) : null}
                {storyItem.type === type.STORY_ITEM.color ? (
                  <TextAreaDisplay
                    content={storyItem.content.text}
                    color={storyItem.content.color}
                    storyId={storyItem.id}
                    storyType={storyItem.type}
                    itemIndex={storyItem.index}
                    storyItem="Color"
                  />
                ) : null}
              </>
            ))}
            <br />
            <br />
            <br />
            <span className="medium-12 large-12">
              <button
                type="button"
                id="btnCancel"
                className="preview_2"
                style={{ color: "#a46580", fontWeight: 700 }}
                onClick={this.handleReturnButton()}
              >
                Back
              </button>
            </span>
          </div>
        </div>
      </>
    );
  }
}

export default StoryViewPage;
