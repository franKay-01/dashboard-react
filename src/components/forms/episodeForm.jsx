import React, { Component } from "react";
import history from "../../history";
import Parse from "parse";
import { parseSettings as config } from "../../js/serverSettings";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { green } from "@material-ui/core/colors";
import Loader from "../../components/extra/loader";
import zIndex from "@material-ui/core/styles/zIndex";

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

class EpisodeForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: "",
      order: 0,
      action: "",
      type: "free",
      products: [],
      show: "none",
      productId: "",
      loading: false,
      mask: "none"
    };
  }

  submitEpisode = event => {
    event.preventDefault();
    var currentUser = Parse.User.current();
    let projectId = this.props.projectId;
    let storyId = this.props.storyId;
    if (currentUser) {
      if (this.state.title !== "" && this.state.order !== 0) {
        this.setState({
          loading: true,
          mask: "block"
        });

        Parse.Cloud.run("createNewEpisode", {
          admin: currentUser.id,
          title: this.state.title,
          type: this.state.type,
          projectId: projectId,
          order: this.state.order,
          storyId: storyId
        }).then(function(response) {
          if (response.responseCode === 0) {
            history.goBack();
          }
        });
      } else {
        this.setState({ error: "Check all FIELDS. They can not be empty" });
      }
    } else {
      history.push("/");
    }
  };

  componentDidMount() {
    let products = this.props.products;
    this.setState({
      products: products
    });
  }

  handleChangeProduct = event => {
    this.setState({ productId: event.target.value });
  };

  handleChangeAction = event => {
    if (event.target.value === "sold") {
      this.setState({ type: event.target.value, show: "block" });
    } else {
      this.setState({ type: event.target.value, show: "none" });
    }
  };

  handleChangeTitle = event => {
    this.setState({ title: event.target.value });
  };

  handleChangeOrder = event => {
    this.setState({
      order: event.target.value
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
              <div
                className="edit_labels medium-12 large-12"
                style={{ marginBottom: "30px !important" }}
              >
                New Episode
              </div>
              <input
                type="text"
                className="_pack common_pack_detail"
                placeholder="Episode Title"
                value={this.state.title}
                onChange={this.handleChangeTitle}
              />
              <br />
              <input
                type="number"
                className="_pack common_pack_detail"
                placeholder="Episode Order"
                value={this.state.order}
                onChange={this.handleChangeOrder}
              />
              <br />
              <FormControl style={styles.formControl}>
                <InputLabel htmlFor="pack_type">Make Free or Paid</InputLabel>
                <Select
                  native
                  value={this.state.type}
                  onChange={this.handleChangeAction}
                  id="pack_type"
                  style={{ width: "230px" }}
                >
                  <option value="" />
                  <option value="sold">Sold</option>
                  <option value="free">Free</option>
                </Select>
              </FormControl>
              <br />
              <br />
              <div style={{ display: this.state.show }}>
                <FormControl style={styles.formControl}>
                  <InputLabel htmlFor="pack_type">Select Product ID</InputLabel>
                  <Select
                    native
                    value={this.state.productId}
                    onChange={this.handleChangeProduct}
                    id="pack_type"
                    style={{ width: "230px" }}
                  >
                    <option value="" />
                    {this.state.products.map(product => (
                      <option key={product.id} value={product.id}>
                        {product.name}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              </div>
              <br />
            </center>
            <span>
              <button onClick={this.submitEpisode} className="create">
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

export default EpisodeForm;
