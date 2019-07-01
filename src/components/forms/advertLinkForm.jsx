import React, { Component } from "react";
import history from "../../history";
import Parse from "parse";
import { parseSettings as config } from "../../js/serverSettings";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { green } from "@material-ui/core/colors";
import type from "../../js/type";
import Loader from "../../components/extra/loader";

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
class AuthorForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      link: "",
      linkType: "0",
      mask: "none",
      error: "",
      loading: false
    };
  }

  submitAdvertLink = event => {
    event.preventDefault();
    let currentUser = Parse.User.current();
    let advertId = this.props.advertId;
    console.log(this.props.advertId);

    if (currentUser) {
      if (this.state.link !== "") {
        this.setState({
          loading: true,
          mask: "block",
          error: ""
        });

        Parse.Cloud.run("createAdvertLink", {
          admin: currentUser.id,
          linkDetails: this.state.link,
          linkType: this.state.linkType,
          advertId: advertId
        }).then(function(response) {
          if (response.responseCode === 0) {
            history.goBack(-1);
          } else {
            this.setState({
              loading: false,
              mask: "none",
              error: "Link was not saved. Please Try again."
            });
          }
        });
      } else {
        this.setState({ error: "Link field can not be empty" });
      }
    } else {
      history.push("/");
    }
  };

  handleLinkDetails = event => {
    this.setState({
      link: event.target.value
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
        <Loader loading={this.state.loading} />

        <div id="pageMask" style={{ display: this.state.mask }} />

        <div className="small-12 medium-6 large-6 cell create_background">
          <form method="post">
            <center>
              <div className="edit_labels medium-12 large-12">
                {this.state.error}
              </div>
              <div
                className="edit_labels medium-12 large-12"
                style={{ marginBottom: "30px !important" }}
              >
                New Advert Link
              </div>
              <label style={{ color: "white" }}>{this.state.error}</label>
              <FormControl style={styles.formControl}>
                <InputLabel htmlFor="pack_type">Select Link Type</InputLabel>
                <Select
                  native
                  onChange={this.handleChangeAction}
                  name="type"
                  id="pack_type"
                  style={{ width: "230px" }}
                >
                  <option value="" />
                  <option value="0">Mobile Number</option>
                  <option value="1">Site URL</option>
                  <option value="6">Social Media Handle</option>
                </Select>
              </FormControl>
              <input
                type="text"
                className="_pack common_pack_detail validate"
                placeholder="Link Details"
                name="linkInfo"
                required=""
                aria-required="true"
                onChange={this.handleLinkDetails}
              />

              <br />
            </center>
            <span>
              <button onClick={this.submitAdvertLink} className="create">
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

export default AuthorForm;
