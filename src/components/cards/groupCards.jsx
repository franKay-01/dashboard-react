import React, { Component } from "react";
import history from "../../history";

class GroupCards extends Component {
  constructor(props) {
    super(props);
  }

  handleClickEvent(destination, packId, projectId) {
    let url = "/" + destination + "/" + packId + "/" + projectId;
    return function() {
      history.push({
        pathname: url,
        search: ""
      });
    };
  }

  render() {
    return (
      <div>
        <div className="truncate_title">
          {this.props.name ? (
            <a
              className="home_pack_description"
              onClick={this.handleClickEvent(
                this.props.destination,
                this.props.itemId,
                this.props.projectId
              )}
            >
              {this.props.name}
            </a>
          ) : (
            <p className="none">None</p>
          )}
        </div>
      </div>
    );
  }
}

export default GroupCards;
