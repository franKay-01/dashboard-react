import React, { Component } from "react";
import history from "../../history";
import Parse from "parse";
import { parseSettings as config } from "../../js/serverSettings";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { green } from "@material-ui/core/colors";
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

class AdvertForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: "",
      description: "",
      action: "",
      mask: "none",
      error: "",
      loading: false
    };
  }

  handleChangeTitle = event => {
    this.setState({ title: event.target.value });
  };

  handleChangeDescription = event => {
    this.setState({
      description: event.target.value
    });
  };

  handleChangeAction = event => {
    this.setState({ action: event.target.value });
  };

  handleReturnButton() {
    return function() {
      history.goBack();
    };
  }

  submitAdvert = event => {
    event.preventDefault();
    var currentUser = Parse.User.current();
    let projectId = this.props.projectId;
    if (currentUser) {
      if (this.state.title !== "") {
        this.setState({
          loading: true,
          mask: "block",
          error: ""
        });
        Parse.Cloud.run("createNewAdvert", {
          admin: currentUser.id,
          title: this.state.title,
          description: this.state.description,
          action: this.state.action,
          projectId: this.props.projectId
        }).then(function(response) {
          if (response.responseCode === 0) {
            let advert = response.data;
            history.push("/advert/" + advert.id + "/" + projectId);
          }
        });
      } else {
        this.setState({ error: "Check all FIELDS. They can not be empty" });
      }
    } else {
      history.push("/");
    }
  };

  render() {
    return (
      <>
        <div id="pageMask" style={{ display: this.state.mask }} />
        <Loader loading={this.state.loading} />
        <div className="small-12 medium-6 large-6 cell create_background">
          <form method="post">
            <center>
              <div
                className="edit_labels medium-12 large-12"
                style={{ marginBottom: "30px !important" }}
              >
                New Advert
              </div>
              <label style={{ color: "white" }}>{this.state.error}</label>
              <input
                type="text"
                className="_pack common_pack_detail validate"
                placeholder="Advert Title"
                name="title"
                required=""
                aria-required="true"
                onChange={this.handleChangeTitle}
              />
              <br />
              <input
                className="_pack common_pack_detail validate"
                placeholder="Description"
                name="description"
                required=""
                aria-required="true"
                onChange={this.handleChangeDescription}
              />

              <br />
              <FormControl style={styles.formControl}>
                <InputLabel htmlFor="pack_type">Add Action Type</InputLabel>
                <Select
                  native
                  value={this.state.type}
                  onChange={this.handleChangeAction}
                  name="type"
                  id="pack_type"
                  style={{ width: "230px" }}
                >
                  <option value="" />
                  <option value="FIND OUT MORE">FIND OUT MORE</option>
                  <option value="INSTALL NOW">INSTALL NOW</option>
                  <option value="FREE">FREE</option>
                  <option value="FREE DOWNLOAD">FREE DOWNLOAD</option>
                  <option value="DOWNLOAD">DOWNLOAD</option>
                  <option value="DONWNLOAD NOW">DOWNLOAD NOW</option>
                  <option value="BUY">BUY</option>
                  <option value="BUY NOW">BUY NOW</option>
                  <option value="PURCHASE">PURCHASE</option>
                  <option value="PLAY">PLAY</option>
                  <option value="PLAY NOW">PLAY NOW</option>
                </Select>
              </FormControl>
            </center>
            <span>
              <button onClick={this.submitAdvert} className="create">
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

export default AdvertForm;
