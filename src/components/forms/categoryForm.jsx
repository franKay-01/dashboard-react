import React, { Component } from "react";
import history from "../../history";
import ChipInput from "material-ui-chip-input";
import Parse from "parse";
import Loader from "../../components/extra/loader";
import { parseSettings as config } from "../../js/serverSettings";

Parse.initialize(config.appId);
Parse.serverURL = config.url;

class CategoryForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: "",
      mask: "none",
      error: "",
      loading: false
    };
  }

  submitCategories = event => {
    event.preventDefault();
    var currentUser = Parse.User.current();

    if (currentUser) {
      if (this.state.name !== "") {
        this.setState({
          loading: true,
          mask: "block",
          error: ""
        });
        Parse.Cloud.run("createNewCategories", {
          admin: currentUser.id,
          categories: this.state.categories
        }).then(function(response) {
          if (response.responseCode === 0) {
            history.push("/home");
          }
        });
      } else {
        this.setState({ error: "Name field can not be empty" });
      }
    } else {
      history.push("/");
    }
  };

  handleChange = event => {
    // let arr = [];
    // arr.push(event);
    this.setState({
      categories: event
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
        <div className="small-12 medium-6 large-6 cell create_background">
          <form method="post">
            <center>
              <div className="edit_labels medium-12 large-12">
                New Categories
              </div>
              <label htmlFor="categories">List the Categories</label>
              <ChipInput
                //   defaultValue={["foo", "bar"]}
                id="categories"
                onChange={chips => this.handleChange(chips)}
              />
              <br />
            </center>
            <span>
              <button onClick={this.submitCategories} className="create">
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

export default CategoryForm;
