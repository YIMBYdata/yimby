// Client ID and API key from the Developer Console
var CLIENT_ID = '669688967165-jdem1dsa7fg1to3a84hq7l0chj8l7iog.apps.googleusercontent.com'

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ['https://sheets.googleapis.com/$discovery/rest?version=v4']

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = 'https://www.googleapis.com/auth/spreadsheets.readonly'

var gapi, authorizeButton, signoutButton

// TODO: moduleify properly
module.exports = {init}

function init () {
  window.handleClientLoad = handleClientLoad
  authorizeButton = document.getElementById('authorize-button')
  signoutButton = document.getElementById('signout-button')
}

/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad () {
  gapi = window.gapi
  gapi.load('client:auth2', initClient)
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient () {
  gapi.client.init({
    discoveryDocs: DISCOVERY_DOCS,
    clientId: CLIENT_ID,
    scope: SCOPES
  }).then(function () {
    console.log('INIT CLIENT DONE')
    // Listen for sign-in state changes.
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus)

    // Handle the initial sign-in state.
    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get())
    authorizeButton.onclick = handleAuthClick
    signoutButton.onclick = handleSignoutClick
  })
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus (isSignedIn) {
  if (isSignedIn) {
    authorizeButton.style.display = 'none'
    signoutButton.style.display = 'block'
    listMajors()
  } else {
    authorizeButton.style.display = 'block'
    signoutButton.style.display = 'none'
  }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick (event) {
  gapi.auth2.getAuthInstance().signIn()
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick (event) {
  gapi.auth2.getAuthInstance().signOut()
}

/**
 * Append a pre element to the body containing the given message
 * as its text node. Used to display the results of the API call.
 *
 * @param {string} message Text to be placed in pre element.
 */
function appendPre (message) {
  var pre = document.getElementById('content')
  var textContent = document.createTextNode(message + '\n')
  pre.appendChild(textContent)
}

/**
 * Print the names and majors of students in a sample spreadsheet:
 * https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 */
function listMajors () {
  gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
    range: 'Class Data!A2:E'
  }).then(function (response) {
    var range = response.result
    if (range.values.length > 0) {
      appendPre('Name, Major:')
      for (var i = 0; i < range.values.length; i++) {
        var row = range.values[i]
        // Print columns A and E, which correspond to indices 0 and 4.
        appendPre(row[0] + ', ' + row[4])
      }
    } else {
      appendPre('No data found.')
    }
  }, function (response) {
    appendPre('Error: ' + response.result.error.message)
  })
}
