[![Maintainability](https://api.codeclimate.com/v1/badges/c2249bea7d10ab57b4b6/maintainability)](https://codeclimate.com/github/mikegfisher/unknown-stag/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/c2249bea7d10ab57b4b6/test_coverage)](https://codeclimate.com/github/mikegfisher/unknown-stag/test_coverage)
[![buddy pipeline](https://app.buddy.works/mikegfisher/unknown-stag/pipelines/pipeline/125711/badge.svg?token=cfedb8a2703ddaf7ed8698e6bd27444b34eb8cfd76f14bf643cc31af1dbdab1d "buddy pipeline")](https://app.buddy.works/mikegfisher/unknown-stag/pipelines/pipeline/125711)

# Unknown-Stag
Hey there! Unknown Stag is a points poker app. 

### What is points poker you ask? 
Points poker is a way to sort of gamify estimating the level of effort on a task (or user story). Users start by creating a points poker session where a team will get together to estimate a defined scope of work. Then, each team member will submit their estimates secretly until all estimates are submitted. **Not everyone is required to submit an estimate.** The session creator determines when an issue can be marked estimated. At that time, everyone's estimate will become visible, along with the average estimate (rounded up) across the team for that issue. 

### Cool, umm can you explain points a little bit to me?
Points are like miles on your project/product roadmap. Now, those of us who drive know that sometimes it takes less than a minute to travel a mile, but sometimes it takes 30 minutes. On average though, your velocity on roadtrips is probably about 55mph. This same concept can be applied to planning and estimating work on your projects. You just have to measure level of effort - points - consistently. 

## Live URLs
- https://stag.mikegfisher.com
- https://unknown-stag.firebaseapp.com

## Setup
1. `git clone`
2. `npm install`
3. Sign up for [Firebase](https://firebase.google.com) if you have not already. 
4. Update the `fire.js` file with your dev project config object. 
5. **NOTE** Step 4 is _mandatory_ - localhost is not an authorized domain for the production Firebase. 
6. `npm start`
