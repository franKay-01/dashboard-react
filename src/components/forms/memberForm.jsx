import React, { Component } from "react";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Parse from "parse";
import { parseSettings as config } from "../../js/serverSettings";
import { green } from "@material-ui/core/colors";
import history from "../../history";

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
class MemberForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      description: "",
      sex: "Male"
    };
  }

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

  handleChangeSex = event => {
    this.setState({ sex: event.target.value });
  };

  handleReturnButton() {
    return function() {
      history.goBack();
    };
  }

  submitPack = event => {
    event.preventDefault();
    var currentUser = Parse.User.current();

    if (currentUser) {
      if (this.state.name !== "" && this.state.description !== "") {
        Parse.Cloud.run("createNewMember", {
          admin: currentUser.id,
          name: this.state.name,
          description: this.state.description,
          sex: this.state.sex
        }).then(function(response) {
          if (response.responseCode === 0) {
            history.goBack();
          }
        });
      } else {
        this.setState({ error: "Name field can not be empty" });
      }
    } else {
      history.push("/");
    }
  };
  render() {
    return (
      <div className="small-12 medium-6 large-6 cell create_background">
        <form method="post">
          <center>
            <div
              className="edit_labels medium-12 large-12"
              style={{ marginBottom: "30px !important" }}
            >
              New Member Details
            </div>
            <div
              className="policy_label small-12 medium-12 large-12 cell"
              style={{ textAlign: "center" }}
            >
              {this.state.error}
            </div>
            <div>
              <input
                type="text"
                class="_pack common_pack_detail validate"
                placeholder="Member name"
                name="memberName"
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

              <FormControl style={styles.formControl}>
                <InputLabel htmlFor="pack_type">Add Member Sex</InputLabel>
                <Select
                  native
                  value={this.state.type}
                  onChange={this.handleChangeSex}
                  name="type"
                  id="pack_type"
                  style={{ width: "230px" }}
                >
                  <option value="" />
                  <option value="Male">MALE</option>
                  <option value="Female">FEMALE</option>
                </Select>
              </FormControl>
            </div>
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
    );
  }
}

export default MemberForm;
