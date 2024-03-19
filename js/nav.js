"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login on click on "Log in / Sign up" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $navLogin.hide();
  $navLogOut.show();
  $loggedInNavs.show();
  $navUserProfile.text(`${currentUser.username}`).show();

}

/** When user clicks on submit navlink, show all stories and the submit story form */
function navSubmitClick (evt){
  console.debug("navSubmitClick", evt);
  $allStoriesList.show();
  $newStoryForm.show();
}

$("#nav-submit").on("click", navSubmitClick)

/** When user clicks on "my stories" show mystories page and put those stories on the page */
function navMyStoriesClick (evt) {
  console.debug("navSubmitClick", evt);
  hidePageComponents();
  $myStoriesList.show();
  putMyStoriesOnPage();
}

$("#nav-my-stories").on("click", navMyStoriesClick);

/** When user clicks on "favorites" in navbar show favorite list and put them on the page */
function navFavoritesClick (evt) {
  console.debug("navFavoritesClick", evt);
  hidePageComponents();
  $favoriteStoriesList.show();
  putFavoriteStoriesOnPage();
}

$("#nav-favorites").on("click", navFavoritesClick);

/** When use clicks on username in navbar, show account info page */
function navUserNameClick (evt) {
  console.debug("navUserNameClick", evt)
  hidePageComponents();
  $accountInfo.show();
}

$("#nav-user-profile").on("click", navUserNameClick);
