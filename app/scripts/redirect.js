function redirect() {
    if(firebase.auth().currentUser) {
        $("#login").hide();
        $("#logout").show();
      } else {
        $("#login").show();
        $("#logout").hide();
        window.location("#/");
      }
}
