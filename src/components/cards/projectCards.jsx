import React, { Component } from "react";
import history from "../../history";
import "../../App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog } from "@fortawesome/free-solid-svg-icons";

class ProjectCards extends Component {
  constructor(props) {
    super(props);
  }

  openProject(item) {
    return function() {
      history.push({
        pathname: "/open/project/" + item,
        search: ""
      });
    };
  }

  render() {
    return (
      <div className="small-12 medium-3 large-3 cell icons">
        <a href="#">
          <FontAwesomeIcon
            className="display_icons"
            style={{
              color: "#28396E",
              fontSize: "30px",
              margin: "10px 10px auto"
            }}
            icon={faCog}
          />
        </a>
        <a href="#" onClick={this.openProject(this.props.projectId)}>
          <center>
            {this.props.image ? (
              <img
                className="pack_artwork"
                src={this.props.image}
                style={{ height: "250px" }}
              />
            ) : (
              <p className="none">
                <b>No Artwork</b>
              </p>
            )}
          </center>
          <div>
            <p className="pack_name_text">{this.props.name}</p>
          </div>
        </a>
      </div>
    );
  }
}

export default ProjectCards;
