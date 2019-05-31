import React, { Component } from "react";
class ViewAll extends Component {
  constructor(props) {
    super(props);

    this.state = {
      url: ""
    };
  }

  componentDidMount() {
    let projectId = this.props.projectId;
    let destination = this.props.url;
    let url = destination + projectId;
    this.setState({
      url: url
    });
  }

  render() {
    return (
      <>
        {this.props.item.length > 0 ? (
          <div>
            <a className="view_all" href={this.state.url}>
              View All
            </a>
          </div>
        ) : null}
      </>
    );
  }
}

export default ViewAll;
