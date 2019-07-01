import React, { Component } from "react";
import history from "../../history";
import Parse from "parse";
import { parseSettings as config } from "../../js/serverSettings";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { green } from "@material-ui/core/colors";
import Loader from "../../components/extra/loader";
import type from "../../js/type";

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
      userId: "",
      action: "",
      imageType: "",
      images: [],
      mask: "none",
      error: "",
      loading: false
    };
  }

  handleChangeAction = event => {
    this.setState({ action: event.target.value });
  };

  handleReturnButton() {
    return function() {
      history.goBack();
    };
  }

  componentDidMount() {
    let imageArray = this.props.images;
    let originalArray = [0, 1, 2];
    let spliceArray = [];
    let currentUser = Parse.User.current();

    originalArray.forEach(original => {
      imageArray.forEach(imageType => {
        if (original === imageType.type) {
          spliceArray.push(original);
          //   originalArray.splice(originalArray.indexOf(original), 1);
        }
      });
    });

    spliceArray.forEach(item => {
      originalArray.splice(originalArray.indexOf(item), 1);
    });

    if (currentUser) {
      this.setState({
        userId: currentUser.id,
        images: originalArray
      });
    } else {
      history.push("/");
    }
  }

  addAdvertImage = () => {
    let action = this.state.action;

    if (action !== "") {
      window.location.href =
        "https://cryptic-waters-41617.herokuapp.com/uploadImgReact/" +
        this.props.advertId +
        "/" +
        this.props.projectId +
        "/" +
        this.state.userId +
        "/" +
        this.props.url +
        "/" +
        action;
    } else {
      this.setState({
        error: "Please select an Image Type"
      });
    }
  };

  render() {
    console.log(this.state.action);
    return (
      <>
        <div id="pageMask" style={{ display: this.state.mask }} />
        <Loader loading={this.state.loading} />
        <div className="small-12 medium-6 large-6 cell create_background">
          <div>
            <center>
              <div
                className="edit_labels medium-12 large-12"
                style={{ marginBottom: "30px !important" }}
              >
                New Advert Image
              </div>
              <p style={{ color: "white", fontWeight: "bolder" }}>
                {this.state.error}
              </p>

              <FormControl style={styles.formControl}>
                <InputLabel htmlFor="pack_type">Select Image Type</InputLabel>
                <Select
                  native
                  onChange={this.handleChangeAction}
                  name="type"
                  id="pack_type"
                  style={{ width: "230px" }}
                >
                  <option value="" />
                  {this.state.images.map(image => (
                    <>
                      {image === type.ADVERT_IMAGE_TYPE.web ? (
                        <option value={image}>WEB IMAGE</option>
                      ) : null}

                      {image === type.ADVERT_IMAGE_TYPE.banner ? (
                        <option value={image}>BANNER IMAGE</option>
                      ) : null}

                      {image === type.ADVERT_IMAGE_TYPE.mobile ? (
                        <option value={image}>MOBILE IMAGE</option>
                      ) : null}
                    </>
                  ))}
                </Select>
              </FormControl>
            </center>
            <br />
            <span>
              <button onClick={this.addAdvertImage} className="create">
                Add Image
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
          </div>
        </div>
      </>
    );
  }
}

export default AdvertForm;
