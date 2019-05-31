import React, { Component } from "react";
import "../../App.css";
import "../../css/myStyle.css";
import TopHeader from "../cards/header";
import ProjectForm from "./projectForm";
import AuthorsForm from "./authorForm";
import CategoryForm from "./categoryForm";
import ProductForm from "./productForm";
import PackForm from "./packForm";
import NormalPackForm from "./normalPackForm";
import NormalStoryForm from "./normalStoryForm";
import StoryForm from "./storyForm";
import MemberForm from "./memberForm";
import AdvertForm from "./advertForm";
import StickerForm from "./stickerForm";
import EditPack from "./editPack";
import ProductSelectionForm from "./productSelectionForm";
import StickerDetailsForm from "./stickerDetailsForm";
import ProjectSelection from "./projectSelection";
import ProjectRemoval from "./projectRemoval";
import AuthorSelection from "./authorSelection";
import ColorSchemeSelection from "./colorSelection";
import DefaultColorSchemeSelection from "./defaultColorScheme";
import MemberSelection from "./memberSelection";
import MemberOrderSelection from "./memberOrderSelection";
import EpisodeForm from "./episodeForm";
import StoryItemForm from "./storyItemForm";
import StoryItemList from "./storyItemList";
import StoryItemDivider from "./storyItemDivider";
import StoryItemHeading from "./storyItemHeading";
import StoryItemSource from "./storyItemSource";
import StoryItemLink from "./storyItemLink";
import StoryItemBackground from "./storyItemBackground";
import HtmlTextForm from "./htmlTextForm";
import HtmlColorForm from "./htmlColorForm";
import EditTextStoryItems from "./editTextStoryItems";
import EditLinkStoryItems from "./editLinkStoryItems";
import EditListStoryItems from "./editListStoryItems";
import EditHeadingItems from "./editHeadingItems";
import EditSourceItems from "./editSourceItems";
import EditBackgroundColor from "./editBackgroundColor";
import EditHtmlStoryItems from "./editHtmlStoryItems";
import ChangeStoryType from "./changeStoryType";
import ChangeHtmlType from "./changeHtmlType";
import DeleteStoryItem from "../extra/storyItemRemoval";
import EditEpisodeDetails from "./editEpisodeDetails";
import StoryOfTheWeek from "./storyOfTheWeek";
import StickerOfTheWeek from "./stickerOfTheweek";
import ItemApproval from "./approveItem";
import RejectItem from "./rejectItem";
import SubmitForReview from "./submitForReview";
import CheckReports from "../extra/checkReports";
import ReadReports from "./readReports";
import StickerStoryItem from "./stickerStoryItems";
import StoryChangeSticker from "./storyChangeSticker";
import StoryItemImage from "./storyItemImage";
import StoryArtworkChange from "./storyArtworkChange";
import ChooseArtOption from "../extra/chooseOption";
import PublishItem from "./publishItem";
import CuratedSelection from "./curatedSelection";
import RemoveCurated from "./removeCurated";

class FormCreator extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="App">
        <div
          className="grid-x grid-padding-x align-left"
          style={{ margin: "50px" }}
        >
          <TopHeader />
        </div>
        {/* <div
          className="small-12 medium-8 large-8 welcome_post"
          style={{ textAlign: "center" }}
        >
          <b>Creating a New Item</b>
        </div> */}
        <div className="grid-x grid-padding-x align-spaced">
          {this.props.location.state.element === "project" ? (
            <>
              <ProjectForm />
            </>
          ) : null}

          {this.props.location.state.element === "author" ? (
            <>
              <AuthorsForm />
            </>
          ) : null}

          {this.props.location.state.element === "category" ? (
            <>
              <CategoryForm />
            </>
          ) : null}

          {this.props.location.state.element === "product" ? (
            <>
              <ProductForm />
            </>
          ) : null}

          {this.props.location.state.element === "member" ? (
            <>
              <MemberForm />
            </>
          ) : null}

          {this.props.location.state.element === "checkReports" ? (
            <>
              <CheckReports
                itemId={this.props.location.state.itemId}
                itemType={this.props.location.state.itemType}
              />
            </>
          ) : null}

          {this.props.location.state.element === "readReport" ? (
            <>
              <ReadReports
                itemId={this.props.location.state.itemId}
                contents={this.props.location.state.contents}
                title={this.props.location.state.title}
                read={this.props.location.state.read}
              />
            </>
          ) : null}

          {this.props.location.state.element === "addProduct" ? (
            <>
              <ProductSelectionForm
                projectId={this.props.location.state.projectId}
                productIds={this.props.location.state.productIds}
                packId={this.props.location.state.packId}
              />
            </>
          ) : null}

          {this.props.location.state.element === "submitForReview" ? (
            <>
              <SubmitForReview
                name={this.props.location.state.name}
                itemId={this.props.location.state.itemId}
                itemType={this.props.location.state.itemType}
              />
            </>
          ) : null}

          {this.props.location.state.element === "Link" ? (
            <>
              <EditLinkStoryItems
                name={this.props.location.state.name}
                url={this.props.location.state.url}
                itemId={this.props.location.state.itemId}
                storyItemType={this.props.location.state.storyItemType}
              />
            </>
          ) : null}

          {this.props.location.state.element === "BackgroundColor" ? (
            <>
              <EditBackgroundColor
                content={this.props.location.state.content}
                itemId={this.props.location.state.itemId}
                storyItemType={this.props.location.state.storyItemType}
              />
            </>
          ) : null}

          {this.props.location.state.element === "Source" ? (
            <>
              <EditSourceItems
                content={this.props.location.state.content}
                itemId={this.props.location.state.itemId}
                storyItemType={this.props.location.state.storyItemType}
              />
            </>
          ) : null}

          {this.props.location.state.element === "Heading" ? (
            <>
              <EditHeadingItems
                content={this.props.location.state.content}
                itemId={this.props.location.state.itemId}
                storyItemType={this.props.location.state.storyItemType}
              />
            </>
          ) : null}

          {this.props.location.state.element === "editEpisodes" ? (
            <>
              <EditEpisodeDetails
                storyId={this.props.location.state.storyId}
                projectId={this.props.location.state.projectId}
              />
            </>
          ) : null}

          {this.props.location.state.element === "DeleteItem" ? (
            <>
              <DeleteStoryItem
                content={this.props.location.state.content}
                itemId={this.props.location.state.itemId}
              />
            </>
          ) : null}

          {this.props.location.state.element === "ChangeType" ? (
            <>
              <ChangeStoryType
                content={this.props.location.state.content}
                itemId={this.props.location.state.itemId}
                url={this.props.location.state.url}
                storyItemType={this.props.location.state.storyItemType}
                itemIndex={this.props.location.state.itemIndex}
              />
            </>
          ) : null}

          {this.props.location.state.element === "ChangeHtmlType" ? (
            <>
              <ChangeHtmlType
                content={this.props.location.state.content}
                itemId={this.props.location.state.itemId}
                storyItemType={this.props.location.state.storyItemType}
                itemIndex={this.props.location.state.itemIndex}
              />
            </>
          ) : null}

          {this.props.location.state.element === "List" ? (
            <>
              <EditListStoryItems
                content={this.props.location.state.content}
                itemId={this.props.location.state.itemId}
                storyItemType={this.props.location.state.storyItemType}
              />
            </>
          ) : null}

          {this.props.location.state.element === "Text" ||
          this.props.location.state.element === "Italic" ||
          this.props.location.state.element === "Bold" ||
          this.props.location.state.element === "ItalicBold" ||
          this.props.location.state.element === "SideNote" ||
          this.props.location.state.element === "GreyArea" ||
          this.props.location.state.element === "Quote" ? (
            <>
              <EditTextStoryItems
                content={this.props.location.state.content}
                itemId={this.props.location.state.itemId}
                storyItemType={this.props.location.state.storyItemType}
              />
            </>
          ) : null}

          {this.props.location.state.element === "stickerDetails" ? (
            <>
              <StickerDetailsForm
                projectId={this.props.location.state.projectId}
                packId={this.props.location.state.packId}
                stickerId={this.props.location.state.stickerId}
              />
            </>
          ) : null}

          {this.props.location.state.element === "pack" ? (
            <>
              <PackForm projectId={this.props.location.state.projectId} />
            </>
          ) : null}

          {this.props.location.state.element === "normalPack" ? (
            <NormalPackForm />
          ) : null}

          {this.props.location.state.element === "normalStory" ? (
            <NormalStoryForm />
          ) : null}

          {this.props.location.state.element === "story" ? (
            <>
              <StoryForm projectId={this.props.location.state.projectId} />
            </>
          ) : null}

          {this.props.location.state.element === "advert" ? (
            <>
              <AdvertForm projectId={this.props.location.state.projectId} />
            </>
          ) : null}

          {this.props.location.state.element === "editPack" ? (
            <>
              <EditPack
                projectId={this.props.location.state.projectId}
                packId={this.props.location.state.itemId}
                url={this.props.location.state.url}
              />
            </>
          ) : null}

          {this.props.location.state.element === "publishing" ? (
            <>
              <PublishItem
                itemId={this.props.location.state.itemId}
                name={this.props.location.state.name}
                condition={this.props.location.state.condition}
                itemType={this.props.location.state.itemType}
                url={this.props.location.state.url}
              />
            </>
          ) : null}

          {this.props.location.state.element === "stickerPack" ? (
            <>
              <CuratedSelection
                projectId={this.props.location.state.projectId}
                packId={this.props.location.state.itemId}
              />
            </>
          ) : null}

          {this.props.location.state.element === "addProject" ? (
            <>
              <ProjectSelection
                projectId={this.props.location.state.projectId}
                itemId={this.props.location.state.itemId}
                currentProjects={this.props.location.state.currentProjects}
                currentType={this.props.location.state.currentType}
              />
            </>
          ) : null}

          {this.props.location.state.element === "removeCurated" ? (
            <>
              <RemoveCurated
                packId={this.props.location.state.packId}
                name={this.props.location.state.stickerName}
                stickerId={this.props.location.state.stickerId}
              />
            </>
          ) : null}

          {this.props.location.state.element === "approveItems" ? (
            <>
              <ItemApproval
                itemId={this.props.location.state.itemId}
                name={this.props.location.state.itemName}
                currentType={this.props.location.state.currentType}
              />
            </>
          ) : null}

          {this.props.location.state.element === "rejectItem" ? (
            <>
              <RejectItem
                itemId={this.props.location.state.itemId}
                name={this.props.location.state.itemName}
                currentType={this.props.location.state.currentType}
              />
            </>
          ) : null}

          {this.props.location.state.element === "removeProject" ? (
            <>
              <ProjectRemoval
                projectId={this.props.location.state.projectId}
                itemId={this.props.location.state.itemId}
                projectName={this.props.location.state.projectName}
                currentType={this.props.location.state.currentType}
              />
            </>
          ) : null}

          {this.props.location.state.element === "addAuthor" ? (
            <>
              <AuthorSelection
                projectId={this.props.location.state.projectId}
                storyId={this.props.location.state.storyId}
              />
            </>
          ) : null}

          {this.props.location.state.element === "editColor" ? (
            <>
              <ColorSchemeSelection
                projectId={this.props.location.state.projectId}
                storyId={this.props.location.state.itemId}
                topColor={this.props.location.state.topColor}
                bottomColor={this.props.location.state.bottomColor}
                art={this.props.location.state.art}
                title={this.props.location.state.title}
              />
            </>
          ) : null}

          {this.props.location.state.element === "defaultColor" ? (
            <>
              <DefaultColorSchemeSelection
                projectId={this.props.location.state.projectId}
                storyId={this.props.location.state.itemId}
                topColor={this.props.location.state.topColor}
                bottomColor={this.props.location.state.bottomColor}
                art={this.props.location.state.art}
                title={this.props.location.state.title}
              />
            </>
          ) : null}

          {this.props.location.state.element === "selectMembers" ? (
            <>
              <MemberSelection
                projectId={this.props.location.state.projectId}
                storyId={this.props.location.state.itemId}
              />
            </>
          ) : null}

          {this.props.location.state.element === "storyOfTheWeek" ? (
            <>
              <StoryOfTheWeek
                projectId={this.props.location.state.projectId}
                storyId={this.props.location.state.itemId}
                source={this.props.location.state.source}
              />
            </>
          ) : null}

          {this.props.location.state.element === "stickerDescription" ? (
            <>
              <StickerForm
                projectId={this.props.location.state.projectId}
                stickerId={this.props.location.state.stickerId}
                name={this.props.location.state.name}
              />
            </>
          ) : null}

          {this.props.location.state.element === "stickerOfTheWeek" ? (
            <>
              <StickerOfTheWeek
                projectId={this.props.location.state.projectId}
                storyId={this.props.location.state.itemId}
                source={this.props.location.state.source}
              />
            </>
          ) : null}

          {this.props.location.state.element === "selectOrder" ? (
            <>
              <MemberOrderSelection
                projectId={this.props.location.state.projectId}
                storyId={this.props.location.state.itemId}
                incoming={this.props.location.state.incoming}
                outgoing={this.props.location.state.outgoing}
              />
            </>
          ) : null}

          {this.props.location.state.element === "episode" ? (
            <>
              <EpisodeForm
                projectId={this.props.location.state.projectId}
                storyId={this.props.location.state.storyId}
                products={this.props.location.state.products}
              />
            </>
          ) : null}

          {this.props.location.state.element === "storychangesticker" ? (
            <>
              <StoryChangeSticker
                storyId={this.props.location.state.storyId}
                source={this.props.location.state.source}
              />
            </>
          ) : null}

          {this.props.location.state.element === "chooseArtOption" ? (
            <>
              <ChooseArtOption
                storyId={this.props.location.state.storyId}
                url={this.props.location.state.url}
                status={this.props.location.state.status}
              />
            </>
          ) : null}

          {this.props.location.state.element === "setStoryArt" ? (
            <>
              <StoryArtworkChange
                storyId={this.props.location.state.storyId}
                url={this.props.location.state.url}
                route={this.props.location.state.route}
                status={this.props.location.state.status}
              />
            </>
          ) : null}

          {this.props.location.state.element === "storyitemsticker" ? (
            <>
              <StickerStoryItem
                storyId={this.props.location.state.storyId}
                source={this.props.location.state.source}
                type={this.props.location.state.type}
                name={this.props.location.state.name}
                storyType={this.props.location.state.storyType}
                members={this.props.location.state.members}
              />
            </>
          ) : null}

          {this.props.location.state.element === "storyitemform" ? (
            <>
              <StoryItemForm
                projectId={this.props.location.state.projectId}
                storyId={this.props.location.state.storyId}
                source={this.props.location.state.source}
                type={this.props.location.state.type}
                name={this.props.location.state.name}
                storyType={this.props.location.state.storyType}
                members={this.props.location.state.members}
              />
            </>
          ) : null}

          {this.props.location.state.element === "storyitemimage" ? (
            <>
              <StoryItemImage
                projectId={this.props.location.state.projectId}
                storyId={this.props.location.state.storyId}
                source={this.props.location.state.source}
                type={this.props.location.state.type}
                name={this.props.location.state.name}
                storyType={this.props.location.state.storyType}
                members={this.props.location.state.members}
              />
            </>
          ) : null}

          {this.props.location.state.element === "storyitemdivider" ? (
            <>
              <StoryItemDivider
                projectId={this.props.location.state.projectId}
                storyId={this.props.location.state.storyId}
                source={this.props.location.state.source}
                type={this.props.location.state.type}
                name={this.props.location.state.name}
                storyType={this.props.location.state.storyType}
              />
            </>
          ) : null}

          {this.props.location.state.element === "storyitemheading" ? (
            <>
              <StoryItemHeading
                projectId={this.props.location.state.projectId}
                storyId={this.props.location.state.storyId}
                source={this.props.location.state.source}
                type={this.props.location.state.type}
                name={this.props.location.state.name}
                storyType={this.props.location.state.storyType}
              />
            </>
          ) : null}

          {this.props.location.state.element === "storyitemsource" ? (
            <>
              <StoryItemSource
                projectId={this.props.location.state.projectId}
                storyId={this.props.location.state.storyId}
                source={this.props.location.state.source}
                type={this.props.location.state.type}
                name={this.props.location.state.name}
                storyType={this.props.location.state.storyType}
              />
            </>
          ) : null}

          {this.props.location.state.element === "storyitemlist" ? (
            <>
              <StoryItemList
                projectId={this.props.location.state.projectId}
                storyId={this.props.location.state.storyId}
                source={this.props.location.state.source}
                type={this.props.location.state.type}
                name={this.props.location.state.name}
                storyType={this.props.location.state.storyType}
              />
            </>
          ) : null}

          {this.props.location.state.element === "storyitemlink" ? (
            <>
              <StoryItemLink
                projectId={this.props.location.state.projectId}
                storyId={this.props.location.state.storyId}
                source={this.props.location.state.source}
                type={this.props.location.state.type}
                name={this.props.location.state.name}
                storyType={this.props.location.state.storyType}
              />
            </>
          ) : null}

          {this.props.location.state.element === "storyitembgcolor" ? (
            <>
              <StoryItemBackground
                projectId={this.props.location.state.projectId}
                storyId={this.props.location.state.storyId}
                source={this.props.location.state.source}
                type={this.props.location.state.type}
                name={this.props.location.state.name}
                storyType={this.props.location.state.storyType}
              />
            </>
          ) : null}

          {this.props.location.state.element === "htmlform" ? (
            <>
              <HtmlTextForm
                projectId={this.props.location.state.projectId}
                storyId={this.props.location.state.storyId}
                source={this.props.location.state.source}
                type={this.props.location.state.type}
                name={this.props.location.state.name}
                storyType={this.props.location.state.storyType}
                storyItemId={this.props.location.state.storyItemId}
              />
            </>
          ) : null}

          {this.props.location.state.element === "htmlStoryItem" ? (
            <>
              <EditHtmlStoryItems
                itemIndex={this.props.location.state.itemIndex}
                elementType={this.props.location.state.elementType}
                content={this.props.location.state.content}
                color={this.props.location.state.color}
                storyItemType={this.props.location.state.storyItemType}
                storyItemId={this.props.location.state.itemId}
              />
            </>
          ) : null}

          {this.props.location.state.element === "htmlformcolor" ? (
            <>
              <HtmlColorForm
                projectId={this.props.location.state.projectId}
                storyId={this.props.location.state.storyId}
                source={this.props.location.state.source}
                type={this.props.location.state.type}
                name={this.props.location.state.name}
                storyType={this.props.location.state.storyType}
                storyItemId={this.props.location.state.storyItemId}
              />
            </>
          ) : null}
        </div>
      </div>
    );
  }
}

export default FormCreator;
