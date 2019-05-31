import React, { Component } from "react";
import history from "../../history";
import Parse from "parse";
import { parseSettings as config } from "../../js/serverSettings";
import Loader from "../../components/extra/loader";

Parse.initialize(config.appId);
Parse.serverURL = config.url;

class ReadReports extends Component {
  constructor(props) {
    super(props);

    this.state = {
      itemId: "",
      title: "",
      read: "",
      contents: [],
      loading: true,
      mask: "block"
    };
  }

  async componentDidMount() {
    let currentUser = Parse.User.current();
    let currentType = this.props.currentType;
    console.log(currentType);

    if (currentUser) {
      const response = await Parse.Cloud.run("changeReadStatus", {
        reportId: this.props.itemId
      });

      if (response.responseCode === 0) {
        this.setState({
          itemId: this.props.itemId,
          title: this.props.title,
          read: this.props.read,
          contents: this.props.contents,
          loading: false,
          mask: "none"
        });
      } else {
        history.goBack();
      }
    } else {
      history.push("/");
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
        <span
          className="medium-12 large-12 welcome_post"
          style={{ marginBottom: "20px" }}
        >
          <center>
            <b>{this.state.title}</b>
          </center>
          <Loader loading={this.state.loading} />
        </span>

        <div
          style={{ zIndex: "0" }}
          className="small-12 medium-6 large-6 cell story_form"
        >
          {this.state.contents.map(content => (
            <>
              <div
                className="edit_labels medium-12 large-12"
                style={{
                  marginBottom: "30px !important",
                  height: "auto",
                  color: "black"
                }}
              >
                {content.error}
              </div>
              <div
                className="edit_labels medium-12 large-12"
                style={{
                  fontSize: "30px",
                  fontWeight: "500",
                  height: "auto",
                  color: "#c51111"
                }}
              >
                {content.content}
              </div>
              <br />
              <br />
            </>
          ))}
          {/* 
          <span style={{ float: "right" }}>
            <button
              style={{ color: "white" }}
              onClick={this.submitApprove}
              className="create"
            >
              Fix
            </button>
          </span> */}
          <span>
            <button
              style={{ color: "black" }}
              type="button"
              id="btnCancel"
              className="cancel"
              onClick={this.handleReturnButton()}
            >
              Cancel
            </button>
          </span>
        </div>
      </>
    );
  }
}

export default ReadReports;
