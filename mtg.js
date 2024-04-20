function initGoogleSignIn() {
    gapi.load("auth2", function () {
      gapi.auth2
        .init({
          client_id:
            "300755306065-rm4gd176lsf1b7pbkilso5e0oclt4kq9.apps.googleusercontent.com",
        })
        .then(function (auth2) {
          console.log("Google Sign-In initialized.");
        });
    });
  }