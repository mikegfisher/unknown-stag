import firebase from 'firebase'

const prod = {
  apiKey: "AIzaSyCIs2dqas2W0cP01QGOBzktScO0jeArv8k",
  authDomain: "unknown-stag.firebaseapp.com",
  databaseURL: "https://unknown-stag.firebaseio.com",
  projectId: "unknown-stag",
  storageBucket: "unknown-stag.appspot.com",
  messagingSenderId: "252990311284"
};
const fire = firebase.initializeApp(prod);

/* USE THIS FOR LOCAL DEV AND COMMENT OUT THE ABOVE
 
const dev = {
  apiKey: YOUR_API_KEY,
  authDomain: YOUR_AUTH_DOMAIN,
  databaseURL: YOUR_DATABASE_URL,
  projectId: YOUR_PROJECT_ID,
  storageBucket: '',
  messagingSenderId: YOUR_MESSAGING_SENDER_ID
}; 
const fire = firebase.initializeApp(dev);

*/

export default fire;