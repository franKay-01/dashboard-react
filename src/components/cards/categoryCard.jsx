import React, { Component } from "react";
class CategoryCard extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <div className="truncate_title">
          {this.props.name ? (
            <a className="home_pack_description" href="/product/<%= item.id %>">
              {this.props.name}
            </a>
          ) : (
            <p class="none">None</p>
          )}
        </div>
      </div>
    );
  }
}

export default CategoryCard;
