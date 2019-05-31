import React, { Component } from "react";
import history from "../../history";
import Parse from "parse";
import { parseSettings as config } from "../../js/serverSettings";
import Loader from "../../components/extra/loader";
import $ from "jquery";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { green } from "@material-ui/core/colors";

Parse.initialize(config.appId);
Parse.serverURL = config.url;

const styles = theme => ({
  root: {
    display: "unset",
    color: green[600]
  },
  formControl: {
    margin: theme.spacing.unit * 3
  },
  group: {
    margin: `${theme.spacing.unit}px 0`
  }
});

class ChangeHtmlType extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: "",
      itemId: "",
      itemIndex: "",
      storyItemType: "",
      newStoryItemType: "",
      mask: "none",
      loading: false
    };
  }

  componentDidMount() {
    this.setState({
      content: this.props.content,
      itemId: this.props.itemId,
      storyItemType: this.props.storyItemType,
      itemIndex: this.props.itemIndex
    });
  }

  submitChanges = event => {
    event.preventDefault();
    let currentUser = Parse.User.current();
    let content = this.state.content;
    let itemId = this.state.itemId;
    let storyType = this.state.storyItemType;
    let newStoryItemType = this.state.newStoryItemType;
    let itemIndex = this.state.itemIndex;

    if (currentUser) {
      if (newStoryItemType !== "") {
        this.setState({
          loading: true,
          mask: "block"
        });
        Parse.Cloud.run("changeHtmlItem", {
          content: content,
          itemId: itemId,
          newStoryItemType: newStoryItemType,
          storyType: storyType,
          itemIndex: itemIndex
        }).then(function(response) {
          if (response.responseCode === 0) {
            history.goBack();
          }
        });
      } else {
        this.setState({ error: "Content can not be empty" });
      }
    } else {
      history.push("/");
    }
  };
  handleChangeType = event => {
    let value = event.target.value;
    if (value === "0" || value === "5" || value === "6" || value === "8") {
      this.setState({
        text: "block"
      });
    }
    this.setState({
      newStoryItemType: value
    });
  };

  handleChangeContent = event => {
    this.setState({
      content: event.target.value
    });
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

        <Loader loading={this.state.loading} />

        <div className="medium-8 large-8 cell create_background">
          <form method="post" id="pack_form">
            <div className="edit_labels medium-12 large-12">
              MAKE CHANGES HERE.
            </div>
            <br />
            <center>
              <FormControl style={styles.formControl}>
                <InputLabel htmlFor="pack_type">Change/Select Type</InputLabel>
                <Select
                  native
                  value={this.state.type}
                  onChange={this.handleChangeType}
                  name="type"
                  id="pack_type"
                  style={{ width: "230px" }}
                >
                  <option value="" />
                  <option value="0">TEXT</option>
                  <option value="5">ITALIC</option>
                  <option value="6">BOLD</option>
                  <option value="8">BOLD & ITALIC</option>
                </Select>
              </FormControl>
              <div style={{ display: this.state.text, marginTop: "30px" }}>
                <b style={{ color: "white" }}>Content</b>
                <input
                  type="text"
                  className="_pack common_pack_detail"
                  placeholder="Content"
                  onChange={this.handleChangeContent}
                  value={this.state.content}
                />
              </div>
            </center>
            <br />
            <br />
            <span>
              <button onClick={this.submitChanges} className="create">
                CHANGE
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

export default ChangeHtmlType;
