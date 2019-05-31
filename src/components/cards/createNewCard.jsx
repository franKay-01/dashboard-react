import React, { Component } from "react";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import history from "../../history";
import type from "../../js/type";

class CreateNewCard extends Component {
  constructor(props) {
    super(props);
  }

  handleClickButton(item) {
    return function() {
      history.push({
        pathname: "/card/create",
        search: "",
        state: { element: item }
      });
    };
  }

  handleClickEvent(destination) {
    let url = "/" + destination;
    return function() {
      history.push({
        pathname: url,
        search: ""
      });
    };
  }

  render() {
    return (
      <>
        <div className="small-12 medium-3 large-3 cell icons">
          <div className="create_new">Create New</div>

          <button
            className="create_button"
            onClick={this.handleClickButton("project")}
          >
            <p className="title">
              <FontAwesomeIcon className="size" icon={faCircle} />
              Project
            </p>
          </button>

          <button
            onClick={this.handleClickButton("authors")}
            className="create_button"
          >
            <p className="title">
              <FontAwesomeIcon className="size" icon={faCircle} />
              Authors
            </p>
          </button>
          <button
            onClick={this.handleClickButton("category")}
            className="create_button"
          >
            <p className="title">
              <FontAwesomeIcon className="size" icon={faCircle} />
              Category
            </p>
          </button>

          <button
            onClick={this.handleClickButton("product")}
            className="create_button"
            style={{ backgroundColor: "#2dbd77" }}
          >
            <p className="title">
              <FontAwesomeIcon className="size" icon={faCircle} />
              Product ID
            </p>
          </button>
        </div>

        {this.props.accountType === type.USER.ultimate ? (
          <div className="small-12 medium-3 large-3 cell icons">
            <div className="create_new">Review Items</div>
            <button
              onClick={this.handleClickEvent("checkPacks")}
              className="create_button"
              style={{ backgroundColor: "#cb574c" }}
            >
              <p className="title">
                <FontAwesomeIcon className="size" icon={faCircle} />
                Packs In Review
              </p>
            </button>
            <button
              onClick={this.handleClickEvent("checkStories")}
              className="create_button"
              style={{ backgroundColor: "#cb574c" }}
            >
              <p className="title">
                <FontAwesomeIcon className="size" icon={faCircle} />
                Stories In Review
              </p>
            </button>
          </div>
        ) : null}
      </>
    );
  }
}

export default CreateNewCard;
