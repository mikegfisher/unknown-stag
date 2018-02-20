import firebase from 'firebase'

// PROD: unknown-stag
// eslint-disable-next-line
const prod = {
  apiKey: "AIzaSyCIs2dqas2W0cP01QGOBzktScO0jeArv8k",
  authDomain: "unknown-stag.firebaseapp.com",
  databaseURL: "https://unknown-stag.firebaseio.com",
  projectId: "unknown-stag",
  storageBucket: "unknown-stag.appspot.com",
  messagingSenderId: "252990311284"
};
// DEV: dev-unknown-stag
// eslint-disable-next-line
const dev = {
  apiKey: "AIzaSyBGTTfOV0QXSKMb6WI1JbiHWeFbHWogCyw",
    authDomain: "dev-unknown-stag.firebaseapp.com",
    databaseURL: "https://dev-unknown-stag.firebaseio.com",
    projectId: "dev-unknown-stag",
    storageBucket: "dev-unknown-stag.appspot.com",
    messagingSenderId: "9688286635"
};

//const fire = firebase.initializeApp(prod);
const fire = firebase.initializeApp(dev);

export default fire;
