# React ❤️ Firebase
Firebase is a great JSON based realtime database that let's you easily bind their db objects to DOM objects - which plays very well with React. 

## Pre-reqs
This project was created using `create-react-app` and assumes a basic understanding of React. 

## Setup
1. You'll need to sign up for a [Firebase](https://firebase.com) account if you don't have one already. 
2. Create a Firebase project that you want to use for this. 
3. Get the config for your Firebase database from the Project Settings by clicking the big red button that says, _Add Firebase to your web app_.
4. Replace the config object in `src/fire.js` with the config object from **Step 3**. 
5. In the console, run:
- `npm install`
- `npm install -g firebase-tools` (if you don't already have it)
- `firebase init` - select **Database** and **Hosting**, then press *Enter*. Select the Firebase project that you created earlier. Keep the database rules file by pressing *Enter*. You'll want to use "build" for the public directory (for deploying with Firebase hosting), as this is the directory that has been optimized for production. Select yes to configure as a single page app. Do **NOT** overwrite the index.html file - type "N" and press *Enter*. 
6. When you're ready, in the console execute, `npm run deploy` (this is configured in the package.json file) or `firebase deploy`. 
7. You can run the app locally by executing `npm start`.
