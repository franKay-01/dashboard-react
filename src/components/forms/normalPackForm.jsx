import React, { Component } from "react";
import history from "../../history";
import Parse from "parse";
import { parseSettings as config } from "../../js/serverSettings";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import InputLabel from "@material-ui/core/InputLabel";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
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

class PackForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      description: "",
      version: 1,
      category: "NORMAL",
      type: "",
      error: "",
      loading: false,
      mask: "none"
    };
  }

  submitPack = event => {
    event.preventDefault();
    let currentUser = Parse.User.current();
    let account = currentUser.get("type");
    if (currentUser) {
      if (this.state.name !== "" && this.state.description !== "") {
        this.setState({
          loading: true,
          mask: "block",
          error: ""
        });

        Parse.Cloud.run("createNewPack", {
          admin: currentUser.id,
          name: this.state.name,
          description: this.state.description,
          version: this.state.version,
          category: "NORMAL",
          type: type.PACK_TYPE.grouped,
          account: account
        }).then(function(response) {
          if (response.responseCode === 0) {
            history.push("/creator/home");
          }
        });
      } else {
        this.setState({ error: "Name field can not be empty" });
      }
    } else {
      history.push("/");
    }
  };

  handleChangeName = event => {
    this.setState({
      name: event.target.value
    });
  };

  handleChangeDescription = event => {
    this.setState({
      description: event.target.value
    });
  };

  handleChangeCategory = event => {
    this.setState({ category: event.target.value });
  };

  handleChangeType = event => {
    this.setState({ type: event.target.value });
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
        <div className="small-12 medium-6 large-6 cell create_background">
          <form method="post">
            <center>
              <div
                className="edit_labels medium-12 large-12"
                style={{ marginBottom: "30px !important" }}
              >
                New Sticker Pack
              </div>
              <div
                id="errorHandle"
                className="policy_label small-12 medium-6 large-6 cell"
                style={{ textAlign: "center" }}
              >
                {this.state.error}
              </div>
              <input
                type="text"
                className="_pack common_pack_detail validate"
                placeholder="Pack Name"
                name="product_name"
                required=""
                aria-required="true"
                onChange={this.handleChangeName}
              />
              <br />
              <textarea
                className="_pack common_pack_detail validate"
                placeholder="Pack Description"
                name="product_description"
                required=""
                aria-required="true"
                onChange={this.handleChangeDescription}
              />
              <br />
              <input
                type="number"
                className="_pack common_pack_detail validate"
                placeholder="Pack Version"
                name="version"
                required=""
                aria-required="true"
                onChange={this.handleChangeVersion}
              />
              <br />

              {/* <div style={styles.root}>
                <FormControl component="fieldset" style={styles.formControl}>
                  <FormLabel component="legend" style={{ color: "white" }}>
                    Select Pack Category
                  </FormLabel>
                  <RadioGroup
                    aria-label="Gender"
                    name="gender1"
                    style={{ flexDirection: "unset" }}
                    value={this.state.category}
                    onChange={this.handleChangeCategory}
                  >
                    <FormControlLabel
                      value="NORMAL"
                      control={<Radio color="primary" />}
                      label="Normal"
                    />
                    <FormControlLabel
                      value="NSFW"
                      control={<Radio color="primary" />}
                      label="Not Safe for Work"
                    />
                    <FormControlLabel
                      value="LT"
                      control={<Radio color="primary" />}
                      label="Love Text"
                    />
                  </RadioGroup>
                </FormControl>
                <br />
                <FormControl style={styles.formControl}>
                  <InputLabel htmlFor="pack_type">Add Pack Type</InputLabel>
                  <Select
                    native
                    value={this.state.type}
                    onChange={this.handleChangeType}
                    name="type"
                    id="pack_type"
                    style={{ width: "230px" }}
                  >
                    <option value="" />
                    <option value={type.PACK_TYPE.grouped}>GROUP PACK</option>
                    <option value={type.PACK_TYPE.themed}>THEMED PACK</option>
                    <option value={type.PACK_TYPE.curated}>CURATED PACK</option>
                  </Select>
                </FormControl>
              </div> */}
              <br />
            </center>
            <span>
              <button onClick={this.submitPack} className="create">
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

export default PackForm;
