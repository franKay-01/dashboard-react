import React, { Component } from "react";
import Parse from "parse";
import { parseSettings as config } from "../../js/serverSettings";
import Loader from "../../components/extra/loader";
import history from "../../history";
import type from "../../js/type";
import { faPlusSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import $ from "jquery";

Parse.initialize(config.appId);
Parse.serverURL = config.url;

class StoryItemList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mask: "none",
      error: "",
      loading: false
    };
  }

  handleReturnButton() {
    return function() {
      history.goBack();
    };
  }

  submitStoryItemList = async event => {
    event.preventDefault();
    let currentUser = Parse.User.current();
    let elementType = this.props.type;
    let storyId = this.props.storyId;

    var taskArray = new Array();
    $("input[name=content]").each(function() {
      taskArray.push($(this).val());
    });

    if (currentUser) {
      if (taskArray.length > 0) {
        this.setState({
          loading: true,
          mask: "block"
        });
        const response = await Parse.Cloud.run("addStoryItem", {
          admin: currentUser.id,
          elementType: elementType,
          content: taskArray,
          storyId: storyId
        });

        if (response.responseCode === 0) {
          history.goBack();
        } else {
          this.setState({
            error: "An Error Ocurred when adding Story Item"
          });
        }
      }
    } else {
      history.push("/");
    }
  };

  componentDidMount() {
    $(function() {
      let scntDiv = $("#lists");
      let i = $("#lists p").length + 1;

      $("#addList").click(function(event) {
        // $('#addScnt').live('click', function() {
        $(
          '<p><label for="p_scnts"><input className="task _pack common_pack_detail validate" placeholder="Add Text" style="color: white !important; font-size: 25px; font-weight: 400" type="text" name="content"/></label> </p>'
        ).appendTo(scntDiv);
        i++;
        return false;
      });
    });
  }

  render() {
    return (
      <>
        <div id="pageMask" style={{ display: this.state.mask }} />
        <Loader loading={this.state.loading} />
        <div className="small-12 medium-6 large-6 cell create_background">
          <div
            className="edit_labels medium-12 large-12"
            style={{ marginBottom: "30px !important" }}
          >
            New {this.props.name} Item
          </div>
          <form method="post">
            <div id="lists" style={{ margin: "50px 130px" }}>
              <p>
                <input
                  className="task _pack common_pack_detail validate"
                  placeholder="Add Text"
                  type="text"
                  name="content"
                />
                <a href="#" id="addList" style={{ marginLeft: "-10px" }}>
                  <FontAwesomeIcon
                    style={{ color: "#fdfdfd" }}
                    className="size"
                    icon={faPlusSquare}
                  />
                </a>
              </p>
            </div>
            <br />
            <span>
              <button onClick={this.submitStoryItemList} className="create">
                CREATE
              </button>
            </span>
            <span>
              <button
                type="button"
                id="btnCancel"
                className="cancel"
                onClick={this.handleReturnButton()}
              >
                Cancel
              </button>
            </span>
          </form>
        </div>
      </>
    );
  }
}

export default StoryItemList;
