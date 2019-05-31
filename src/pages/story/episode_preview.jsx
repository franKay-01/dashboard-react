import React, { Component } from "react";
import Parse from "parse";
// import "../../App.css";
import "../../css/previewStyle.css";
import thankyou from "../../assets/thank-you.png";
import type from "../../js/type";
import { parseSettings as config } from "../../js/serverSettings";
import history from "../../history";
import { faQuoteLeft, faQuoteRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
Parse.initialize(config.appId);
Parse.serverURL = config.url;

class EpisodePreviewPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      storyName: "",
      topColor: "#fff",
      bottomColor: "#000",
      sticker: "",
      storyType: "",
      storyItemId: "",
      storyItems: [],
      htmlItems: [],
      mask: "none",
      loading: false
    };
  }

  async componentDidMount() {
    let storyId = this.props.match.params.storyId;
    var currentUser = Parse.User.current();

    if (currentUser) {
      this.setState({
        loading: true,
        mask: "block"
      });

      const response = await Parse.Cloud.run("previewEpisode", {
        storyId: storyId
      });

      let storyfeed = {};

      if (response.responseCode === 0) {
        storyfeed = await response.data;

        console.log(JSON.stringify(storyfeed));
        let storyArray = storyfeed.storyItems;
        let htmlArray = [];

        for (let j = 0; j < storyArray.length; j++) {
          if (storyArray[j].type === type.STORY_ITEM.html) {
            let html = storyArray[j].contents.html;

            for (let i = 0; i < html.length; i++) {
              let _html = html[i];
              let _type = Object.keys(_html)[0];
              let _content = Object.values(_html)[0];

              htmlArray.push({
                id: storyArray[j].id,
                type: parseInt(_type),
                content: _content
              });
            }
          }
        }

        console.log("HTML CONTENT " + JSON.stringify(htmlArray));

        this.setState({
          storyType: storyfeed.storyType,
          storyName: storyfeed.story,
          topColor: storyfeed.topColor,
          bottomColor: storyfeed.bottomColor,
          sticker: storyfeed.sticker,
          storyItems: storyfeed.storyItems,
          htmlItems: htmlArray,
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
        <div className="grid-container- lightPinkBg">
          <div
            id="bannerImg"
            style={{
              backgroundImage:
                "linear-gradient(to bottom, " +
                this.state.topColor +
                "," +
                this.state.bottomColor +
                ")"
            }}
          >
            <div id="bannerPattern">
              <div className="small-12">
                {this.state.sticker !== "" ? (
                  <img src={this.state.sticker} alt="Banner" />
                ) : (
                  <p className="none" style={{ textAlign: "center" }}>
                    <b>No Artwork</b>
                  </p>
                )}
                <h1>{this.state.storyName}</h1>
              </div>
            </div>
          </div>
          {this.state.storyItems.map(storyItem => (
            <>
              {storyItem.type === type.STORY_ITEM.text ? (
                <div className="small-12 grid-x">
                  <div className="medium-1 hide-for-small" />
                  <div className="medium-10 small-12">
                    <div className="content-section padding-top gray-text">
                      <p>{storyItem.contents.text}</p>
                    </div>
                  </div>
                  <div className="medium-1 hide-for-small" />
                </div>
              ) : null}
              {storyItem.type === type.STORY_ITEM.quote ? (
                <div className="small-12 grid-x">
                  <div className="medium-1 hide-for-small" />
                  <div className="medium-10 small-12">
                    <div className="content-section padding-top gray-text">
                      <FontAwesomeIcon
                        style={{ height: "2em" }}
                        icon={faQuoteLeft}
                      />
                      &nbsp;
                      <span style={{ fontSize: "20px" }}>
                        <b>{storyItem.contents.text}</b>
                      </span>
                      &nbsp;
                      <FontAwesomeIcon
                        style={{ height: "2em" }}
                        icon={faQuoteRight}
                      />
                    </div>
                  </div>
                  <div className="medium-1 hide-for-small" />
                </div>
              ) : null}
              {storyItem.type === type.STORY_ITEM.divider ? (
                <div className="small-12 grid-x">
                  <div className="small-1" />
                  <div className="small-10">
                    <div className="divider purple-text" />
                  </div>
                  <div className="small-1" />
                </div>
              ) : null}
              {storyItem.type === type.STORY_ITEM.italic ? (
                <div className="small-12 grid-x">
                  <div className="medium-1 hide-for-small" />
                  <div className="medium-10 small-12">
                    <div className="content-section padding-top gray-text">
                      <p>
                        <i>{storyItem.contents.text}</i>
                      </p>
                    </div>
                  </div>
                  <div className="medium-1 hide-for-small" />
                </div>
              ) : null}
              {storyItem.type === type.STORY_ITEM.bold ? (
                <div className="small-12 grid-x">
                  <div className="medium-1 hide-for-small" />
                  <div className="medium-10 small-12">
                    <div className="content-section padding-top gray-text">
                      <p>
                        <strong>{storyItem.contents.text}</strong>
                      </p>
                    </div>
                  </div>
                  <div className="medium-1 hide-for-small" />
                </div>
              ) : null}
              {storyItem.type === type.STORY_ITEM.italicBold ? (
                <div className="small-12 grid-x">
                  <div className="medium-1 hide-for-small" />
                  <div className="medium-10 small-12">
                    <div className="content-section padding-top gray-text">
                      <p>
                        <strong>
                          <i>{storyItem.contents.text}</i>
                        </strong>
                      </p>
                    </div>
                  </div>
                  <div className="medium-1 hide-for-small" />
                </div>
              ) : null}
              {storyItem.type === type.STORY_ITEM.sideNote ? (
                <div className="small-12 grid-x">
                  <div className="medium-1 hide-for-small" />
                  <div className="medium-10 small-12">
                    <div className="content-section padding-top gray-text">
                      <p
                        style={{
                          backgroundColor: "#e2dede",
                          borderLeft: "2px solid black",
                          padding: "10px"
                        }}
                      >
                        {storyItem.contents.text}
                      </p>
                    </div>
                  </div>
                  <div className="medium-1 hide-for-small" />
                </div>
              ) : null}
              {storyItem.type === type.STORY_ITEM.greyArea ? (
                <div className="small-12 grid-x">
                  <div className="medium-1 hide-for-small" />
                  <div className="medium-10 small-12">
                    <div className="content-section padding-top gray-text">
                      <p
                        style={{ backgroundColor: "#e2dede", padding: "10px" }}
                      >
                        {storyItem.contents.text}
                      </p>
                    </div>
                  </div>
                  <div className="medium-1 hide-for-small" />
                </div>
              ) : null}
              {storyItem.type === type.STORY_ITEM.list ? (
                <div className="small-12 grid-x">
                  <div className="medium-1 hide-for-small" />
                  <div className="medium-10 small-12">
                    <div className="content-section padding-top gray-text">
                      <ul>
                        {storyItem.contents.text.map(list => (
                          <li key={list}>{list}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="medium-1 hide-for-small" />
                </div>
              ) : null}
              {storyItem.type === type.STORY_ITEM.link ? (
                <div className="small-12 grid-x">
                  <div className="medium-1 hide-for-small" />
                  <div className="medium-10 small-12">
                    <div className="content-section padding-top gray-text">
                      <h3>Name: {storyItem.contents.name}</h3>

                      <h3>URL: {storyItem.contents.url}</h3>
                    </div>
                  </div>
                  <div className="medium-1 hide-for-small" />
                </div>
              ) : null}
              {storyItem.type === type.STORY_ITEM.source ? (
                <div className="small-12 grid-x">
                  <div className="medium-1 hide-for-small" />
                  <div className="medium-10 small-12">
                    <div className="content-section padding-top gray-text">
                      <p>Name: {storyItem.contents.name}</p>

                      <p>Description: {storyItem.contents.description}</p>

                      <p>Link: {storyItem.contents.link}</p>
                    </div>
                  </div>
                  <div className="medium-1 hide-for-small" />
                </div>
              ) : null}
              {storyItem.type === type.STORY_ITEM.heading ? (
                <div className="small-12 grid-x">
                  <div className="medium-1 hide-for-small" />
                  <div className="medium-10 small-12">
                    <div className="content-section padding-top gray-text">
                      <h4>Heading: {storyItem.contents.heading}</h4>

                      <p>Content: {storyItem.contents.text}</p>
                    </div>
                  </div>
                  <div className="medium-1 hide-for-small" />
                </div>
              ) : null}
              {storyItem.type === type.STORY_ITEM.backgroundColor ? (
                <div className="small-12 grid-x">
                  <div className="medium-1 hide-for-small" />
                  <div className="medium-10 small-12">
                    <div className="content-section padding-top gray-text">
                      <h3>Background Color</h3>
                      {parseInt(storyItem.contents.type) ===
                      type.FORMAT_TYPE.regular ? (
                        <>
                          <div
                            style={{
                              backgroundColor: storyItem.contents.color,
                              textAlign: "center",
                              height: "250px"
                            }}
                          >
                            <p>
                              Test Content is Here. The best is at it again. You
                              will forever be amazed.
                            </p>
                          </div>
                        </>
                      ) : null}
                      {parseInt(storyItem.contents.type) ===
                      type.FORMAT_TYPE.gradient ? (
                        <>
                          <div
                            style={{
                              backgroundImage:
                                "linear-gradient(to bottom, " +
                                storyItem.contents.topColor +
                                "," +
                                storyItem.contents.bottomColor +
                                ")",
                              textAlign: "center",
                              height: "250px"
                            }}
                          >
                            <p>
                              Test Content is Here. The best is at it again. You
                              will forever be amazed.
                            </p>
                          </div>
                        </>
                      ) : null}
                    </div>
                  </div>
                  <div className="medium-1 hide-for-small" />
                </div>
              ) : null}
              {storyItem.type === type.STORY_ITEM.html ? (
                <div className="small-12 grid-x">
                  <div className="medium-1 hide-for-small" />
                  <div className="medium-10 small-12">
                    <div className="content-section padding-top gray-text">
                      <p>
                        {this.state.htmlItems.map(item =>
                          storyItem.id === item.id ? (
                            <>
                              {item.type === 0 ? (
                                <span>{item.content.text}</span>
                              ) : null}
                              {item.type === 5 ? (
                                <span>
                                  <i>{item.content.text}</i>&nbsp;
                                </span>
                              ) : null}
                              {item.type === 6 ? (
                                <span>
                                  <b>{item.content.text}</b>&nbsp;
                                </span>
                              ) : null}
                              {item.type === 8 ? (
                                <span>
                                  <b>
                                    <i>{item.content.text}</i>&nbsp;
                                  </b>
                                  &nbsp;
                                </span>
                              ) : null}
                              {item.type === 14 ? (
                                <span style={{ color: item.content.color }}>
                                  {item.content.text}&nbsp;
                                </span>
                              ) : null}
                            </>
                          ) : null
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="medium-1 hide-for-small" />
                </div>
              ) : null}
            </>
          ))}
        </div>

        <div id="newsletter" className="padding-top">
          <div className="deepPinkBg grid-container">
            <div className="grid-container grid-x align-middle">
              <div className="medium-6 small-12">
                <h1>Latest Stories</h1>
                <h3>Sign up to our newsletter to get the latest stories</h3>
                <p>
                  Your Information will never be shared with any third party
                </p>
              </div>
              <div className="medium-6 small-12">
                <form method="post" action="/newsletter/email">
                  <label>
                    <h2>Please enter your email</h2>
                    <input type="email" placeholder="Your Email" name="email" />
                  </label>

                  <input
                    id="submit-btn"
                    type="submit"
                    className="button"
                    value="Submit"
                  />
                </form>
              </div>
            </div>
          </div>
        </div>
        <div className="padding-top" />

        <div id="newsletter-thank-you" className="padding-top">
          <div className="deepPinkBg grid-container">
            <div className="grid-container grid-x align-middle">
              <div className="small-1" />
              <div className="small-10 grid-x">
                <div className="large-4 large-offset-4 small-6 small-offset-3 grid-x text-center align-center">
                  <div className="cell small-4">
                    <h1
                      style={{
                        fontFamily: "Montserrat",
                        letterSpacing: "-2px",
                        fontWeight: 800,
                        color: "#646464",
                        paddingTop: "13%",
                        marginLeft: "-40%"
                      }}
                    >
                      Thank
                    </h1>
                  </div>
                  <div className="small-4">
                    <img
                      style={{ width: "100%" }}
                      src={thankyou}
                      alt="Thank You"
                    />
                  </div>
                  <div className="small-4">
                    <h1
                      style={{
                        fontFamily: "Montserrat",
                        letterSpacing: "-2px",
                        fontWeight: 800,
                        color: "#646464",
                        paddingTop: "13%",
                        marginLeft: "-3%"
                      }}
                    >
                      YOU!
                    </h1>
                  </div>
                </div>
                <div className="large-4 large-offset-4 small-6 small-offset-3">
                  <input
                    id="continue-btn"
                    type="submit"
                    className="button"
                    value="Continue"
                  />
                </div>
              </div>
              <div className="small-1" />
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default EpisodePreviewPage;
