import React, { Component } from "react";
import logo from "../../logo.svg";
import Parse from "parse";
import TopHeader from "../../components/cards/header";
import history from "../../history";
import ProjectCards from "../../components/cards/projectCards";
import CreateNewCards from "../../components/cards/createNewCard";
import GroupCards from "../../components/cards/groupCards";
import { parseSettings as config } from "../../js/serverSettings";
import "../../App.css";

Parse.initialize(config.appId);
Parse.serverURL = config.url;

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      projects: [],
      products: [],
      authors: [],
      categories: [],
      accountType: 0
    };
  }

  componentDidMount() {
    let currentUser = Parse.User.current();
    let account = currentUser.get("type");
    if (currentUser) {
      Parse.Cloud.run("landingPage", {
        admin: currentUser.id,
        deviceType: 0
      }).then(response => {
        if (response.responseCode === 0) {
          // set story status to found
          this.setState({
            projects: response.data.project,
            products: response.data.products,
            authors: response.data.authors,
            categories: response.data.categories,
            accountType: account
          });
        }
      });
    } else {
      history.push("/");
    }
  }

  render() {
    // let projects = this.state.pageInfo.project;
    // console.log("PROJECTS " + projects);
    return (
      <div className="App background">
        <div
          className="grid-x grid-padding-x align-left"
          style={{ margin: "50px" }}
        >
          <TopHeader />
        </div>
        <div
          style={{ marginTop: "100px" }}
          className="grid-x grid-padding-x align-spaced"
        >
          <div
            style={{ marginLeft: "30px" }}
            className="small-12 medium-12 large-12 welcome_post"
          >
            <b>Welcome to Publisher</b>
          </div>
          {/* Start of the Creation Card */}
          <div className="small-12 medium-3 large-3 cell login_card">
            <div className="card_head_position">
              <div className="stats">Dashboard</div>
              <div className="_stickers"># Projects</div>
            </div>
          </div>

          {/* End of the Creation Card */}
          <CreateNewCards accountType={this.state.accountType} />
          {/* Start of the Available Project Cards */}
          {this.state.projects.map(project => (
            <ProjectCards
              key={project.id}
              name={project.name}
              image={project.image}
              projectId={project.id}
            />
          ))}
          {/* End of the Available Project Cards */}

          {/* Start of product card */}

          <div className="small-12 medium-3 large-3 cell icons">
            <div className="create_new">Product IDs</div>

            <div className="card_head_position">
              <div className="recent_labels">Recent Product IDs</div>
              {this.state.products.map(project => (
                <GroupCards key={project.id} name={project.name} />
              ))}
              <div>
                {this.state.products ? (
                  <a className="view_all" href="/products">
                    View All
                  </a>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
          {/* End of Product Card */}

          {/* Start of Authors Card */}
          <div className="medium-3 large-3 cell icons">
            <div className="create_new">Authors</div>

            <div className="card_head_position">
              <div className="recent_labels">Recent Authors</div>
              {this.state.authors.map(author => (
                <GroupCards key={author.id} name={author.name} />
              ))}
              <div>
                {this.state.authors ? (
                  <a className="view_all" href="/products">
                    View All
                  </a>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
          {/* End of Authors Card */}

          {/** End of Categories Card */}

          <div className="medium-3 large-3 cell icons">
            <div className="create_new">Categories</div>

            <div className="card_head_position">
              <div className="recent_labels">Recent Categories</div>
              {this.state.categories.map(category => (
                <GroupCards key={category.id} name={category.name} />
              ))}
              <div>
                {this.state.categories ? (
                  <a className="view_all" href="/products">
                    View All
                  </a>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
          {/** End of Categories Card */}
        </div>
      </div>
    );
  }
}

export default Home;
