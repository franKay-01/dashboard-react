import React, { Component } from "react";
import history from "../../history";
import Parse from "parse";
import { parseSettings as config } from "../../js/serverSettings";
import { faPlusSquare, faCamera } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import { green } from "@material-ui/core/colors";
import { arch } from "os";
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

class EditPack extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // Set initial files, type 'local' means this is a file
      // that has already been uploaded to the server (see docs)
      packId: "",
      version: 0,
      name: "",
      description: "",
      keywords: [],
      productId: [],
      archive: "true",
      art: "",
      url: "",
      status: 0,
      is_published: false,
      productInfo: "",
      productIds: [],
      loading: true,
      mask: "block"
    };
  }

  handleReturnButton() {
    return function() {
      history.goBack();
    };
  }

  submitPackDetails = async event => {
    event.preventDefault();
    var currentUser = Parse.User.current();
    let projectId = this.props.projectId;
    let packId = this.props.packId;
    let pack;
    if (currentUser) {
      if (this.state.name !== "" && this.state.description !== "") {
        this.setState({
          loading: true,
          mask: "block"
        });
        const response = await Parse.Cloud.run("editPack", {
          admin: currentUser.id,
          packId: packId,
          version: this.state.version,
          name: this.state.name,
          description: this.state.description,
          keywords: this.state.keywords,
          archive: this.state.archive,
          projectId: projectId
        });

        if (response.responseCode === 0) {
          pack = response.data.pack;
          this.setState({
            version: pack.version,
            name: pack.name,
            description: pack.description,
            keywords: pack.keywords,
            archive: pack.archive,
            packId: pack.id,
            status: pack.status,
            is_published: pack.is_published,
            loading: false,
            mask: "none"
          });
        }
      } else {
        this.setState({ error: "Name field can not be empty" });
      }
    } else {
      history.push("/");
    }
  };

  async componentDidMount() {
    let id = this.props.projectId;
    let packId = this.props.packId;
    let url = this.props.url;
    console.log("INITIAL" + url);
    url = btoa(url);

    console.log("UPDATED" + url);
    var currentUser = Parse.User.current();
    if (currentUser) {
      this.setState({
        loading: true,
        mask: "block"
      });
      const response = await Parse.Cloud.run("editPackDetails", {
        admin: currentUser.id,
        projectId: id,
        packId: packId
      });
      let packfeed = {};
      packfeed = await response.data;

      let archive;
      if (packfeed.pack.archive === false) {
        archive = "false";
      } else {
        archive = "true";
      }
      this.setState({
        art: packfeed.pack.art,
        version: packfeed.pack.version,
        name: packfeed.pack.name,
        description: packfeed.pack.description,
        keywords: packfeed.pack.keywords,
        archive: archive,
        url: url,
        packId: packfeed.pack.id,
        status: packfeed.pack.status,
        is_published: packfeed.pack.is_published,
        productInfo: packfeed.singleProduct,
        productIds: packfeed.productIds,
        loading: false,
        mask: "none"
      });
    } else {
      history.push("/");
    }
  }

  handleChangeName = event => {
    this.setState({
      name: event.target.value
    });
  };

  handleChangeTextArea = event => {
    this.setState({
      description: event.target.value
    });
  };

  handleChangeKeywords = event => {
    this.setState({
      keywords: event.target.value
    });
  };

  handleChangeArchive = event => {
    this.setState({
      archive: event.target.value
    });
  };

  handleChangeVersion = event => {
    this.setState({ version: event.target.value });
  };

  handleClickButton(item) {
    let id = this.props.projectId;
    let packId = this.props.packId;
    let productIds = [];
    if (this.state.productIds !== []) {
      productIds = this.state.productIds;
    }
    return function() {
      history.push({
        pathname: "/card/create",
        search: "",
        state: {
          element: item,
          projectId: id,
          packId: packId,
          productIds: productIds
        }
      });
    };
  }

  render() {
    return (
      <>
        <span className="medium-12 large-12 welcome_post">
          <div id="pageMask" style={{ display: this.state.mask }} />

          <center>
            {Object.keys(this.state.name) !== "" ? (
              <>
                <b>Editing {this.state.name} Sticker Pack</b>
              </>
            ) : (
              <>
                <b> Sticker Pack</b>
              </>
            )}
          </center>
          <Loader loading={this.state.loading} />
        </span>
        <div className=" small-12 medium-10 large-10 cell grid-x grid-padding-x align-spaced packDetails">
          <div className="small-12 medium-5 large-5 cell">
            <div className="droppableArea">
              <div className="output" name="tfile" />
              {this.state.art !== "" ? (
                <img className="pack_artwork" src={this.state.art} />
              ) : (
                <center>
                  <p className="none">
                    <b>No Artwork</b>
                  </p>
                </center>
              )}
            </div>
          </div>
          <div className="small-12 medium-5 large-5 cell">
            <label htmlFor="pack_name" className="update_label">
              Pack Name:
            </label>
            {this.state.is_published !== false ? (
              <input
                placeholder="Pack Name"
                className="box_2"
                name="pack_name"
                id="pack_name"
                value={this.state.name}
                onChange={this.handleChangeName}
                style={{ marginBottom: "35px" }}
              />
            ) : (
              <input
                placeholder="Pack Name"
                className="box_2"
                name="pack_name"
                value={this.state.name}
                disabled
                style={{ marginBottom: "35px" }}
              />
            )}
            <label htmlFor="description" className="update_label">
              Pack Decsription:
            </label>
            <textarea
              className="box_2"
              id="description"
              name="description"
              value={this.state.description}
              onChange={this.handleChangeTextArea}
              style={{ marginBottom: "35px" }}
              cols={30}
              rows={6}
            />

            <br />
            <label style={{ color: "#a46580" }}>
              Seperate Tags with comma (,)
            </label>
            <input
              type="text"
              className="box_2 validate"
              value={this.state.keywords}
              placeholder="Smile,Angry,Sad"
              id="keyword"
              name="keyword"
              onChange={this.handleChangeKeywords}
              style={{ marginBottom: "15px" }}
            />
            <br />

            <label htmlFor="version" className="update_label">
              Pack Version:
            </label>
            <input
              type="number"
              className="box_2"
              value={this.state.version}
              id="version"
              onChange={this.handleChangeVersion}
              style={{ marginBottom: "15px" }}
            />
            <br />
            <label htmlFor="version" className="update_label">
              Archive Pack:
            </label>
            <FormControl component="fieldset" style={styles.formControl}>
              <RadioGroup
                aria-label="Archive"
                name="archive"
                style={{ flexDirection: "unset" }}
                value={this.state.archive}
                onChange={this.handleChangeArchive}
              >
                <FormControlLabel
                  value="false"
                  control={<Radio color="secondary" />}
                  label="No, Don't Archive"
                />
                <FormControlLabel
                  value="true"
                  control={<Radio color="secondary" />}
                  label="Yes, Archive"
                />
                )}
              </RadioGroup>
            </FormControl>
            <br />
            {this.state.productInfo.name === "" ? (
              <label htmlFor="productId" className="update_label">
                <p
                  style={{ fontSize: "15px", color: "#0f9d58" }}
                  onClick={this.handleClickButton("addProduct")}
                >
                  Add Product ID
                  <FontAwesomeIcon className="size" icon={faPlusSquare} />
                </p>
              </label>
            ) : null}
            <label
              htmlFor="productId"
              className="update_label"
              style={{ fontSize: "15px" }}
            >
              Current ProductId:
              {this.state.productInfo.name !== "" ? (
                <i style={{ color: "#0f9d58" }}>
                  &nbsp;{this.state.productInfo.name}
                </i>
              ) : (
                <i style={{ color: "#0f9d58" }}>Not Specified</i>
              )}
            </label>
            <a
              href={
                "https://cryptic-waters-41617.herokuapp.com/pack_uploads/react/" +
                this.props.packId +
                "/" +
                this.state.url
              }
              className="preview_2"
            >
              New Pack Artwork&nbsp;
              <FontAwesomeIcon
                className="fa-5x"
                style={{ color: "#cca3b2", fontSize: "1.5rem" }}
                icon={faCamera}
              />
            </a>
          </div>

          <div className="small-12 medium-12 large-12">
            <span style={{ float: "right" }}>
              <button
                style={{ color: "#a46580" }}
                onClick={this.submitPackDetails}
                className="create"
              >
                EDIT
              </button>
            </span>
            <span>
              <button
                style={{ color: "#a46580" }}
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

export default EditPack;
