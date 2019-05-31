import React, { Component } from "react";
import history from "../../history";
import type from "../../js/type";
import {
  faCircle,
  faExclamationCircle
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class ClickSelection extends Component {
  constructor(props) {
    super(props);
  }

  handleClickButton(item) {
    let storyId = this.props.storyId;
    let itemType = "Story";
    return function() {
      history.push({
        pathname: "/card/create",
        search: "",
        state: {
          element: item,
          itemId: storyId,
          itemType: itemType
        }
      });
    };
  }

  render() {
    return (
      <>
        {this.props.type === type.STORY_TYPE.short_stories ||
        this.props.type === type.STORY_TYPE.story ? (
          <>
            <div className="story_icons">
              {this.props.feedId !== "" ? (
                <>
                  <span>
                    STORY OF THE WEEK{" "}
                    {this.props.feedId === this.props.storyId ? (
                      <FontAwesomeIcon
                        style={{ color: "#0f9d58" }}
                        icon={faCircle}
                      />
                    ) : (
                      <FontAwesomeIcon
                        style={{ color: "grey" }}
                        icon={faCircle}
                      />
                    )}
                  </span>
                </>
              ) : null}

              {this.props.reports === true ? (
                <a
                  style={{ color: "red", float: "right" }}
                  onClick={this.handleClickButton("checkReports")}
                >
                  <b style={{ color: "red" }}>
                    Reports{" "}
                    <FontAwesomeIcon
                      style={{ color: "red" }}
                      icon={faExclamationCircle}
                    />
                  </b>
                </a>
              ) : (
                <a
                  style={{ color: "red", float: "right" }}
                  onClick={this.handleClickButton("checkReports")}
                >
                  <b style={{ color: "red" }}>Reports</b>
                </a>
              )}
            </div>

            <a
              style={{ float: "right" }}
              href={"/storyPreview/" + this.props.storyId}
              target="_blank"
            >
              <button
                className="create_button add_catalogue"
                style={{ background: "transparent" }}
              >
                <p className="preview"> PREVIEW STORY</p>
              </button>
            </a>
          </>
        ) : null}

        {this.props.type === type.STORY_TYPE.chat_single ? (
          <a
            target="_blank"
            href="/preview/chats/<%= story.id %>/<%= projectItem.id %>/chat_group"
            style={{ float: "right" }}
          >
            <button
              className="create_button add_catalogue"
              style={{ background: "transparent" }}
            >
              <p className="preview"> PREVIEW CHATS</p>
            </button>
          </a>
        ) : null}

        {this.props.type === type.STORY_TYPE.episodes ||
        this.props.type === type.STORY_TYPE.chat_group_episode ||
        this.props.type === type.STORY_TYPE.chat_single_episode ? (
          <a
            href="/episodes/view/<%= story.id %>/<%= projectItem.id %>"
            className="preview"
          >
            View Episodes
          </a>
        ) : null}
      </>
    );
  }
}

export default ClickSelection;
