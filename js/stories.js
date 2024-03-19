"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  const starFilled = Boolean(currentUser);

  return $(`
      <li id="${story.storyId}">
        <section class="story-section">
        ${starFilled ? makeStarElement(story, currentUser): ""}
          <span class="story-details">
            <span class="story-topLine">
              <a href="${story.url}" target="a_blank" class="story-link story-title">
              ${story.title}
              </a>
              <small class="story-hostname">(${hostName})</small>
            </span>
            <small class="story-author">by ${story.author}</small>
            <small class="story-user">posted by ${story.username}</small>
          </span>
          <span id="trash-span" class="hidden"><i class="fa fa-trash-alt"></i></span>
        </section>
      </li>
    `);
}

/** Make the HTML for the Star button */

function makeStarElement (story, user) {
  const favorite = user.favoriteStory(story);
  const starStatus = favorite ? "checked" : "";
  return `<i class="${starStatus} fa fa-star"></i>`;

}
/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

/** Submit new stories using values from the my stories form.
 * Generate HTML, add it to the beginning of the stories list and reset the fields on the form
 */ 
async function submitNewStories (evt) {
  evt.preventDefault();
  console.debug("newStoryForm", evt);

  let newStory = await storyList.addStory( currentUser,
    {title: $newStoryTitle.val(), 
    author: $newStoryAuthor.val(), 
    url: $newStoryUrl.val()});

  const $newStory = generateStoryMarkup(newStory);
  $allStoriesList.prepend($newStory);
  $newStoryForm.trigger("reset");
}

$newStoryForm.on("submit", submitNewStories);


/** Delete a story that was added by the user.  Call the removeStory
 * method from StoryList class.  Update my Stories page
 */
async function deleteNewStory (evt) {
  console.debug('deleteNewStory', evt);

  const $parentLi = $(evt.target).closest("li");
  const storyId = $parentLi.attr("id");

  await storyList.removeStory(currentUser, storyId);
  await putMyStoriesOnPage();

}

$myStoriesList.on("click", ".fa-trash-alt", deleteNewStory);

/** empty the myStories List.  If the current users stores array is 0, display message
 * If there are items in the array, generate html for each, make the trash icon not hidden
 * and add html to the myStories List
 */
function putMyStoriesOnPage () {
  console.debug("putMyStoriesOnPage");

  $myStoriesList.empty();

  if (currentUser.ownStories.length === 0) {
    $myStoriesList.append("<h4>No stories found....</h4>")
  }
  else {
    for (let story of currentUser.ownStories) {
      let $story = generateStoryMarkup(story);
      $story.find("#trash-span").removeClass("hidden");
      $myStoriesList.append($story);
    }
  }
}

/** empty the favorites story list
 * if the user's favorites array is empty, display message
 * if the user's favorites array is not empty, generate HTML for each story
 * and append it to the Favorites Stories List
 */
function putFavoriteStoriesOnPage() {
  console.debug("putFavoriteStoriesOnPage");

  $favoriteStoriesList.empty();

  if (currentUser.favorites.length === 0) {
    $favoriteStoriesList.append("<h4>No favorites added...</h4>");
  } else {
    // loop through all of users favorites and generate HTML for them
    for (let story of currentUser.favorites) {
      const $story = generateStoryMarkup(story);
      $favoriteStoriesList.append($story);
    }
  }
}

/** Handle whether the star is checked or not checked */

async function toggleFavoriteStory(evt) {
  console.debug("toggleStoryFavorite");

  const $target = $(evt.target);
  const $closestLi = $target.closest("li");
  const storyId = $closestLi.attr("id");
  const story = storyList.stories.find(s => s.storyId === storyId);

  // If item is starred
  if ($target.hasClass("checked")) {
    // currently a favorite: remove from user's fav list and change star
    await currentUser.removeFavoriteStory(story);
    $target.closest("i").toggleClass("checked");
    // If item is not starred
  } else {
    await currentUser.addFavoriteStory(story);
    $target.closest("i").toggleClass("checked");
  }
  putFavoriteStoriesOnPage();
}

$(".stories-list").on("click", ".fa-star", toggleFavoriteStory);