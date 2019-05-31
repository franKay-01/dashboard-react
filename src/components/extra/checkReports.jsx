import React, { Component } from "react";
import history from "../../history";
import Parse from "parse";
import "../../App.css";
import "../../css/myStyle.css";
import {
  faInbox,
  faExclamationCircle
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Loader from "../../components/extra/loader";

class CheckReports extends Component {
  constructor(props) {
    super(props);

    this.state = {
      items: [],
      mask: "none",
      mask: "block",
      error: ""
    };
  }

  handleReturnButton() {
    return function() {
      history.goBack();
    };
  }

  async componentDidMount() {
    let itemId = this.props.itemId;
    let currentUser = Parse.User.current();

    if (currentUser) {
      this.setState({
        loading: true,
        mask: "block"
      });

      const response = await Parse.Cloud.run("getReportsDetails", {
        itemId: itemId
      });

      let reportfeed = {};
      reportfeed = await response.data;

      console.log(JSON.stringify(reportfeed));
      this.setState({
        items: reportfeed.reports,
        loading: false,
        mask: "none"
      });
    } else {
      history.push("/");
    }
  }

  readReport(destination, itemId, contents, title, read) {
    console.log("REPORES " + itemId + contents + title + read);

    return function() {
      history.push({
        pathname: "/card/create",
        search: "",
        state: {
          element: destination,
          itemId: itemId,
          contents: contents,
          title: title,
          read: read
        }
      });
    };
  }
  render() {
    return (
      <>
        <div id="pageMask" style={{ display: this.state.mask }} />
        <div
          className="grid-x grid-padding-x align-left"
          style={{ margin: "50px" }}
        />

        <Loader loading={this.state.loading} />

        <div className="grid-x grid-padding-x align-spaced">
          <span className="medium-12 large-12 welcome_post">
            <b>
              Reports for{" "}
              <b style={{ color: "#ec8c2a" }}>{this.props.itemType}</b> Items
            </b>
          </span>

          <div className="small-12 medium-3 large-3 cell login_card">
            <div className="card_head_position">
              <div className="stats">Dashboard</div>
              <div onClick={this.handleReturnButton()} className="_stickers">
                Go Back
              </div>
            </div>
          </div>
          {this.state.items.length > 0
            ? this.state.items.map(item =>
                item.read === false ? (
                  <div
                    key={item.id}
                    onClick={this.readReport(
                      "readReport",
                      item.id,
                      item.contents,
                      item.title,
                      item.read
                    )}
                    className="medium-3 large-3 cell card-zoom icons"
                  >
                    <FontAwesomeIcon
                      //   className="size"
                      style={{
                        color: "red",
                        float: "right",
                        marginTop: "10px"
                      }}
                      icon={faExclamationCircle}
                    />
                    <center>
                      <p className="none" style={{ margin: "150px 80px" }}>
                        <FontAwesomeIcon
                          style={{
                            color: "#de3c35",
                            margin: "10px",
                            fontSize: "80px"
                          }}
                          //   className="size"
                          icon={faInbox}
                        />
                      </p>
                      <span className="name_tag" style={{ position: "unset" }}>
                        <p className="sticker_name_text"> {item.title} </p>
                      </span>
                    </center>
                  </div>
                ) : (
                  <div
                    key={item.id}
                    onClick={() =>
                      this.readReport(item.id, item.contents, item.title)
                    }
                    className="medium-3 large-3 cell card-zoom icons "
                  >
                    <center>
                      <p className="none" style={{ margin: "150px 80px" }}>
                        <FontAwesomeIcon
                          style={{
                            color: "#de3c35",
                            margin: "10px",
                            fontSize: "80px"
                          }}
                          //   className="size"
                          icon={faInbox}
                        />
                      </p>
                      <span className="name_tag" style={{ position: "unset" }}>
                        <p className="sticker_name_text"> {item.title} </p>
                      </span>
                    </center>
                  </div>
                )
              )
            : null}
        </div>
      </>
    );
  }
}

export default CheckReports;
