import React, { Component } from "react";
import history from "../../history";
import Parse from "parse";
import $ from "jquery";
import "../../App.css";
import "../../css/myStyle.css";
import TopHeader from "../../components/cards/header";
import Menu from "../../components/extra/menu";
import { parseSettings as config } from "../../js/serverSettings";
import Loader from "../../components/extra/loader";
import { faLink, faImage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
Parse.initialize(config.appId);
Parse.serverURL = config.url;

class PackPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      url: "",
      userId: "",
      imageURL: "",
      advertId: "",
      title: "",
      description: "",
      images: [],
      link: false,
      loading: true,
      mask: "block"
    };
  }

  handleReturnButton() {
    return function() {
      history.goBack();
    };
  }

  handleChangeTitle = event => {
    this.setState({ title: event.target.value });
  };

  handleChangeDescription = event => {
    this.setState({ description: event.target.value });
  };

  handleClickButton(item) {
    let id = this.props.match.params.projectId;
    let advertId = this.props.match.params.advertId;
    let url = this.state.url;
    let images = this.state.images;

    return function() {
      history.push({
        pathname: "/card/create",
        search: "",
        state: {
          element: item,
          projectId: id,
          url: url,
          images: images,
          itemId: advertId
        }
      });
    };
  }

  submitAdvert = async event => {
    event.preventDefault();
    let title = this.state.title;
    let description = this.state.description;
    let advertId = this.props.match.params.advertId;
    let currentUser = Parse.User.current();

    if (currentUser) {
      this.setState({
        loading: true,
        mask: "block"
      });

      const response = await Parse.Cloud.run("updateAdvertDetails", {
        advertId: advertId,
        title: title,
        description: description
      });

      let advertfeed = {};
      advertfeed = await response.data;

      this.setState({
        title: advertfeed.ads.title,
        description: advertfeed.ads.description,
        loading: false,
        mask: "none"
      });
    } else {
      history.push("/");
    }
  };

  async componentDidMount() {
    let id = this.props.match.params.projectId;
    let advertId = this.props.match.params.advertId;
    let currentUser = Parse.User.current();
    let url = window.location.href;
    url = btoa(url);

    if (currentUser) {
      this.setState({
        loading: true,
        mask: "block"
      });

      const response = await Parse.Cloud.run("getAdvertDetails", {
        advertId: advertId,
        projectId: id
      });

      let advertfeed = {};
      advertfeed = await response.data;

      this.setState({
        url: url,
        userId: currentUser.id,
        advertId: advertfeed.ads.id,
        title: advertfeed.ads.title,
        description: advertfeed.ads.description,
        images: advertfeed.images,
        link: advertfeed.link,
        loading: false,
        mask: "none"
      });
    } else {
      history.push("/");
    }
  }

  render() {
    return (
      <div className="App">
        <div id="pageMask" style={{ display: this.state.mask }} />
        <div
          className="grid-x grid-padding-x align-left"
          style={{ margin: "50px" }}
        >
          <TopHeader />
        </div>

        <Loader loading={this.state.loading} />

        <div className="grid-x grid-padding-x align-spaced">
          <span className="medium-12 large-12 welcome_post">
            <b>{this.state.title} Advert</b>
          </span>
          {/** Menu Bar */}
          <div className="medium-3 large-3 login_card cell">
            <Menu projectId={this.props.match.params.projectId} />
          </div>
          {/** Menu Bar */}

          {/** Edit Advert Card */}

          <div className="small-12 medium-8 large-8 story_form">
            <label style={{ marginTop: "20px" }} class="update_label">
              Advert Title:
            </label>
            <input
              placeholder="Title"
              class="box_2 advert_title"
              name="title"
              onChange={this.handleChangeTitle}
              value={this.state.title}
            />
            <br />
            <label style={{ marginTop: "20px" }} class="update_label">
              AD Description:
            </label>
            <input
              placeholder="Ad Description"
              class="box_2 advert_title"
              name="description"
              onChange={this.handleChangeDescription}
              value={this.state.description}
            />
            <br />
            <label style={{ marginTop: "20px" }} class="update_label">
              Attached Ad Images:
            </label>
            {this.state.images.length > 0
              ? this.state.images.map(sticker => (
                  <img
                    style={{ width: "150px" }}
                    src={sticker.image}
                    alt="Banner"
                    key={sticker.id}
                  />
                ))
              : null}
            <br />

            <a
              onClick={this.handleClickButton("addArtWork")}
              className="preview_2"
            >
              Add Artwork&nbsp;&nbsp;
              <FontAwesomeIcon
                className="fa-5x"
                style={{ color: "#cca3b2", fontSize: "1.5rem" }}
                icon={faImage}
                //   size="xs"
              />
            </a>
            <br />
            {this.state.link === false ? (
              <a
                onClick={this.handleClickButton("addAdvertLink")}
                className="preview_2"
              >
                Add Link&nbsp;&nbsp;
                <FontAwesomeIcon
                  className="fa-5x"
                  style={{ color: "#cca3b2", fontSize: "1.5rem" }}
                  icon={faLink}
                  //   size="xs"
                />
              </a>
            ) : (
              <a
                onClick={() => {
                  this.setState({
                    error: "You can have only one (1) link per advert"
                  });
                  setTimeout(() => {
                    $("#linkError").show();
                  }, 1000);
                  setTimeout(() => {
                    $("#linkError").hide();
                  }, 5000);
                }}
                className="preview_2"
              >
                Add Link&nbsp;&nbsp;
                <FontAwesomeIcon
                  className="fa-5x"
                  style={{ color: "#cca3b2", fontSize: "1.5rem" }}
                  icon={faLink}
                  //   size="xs"
                />
              </a>
            )}
            <br />
            <div
              id="linkError"
              style={{
                color: "#ff0000b3",
                fontWeight: "bolder",
                display: "none"
              }}
            >
              {this.state.error}
            </div>
            <br />
            <span>
              <button
                style={{ color: "#a46580", marginTop: "20px" }}
                onClick={this.submitAdvert}
                className="create"
              >
                Update
              </button>
            </span>
            <span>
              <button
                style={{ color: "#a46580", marginTop: "20px" }}
                type="button"
                id="btnCancel"
                className="cancel"
                onClick={() => {
                  history.push("/adverts/" + this.props.match.params.projectId);
                }}
              >
                Back
              </button>
            </span>
          </div>
        </div>
        {/** Edit Advert Card */}
      </div>
    );
  }
}

export default PackPage;
