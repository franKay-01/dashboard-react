import React, { Component } from "react";
import { Router, Switch, Route } from "react-router-dom";
import App from "./pages/accounts/App";
import Home from "./pages/accounts/home";
import Signup from "./pages/accounts/signup";
import FormCreator from "./components/forms/formCreator";
import ProjectPage from "./pages/dashboard/home_page";
import PackPage from "./pages/pack/pack_page";
import AllPacksPage from "./pages/pack/all_packs";
import NormalPacksPage from "./pages/pack/normal_pack";
import NormalStoryPage from "./pages/story/normal_story";
import AllNormalPacksPage from "./pages/pack/all_normal_pack";
import AllNormalStoriesPage from "./pages/story/all_normal_stories";
import AllStoriesPage from "./pages/story/all_stories";
import StoryPage from "./pages/story/story_page";
import EpisodePage from "./pages/story/episodes";
import StoryItemPage from "./pages/story/storyItem_page";
import StoryViewPage from "./pages/story/storyview_page";
import StoryItemHtmlPage from "./pages/story/storyitem_html";
import HtmlEditPage from "./pages/story/htmlEditPage";
import StoryPreviewPage from "./pages/story/story_preview_page";
import EpisodePreviewPage from "./pages/story/episode_preview";
import AllMembers from "./pages/story/all_members";
import AllAdverts from "./pages/adverts/all_adverts";
import AdvertPage from "./pages/adverts/advert_page";
import CreatorHome from "./pages/accounts/creator_home";
import ReviewPacks from "./pages/reviews/review_packs";
import ReviewStories from "./pages/reviews/review_stories";
import ReportPacks from "./pages/reviews/pack_report_page";
import ReportStory from "./pages/reviews/story_report_page";
import history from "./history";

class AppRouter extends Component {
  render() {
    return (
      <Router history={history}>
        <Switch>
          <Route exact path="/" component={App} />
          <Route exact path="/home" component={Home} />
          <Route exact path="/creator/home" component={CreatorHome} />
          <Route exact path="/account/create" component={Signup} />
          <Route exact path="/card/create" component={FormCreator} />
          <Route path="/open/project/:projectId" component={ProjectPage} />
          <Route path="/pack/:packId/:projectId" component={PackPage} />
          <Route path="/packs/:projectId" component={AllPacksPage} />
          <Route path="/normalPacks/:packId" component={NormalPacksPage} />
          <Route path="/normalStory/:storyId" component={NormalStoryPage} />
          <Route path="/reviewPack/:packId" component={ReportPacks} />
          <Route path="/reviewStory/:storyId" component={ReportStory} />
          <Route exact path="/checkPacks" component={ReviewPacks} />
          <Route exact path="/checkStories" component={ReviewStories} />
          <Route
            path="/allNormalPacks/:userId"
            component={AllNormalPacksPage}
          />
          <Route
            path="/allNormalStories/:userId"
            component={AllNormalStoriesPage}
          />
          {/* <Route path="/stickerAdd/:packId/:projectId" component={""}/> */}
          <Route path="/stories/:projectId" component={AllStoriesPage} />
          <Route path="/story/:storyId/:projectId" component={StoryPage} />
          <Route path="/members/:projectId" component={AllMembers} />
          <Route path="/adverts/:projectId" component={AllAdverts} />
          <Route path="/advert/:advertId/:projectId" component={AdvertPage} />
          <Route path="/storyPreview/:storyId" component={StoryPreviewPage} />
          <Route
            path="/episodePreview/:storyId"
            component={EpisodePreviewPage}
          />
          <Route path="/episode/:storyId/:projectId" component={EpisodePage} />
          <Route
            path="/htmlEdit/:storyItemId/:storyId"
            component={HtmlEditPage}
          />
          <Route
            path="/storyView/:storyId/:projectId"
            component={StoryViewPage}
          />
          <Route
            path="/storyitem/:source/:itemId/:projectId"
            component={StoryItemPage}
          />

          <Route
            path="/html/storyItem/:source/:itemId/:storyItemId/:projectId"
            component={StoryItemHtmlPage}
          />
        </Switch>
      </Router>
    );
  }
}

export default AppRouter;
