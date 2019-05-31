import React, { Component } from "react";
import history from "../../history";
import Parse from "parse";
import { parseSettings as config } from "../../js/serverSettings";
import Loader from "../../components/extra/loader";
import { isRejected } from "q";

Parse.initialize(config.appId);
Parse.serverURL = config.url;

class ApproveItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      itemId: "",
      name: "",
      currentType: "",
      loading: true,
      mask: "block"
    };
  }

  componentDidMount() {
    let itemId = this.props.itemId;
    let name = this.props.name;
    let currentUser = Parse.User.current();
    let currentType = this.props.currentType;
    console.log(currentType);
    if (currentUser) {
      this.setState({
        itemId: itemId,
        name: name,
        currentType: currentType,
        loading: false,
        mask: "none"
      });
    }
  }

  submitApprove = async event => {
    event.preventDefault();
    let currentUser = Parse.User.current();
    let itemId = this.props.itemId;
    let currentType = this.props.currentType;
    if (currentUser) {
      if (this.state.name !== "") {
        this.setState({
          loading: true,
          mask: "block"
        });

        const response = await Parse.Cloud.run("approveItem", {
          itemId: itemId,
          currentType: currentType
        });

        if (response.responseCode === 0) {
          history.goBack();
        }
      }
    } else {
      history.push("/");
    }
  };

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
            <b>
              Approve {this.state.name} {this.state.currentType}
            </b>
          </center>
          <Loader loading={this.state.loading} />
        </span>

        <div
          style={{ zIndex: "0" }}
          className="small-12 medium-6 large-6 cell create_background"
        >
          <div
            className="edit_labels medium-12 large-12"
            style={{ marginBottom: "30px !important" }}
          >
            Are you sure??
          </div>
          <div
            className="edit_labels medium-12 large-12"
            style={{
              fontSize: "30px",
              fontWeight: "500"
            }}
          >
            Are you sure you want to APPROVE&nbsp;{" "}
            <b style={{ color: "#ec8c2a" }}>{this.state.name}</b> .&nbsp; If Yes
            Click Approve.
          </div>
          <br />
          <br />
          <span style={{ float: "right" }}>
            <button
              style={{ color: "white" }}
              onClick={this.submitApprove}
              className="create"
            >
              Approve
            </button>
          </span>
          <span>
            <button
              style={{ color: "white" }}
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

export default ApproveItem;
