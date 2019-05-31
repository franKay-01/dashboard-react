import React, { Component } from "react";
import history from "../../history";
import Parse from "parse";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import { green } from "@material-ui/core/colors";
import { parseSettings as config } from "../../js/serverSettings";

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

class ProductSelectionForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      productIds: [],
      selected: ""
    };
  }

  submitProduct = event => {
    event.preventDefault();
    let currentUser = Parse.User.current();
    let packId = this.props.packId;

    if (currentUser) {
      if (this.state.selected !== "") {
        Parse.Cloud.run("addProductId", {
          admin: currentUser.id,
          packId: packId,
          selected: this.state.selected
        }).then(function(response) {
          if (response.responseCode === 0) {
            history.goBack();
          }
        });
      } else {
        this.setState({ error: "Select One of the ProductIDs" });
      }
    } else {
      history.push("/");
    }
  };

  handleProductChange = event => {
    this.setState({
      selected: event.target.value
    });
  };

  handleReturnButton() {
    return function() {
      history.goBack();
    };
  }

  render() {
    return (
      <div className="medium-8 large-8 cell create_background">
        <form method="post" id="pack_form">
          <div className="edit_labels medium-12 large-12">
            MAKE THIS PACK FREE OR PAID?
            <span
              style={{
                fontSize: "18px",
                fontWeight: "700",
                letterSpacing: "2px"
              }}
            >
              This action can be done carried out once!!
            </span>
          </div>
          <br />
          <center>
            <FormControl style={styles.formControl}>
              <InputLabel htmlFor="pack_type">Add Product ID</InputLabel>
              <Select
                native
                value={this.state.selected}
                onChange={this.handleProductChange}
                name="product"
                id="productId"
                style={{ width: "250px" }}
              >
                <option value="" />
                <option value="free">FREE</option>
                {this.props.productIds.map(product => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </Select>
            </FormControl>
          </center>
          <br />
          <br />
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

export default ProductSelectionForm;
