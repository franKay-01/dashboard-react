import React, { Component } from "react";
import logo from "../../logo.svg";
import Parse from "parse";
import "../../App.css";
import TopHeader from "../../components/cards/header";
import StickerList from "../../components/cards/stickerList";
import history from "../../history";
import { parseSettings as config } from "../../js/serverSettings";
import type from "../../js/type";

Parse.initialize(config.appId);
Parse.serverURL = config.url;

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      //initial with static sticker objects
      stickers: []
    };
  }

  componentDidMount() {
    var currentUser = Parse.User.current();
    if (currentUser) {
      if (currentUser.get("type") === type.USER.ultimate) {
        history.push("/home");
      } else if (currentUser.get("type") === type.USER.normal) {
        history.push("/creator/home");
      }
    }
    Parse.Cloud.run("getHomeStickers", { deviceType: 0 }).then(response => {
      if (response.responseCode === 0) {
        // set story status to found
        this.setState({
          stickers: response.data
        });
      }
    });
  }

  render() {
    return (
      <div className="App background">
        <div
          className="grid-x grid-padding-x align-left"
          style={{ margin: "50px" }}
        >
          <TopHeader />
        </div>

        <StickerList stickers={this.state.stickers} />
      </div>
    );
  }
}

export default App;
