import React, { Component } from "react";
import history from "../../history";
import Parse from "parse";
import { parseSettings as config } from "../../js/serverSettings";

Parse.initialize(config.appId);
Parse.serverURL = config.url;

class ProductForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      description: ""
    };
  }

  submitProduct = event => {
    event.preventDefault();
    var currentUser = Parse.User.current();

    if (currentUser) {
      if (this.state.name !== "" && this.state.description !== "") {
        Parse.Cloud.run("createNewProduct", {
          admin: currentUser.id,
          name: this.state.name,
          email: this.state.description
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

  handleReturnButton() {
    return function() {
      history.goBack();
    };
  }

  render() {
    return (
      <div className="small-12 medium-6 large-6 cell create_background">
        <form action="/project" method="post">
          <center>
            <div
              className="edit_labels medium-12 large-12"
              style={{ marginBottom: "30px !important" }}
            >
              New Product Item
            </div>

            <input
              type="text"
              className="_pack common_pack_detail validate"
              placeholder="Product Name"
              name="product_name"
              required=""
              aria-required="true"
              onChange={this.handleChangeName}
            />
            <br />
            <textarea
              className="_pack common_pack_detail validate"
              placeholder="Product Description"
              name="product_description"
              required=""
              aria-required="true"
              onChange={this.handleChangeDescription}
            />
            <br />
            <br />
          </center>
          <span>
            <button onClick={this.submitProduct} className="create">
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

export default ProductForm;
