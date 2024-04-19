// Get the button
let mybutton = document.getElementById("myBtn");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function() {
  scrollFunction();
};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

// Initialize the client library
function handleClientLoad() {
  gapi.load('client:auth2', loadClient);


// Set up event listeners
document.getElementById('authorize_button').onclick = handleSignInClick;
document.getElementById('signout_button').onclick = handleSignOutClick;
}

let call = function(){
// Load the Google API client library
function loadClient() {
  gapi.load('client:auth2', initClient);
}

// Initialize the API client library
function initClient() {
  gapi.client.init({
    clientId: '300755306065-rm4gd176lsf1b7pbkilso5e0oclt4kq9.apps.googleusercontent.com',
    scope: 'https://www.googleapis.com/auth/spreadsheets',
    discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
  }).then(function() {
    // Listen for sign-in state changes
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSignInStatus);

    // Handle the initial sign-in state
    updateSignInStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
  });
}

// Sign in the user upon button click
function handleSignInClick(event) {
  gapi.auth2.getAuthInstance().signIn();
}

// Sign out the user upon button click
function handleSignOutClick(event) {
  gapi.auth2.getAuthInstance().signOut();
}

// Update the sign-in status
function updateSignInStatus(isSignedIn) {
  if (isSignedIn) {
    // User is signed in, make API calls
    listData();
  } else {
    // User is not signed in, show sign-in button
    // Example: displaySignInButton();
  }

}


// Fetch data from Google Sheet
function listData() {
  gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: '1G6asWIHyrmjP85lkVrqkuMGK7GJMbalTfYr-tjCNE_k',
    range: 'Sheet1!A2'  // Range to read data from
  }).then(function(response) {
    var data = response.result.values;
    if (data.length > 0) {
      // Process and display data
      console.log(data);
    } else {
      console.log('No data found.');
    }
  }, function(response) {
    console.error('Error fetching data: ' + response.result.error.message);
  });
}




}