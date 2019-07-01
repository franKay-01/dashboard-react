import React, { Component } from "react";
import { css } from "@emotion/core";
// First way to import
import { PropagateLoader } from "react-spinners";

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

class Loader extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div
        className="sweet-loading medium-12 large-12 "
        style={{
          zIndex: "10",
          position: "fixed",
          margin: "10% 45%"
        }}
      >
        <PropagateLoader
          css={override}
          sizeUnit={"px"}
          size={15}
          color={"#D7366E"}
          loading={this.props.loading}
        />
      </div>
    );
  }
}

export default Loader;
