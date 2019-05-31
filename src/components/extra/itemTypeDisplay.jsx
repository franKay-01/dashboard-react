import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";

class ItemTypeDisplay extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <button
        className="create_button"
        style={{ backgroundColor: "#f1f1f1" }}
        disabled
      >
        <p className="title button_font" style={{ color: "black" }}>
          &nbsp;
          <FontAwesomeIcon
            className=" display_icons"
            style={{ color: this.props.color }}
            icon={faCircle}
          />
          &nbsp; {this.props.name}
        </p>
      </button>
    );
  }
}

export default ItemTypeDisplay;
