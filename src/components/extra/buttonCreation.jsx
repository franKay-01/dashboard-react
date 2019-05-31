import React, { Component } from "react";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import history from "../../history";

class ButtonCreation extends Component {
  constructor(props) {
    super(props);
  }

  handleClickButton(item, project) {
    return function() {
      history.push({
        pathname: "/card/create",
        search: "",
        state: { element: item, projectId: project }
      });
    };
  }

  render() {
    return (
      <button
        className="create_button"
        onClick={this.handleClickButton(
          this.props.destination,
          this.props.project
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

export default ButtonCreation;
