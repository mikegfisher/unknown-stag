import firebase from 'firebase'
import dotenv from 'dotenv'

dotenv.load();

/** @namespace process.env.API_KEY */
/** @namespace process.env.MESSAGING_SENDER_ID */
const fire = firebase.initializeApp({
    apiKey: process.env.API_KEY,
    authDomain: "unknown-stag.firebaseapp.com",
    databaseURL: "https://unknown-stag.firebaseio.com",
    projectId: "unknown-stag",
    storageBucket: "unknown-stag.appspot.com",
    messagingSenderId: process.env.MESSAGING_SENDER_ID
});

export default fire;