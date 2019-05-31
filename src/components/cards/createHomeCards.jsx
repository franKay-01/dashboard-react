import React, { Component } from "react";
import ButtonCreate from "../extra/buttonCreation";

class CreateHomeCards extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <>
        <div className="small-12 medium-3 large-3 cell icons">
          <div className="create_new">Create New</div>

          <ButtonCreate
            name={"Sticker Pack"}
            destination={"pack"}
            project={this.props.projectId}
          />
          <ButtonCreate
            name={"Story"}
            destination={"story"}
            project={this.props.projectId}
          />
          <ButtonCreate
            name={"Adverts"}
            destination={"advert"}
            project={this.props.projectId}
          />
          <ButtonCreate
            name={"Chat Member"}
            destination={"member"}
            project={this.props.projectId}
          />
        </div>

        {/* Start of Update card */}
        <div className="small-12 medium-3 large-3 cell icons">
          <div className="create_new">Update</div>
          <ButtonCreate name={"Sticker of the Day"} />
          <ButtonCreate name={"Sticker of the Week"} />
          <ButtonCreate name={"Pack in Review"} />
          <ButtonCreate name={"Stories in Review"} />
        </div>
        {/* End of update card */}

        {/* Start of History card */}
        <div className="small-12 medium-3 large-3 cell icons">
          <div className="create_new">History</div>
          <ButtonCreate name={"Sticker History"} />
          <ButtonCreate name={"Story History"} />
        </div>
        {/* End of update card */}
      </>
    );
  }
}

export default CreateHomeCards;
