import firebase from 'firebase'
var config = {
    apiKey: "AIzaSyCDD_a-q0BYHG0l6sXTWYXB_jFXyuaZsG8",
    authDomain: "react-and-firebase-86540.firebaseapp.com",
    databaseURL: "https://react-and-firebase-86540.firebaseio.com",
    projectId: "react-and-firebase-86540",
    storageBucket: "react-and-firebase-86540.appspot.com",
    messagingSenderId: "145249821913"
  };
var fire = firebase.initializeApp(config);
export default fire;