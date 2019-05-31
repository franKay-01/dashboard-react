import React, { Component } from "react";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import history from "../../history";

class StoryItemButtonCreation extends Component {
  constructor(props) {
    super(props);
  }

  handleClickButton(
    item,
    project,
    storyId,
    type,
    source,
    item_name,
    storyType,
    members,
    storyItemId
  ) {
    return function() {
      history.push({
        pathname: "/card/create",
        search: "",
        state: {
          element: item,
          projectId: project,
          storyId: storyId,
          type: type,
          source: source,
          name: item_name,
          storyType: storyType,
          members: members,
          storyItemId: storyItemId
        }
      });
    };
  }

  render() {
    return (
      <button
        className="create_button"
        onClick={this.handleClickButton(
          this.props.destination,
          this.props.project,
          this.props.storyId,
          this.props.type,
          this.props.source,
          this.props.name,
          this.props.storyType,
          this.props.members,
          this.props.storyItemId
        )}
      >
        <p className="title">
          <FontAwesomeIcon className="size" icon={faCircle} />
          {this.props.name}
        </p>
      </button>
    );
  }
}

export default StoryItemButtonCreation;
