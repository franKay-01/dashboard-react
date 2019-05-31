import React, { Component } from "react";
import Parse from "parse";
import "../../App.css";
import "../../css/myStyle.css";
import TopHeader from "../../components/cards/header";
import Menu from "../../components/extra/menu";
import NormalMenu from "../../components/extra/normalMenu";
import Loader from "../../components/extra/loader";
import type from "../../js/type";
import { parseSettings as config } from "../../js/serverSettings";
import history from "../../history";
import TextAreaDisplay from "../../components/extra/textAreaDisplay";
import ListDisplay from "../../components/extra/listDisplay";
import LinkDisplay from "../../components/extra/linkDisplay";
import SourceDisplay from "../../components/extra/sourceDisplay";
import HeadingDisplay from "../../components/extra/headingDisplay";
import QuoteDisplay from "../../components/extra/quoteDisplay";
import BackgroundColorDisplay from "../../components/extra/backgroundColorDisplay";
import HtmlDisplay from "../../components/extra/htmlDisplay";
import StickerItemDisplay from "../../components/extra/stickerItemDisplay";
import ImageItemDisplay from "../../components/extra/imageItemDisplay";

Parse.initialize(config.appId);
Parse.serverURL = config.url;

class StoryViewPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userId: "",
      storyType: "",
      userType: 0,
      storyItems: [],
      url: "",
      source: "",
      mask: "none",
      loading: false
    };
  }

  async componentDidMount() {
    let url = window.location.href;
    let id = this.props.match.params.projectId;
    let storyId = this.props.match.params.storyId;
    let currentUser = Parse.User.current();
    let accountType = currentUser.get("type");
    if (currentUser) {
      this.setState({
        loading: true,
        mask: "block"
      });

      const response = await Parse.Cloud.run("storyItemView", {
        projectId: id,
        storyId: storyId
      });

      let storyfeed = {};

      if (response.responseCode === 0) {
        storyfeed = await response.data;

        this.setState({
          userId: currentUser.id,
          userType: accountType,
          source: storyfeed.source,
          storyType: storyfeed.storyType,
          storyItems: storyfeed.storyItems,
          url: url,
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
            {this.state.userType === type.USER.normal ? (
              <NormalMenu userId={this.state.userId} />
            ) : (
              <Menu projectId={this.props.match.params.projectId} />
            )}
          </div>

          <div className="story_form medium-8 large-8 cell">
            {this.state.storyItems.map(storyItem => (
              <>
                {storyItem.type === type.STORY_ITEM.image ? (
                  <ImageItemDisplay
                    content={storyItem.contents}
                    storyId={storyItem.id}
                    url={this.state.url}
                    storyType={storyItem.type}
                    storyItem="Image"
                  />
                ) : null}
                {storyItem.type === type.STORY_ITEM.sticker ? (
                  <StickerItemDisplay
                    content={storyItem.contents}
                    storyId={storyItem.id}
                    url={this.state.url}
                    storyType={storyItem.type}
                    storyItem="Sticker"
                  />
                ) : null}
                {storyItem.type === type.STORY_ITEM.text ? (
                  <TextAreaDisplay
                    content={storyItem.contents.text}
                    storyId={storyItem.id}
                    url={this.state.url}
                    storyType={storyItem.type}
                    storyItem="Text"
                  />
                ) : null}
                {storyItem.type === type.STORY_ITEM.quote ? (
                  <QuoteDisplay
                    content={storyItem.contents.text}
                    storyId={storyItem.id}
                    url={this.state.url}
                    storyType={storyItem.type}
                    storyItem="Quote"
                  />
                ) : null}
                {storyItem.type === type.STORY_ITEM.italic ? (
                  <TextAreaDisplay
                    content={storyItem.contents.text}
                    storyId={storyItem.id}
                    url={this.state.url}
                    storyType={storyItem.type}
                    storyItem="Italic"
                  />
                ) : null}
                {storyItem.type === type.STORY_ITEM.bold ? (
                  <TextAreaDisplay
                    content={storyItem.contents.text}
                    storyId={storyItem.id}
                    url={this.state.url}
                    storyType={storyItem.type}
                    storyItem="Bold"
                  />
                ) : null}
                {storyItem.type === type.STORY_ITEM.italicBold ? (
                  <TextAreaDisplay
                    content={storyItem.contents.text}
                    storyId={storyItem.id}
                    url={this.state.url}
                    storyType={storyItem.type}
                    storyItem="ItalicBold"
                  />
                ) : null}
                {storyItem.type === type.STORY_ITEM.sideNote ? (
                  <TextAreaDisplay
                    content={storyItem.contents.text}
                    storyId={storyItem.id}
                    url={this.state.url}
                    storyType={storyItem.type}
                    storyItem="SideNote"
                  />
                ) : null}
                {storyItem.type === type.STORY_ITEM.greyArea ? (
                  <TextAreaDisplay
                    content={storyItem.contents.text}
                    storyId={storyItem.id}
                    storyType={storyItem.type}
                    storyItem="GreyArea"
                  />
                ) : null}
                {storyItem.type === type.STORY_ITEM.list ? (
                  <ListDisplay
                    content={storyItem.contents.text}
                    storyId={storyItem.id}
                    url={this.state.url}
                    storyType={storyItem.type}
                    storyItem="List"
                  />
                ) : null}
                {storyItem.type === type.STORY_ITEM.link ? (
                  <LinkDisplay
                    content={storyItem.contents}
                    storyId={storyItem.id}
                    url={this.state.url}
                    storyType={storyItem.type}
                    storyItem="Link"
                  />
                ) : null}
                {storyItem.type === type.STORY_ITEM.source ? (
                  <SourceDisplay
                    content={storyItem.contents}
                    storyId={storyItem.id}
                    url={this.state.url}
                    storyType={storyItem.type}
                    storyItem="Source"
                  />
                ) : null}
                {storyItem.type === type.STORY_ITEM.heading ? (
                  <HeadingDisplay
                    content={storyItem.contents}
                    storyId={storyItem.id}
                    url={this.state.url}
                    storyType={storyItem.type}
                    storyItem="Heading"
                  />
                ) : null}
                {storyItem.type === type.STORY_ITEM.backgroundColor ? (
                  <BackgroundColorDisplay
                    content={storyItem.contents}
                    storyId={storyItem.id}
                    storyType={storyItem.type}
                    url={this.state.url}
                    storyItem="BackgroundColor"
                  />
                ) : null}
                {storyItem.type === type.STORY_ITEM.html ? (
                  <HtmlDisplay
                    content={storyItem.contents}
                    storyItemId={storyItem.id}
                    url={this.state.url}
                    storyId={this.props.match.params.storyId}
                    storyType={storyItem.type}
                    storyItem="HTML"
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
