import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";

class ItemDisplayIndication extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <FontAwesomeIcon
        className=" display_icons"
        style={{ color: this.props.color }}
        icon={faCircle}
      />
    );
  }
}

export default ItemDisplayIndication;
