import React, { Component } from 'react'
import fire from '../fire'; // 🔥

class SessionPage extends Component {
    constructor(props) {
        super(props);
        this.state = { // alright unestimated stuff on the left, estimated stuff on the right (bottom when mobile)
            unestimated: {}, 
            estimated: {}
        };
        // "this" is a thing
        this.updateIssue = this.updateIssue.bind(this); 
        this.removeIssue = this.removeIssue.bind(this); 
    }
    componentWillMount() {
        // 👇 this is janky and is going to go away
        function getQueryStringParameter(paramToRetrieve) {
            var params = document.URL.split("?")[1].split("&");
            for (var ii in params) {
                var singleParam = params[ii].split("=");
                if (singleParam[0] === paramToRetrieve)
                    return singleParam[1];
            }
        };
        let sessionUid = getQueryStringParameter("uid");
        // ☝️ that was janky and is going to go away

        let refUnestimated = fire.database().ref('issues').orderByChild("session_uid").equalTo(sessionUid);
        refUnestimated.on('child_added', snapshot => {
            let issue = {
                title: snapshot.val().title,
                id: snapshot.key, 
                estimated: snapshot.val().estimated
            };
            let unestimated = this.state.unestimated;
            if(issue.estimated === false) {
                unestimated[snapshot.key] = issue;
                this.setState({ unestimated });
                return;
            }
            let estimated = this.state.estimated;
            estimated[snapshot.key] = issue;
            this.setState({ estimated });
        });
    }
    addIssue(e) {
        e.preventDefault(); // 🙏🏻 don't do this when the component loads

        // 👇 this is janky and is going to go away
        function getQueryStringParameter(paramToRetrieve) {
            var params = document.URL.split("?")[1].split("&");
            for (var ii in params) {
                var singleParam = params[ii].split("=");
                if (singleParam[0] === paramToRetrieve)
                    return singleParam[1];
            }
        };
        let sessionUid = getQueryStringParameter("uid");
        // ☝️ that was janky and is going to go away

        let newIssues = fire.database().ref('issues').push(); // get the key for a new issue
        return newIssues.set({
            uid: newIssues.key, // sometimes the key is easier to grab from here
            title: this.inputE2.value, // literally, why are you even doing this?
            creator_photoURL: fire.auth().currentUser.photoURL, // so we can quickly plaster mugs all over d'place
            creator_displayName: fire.auth().currentUser.displayName, // "Well he's gotta have a name dun'he?" - @hagrid 
            creator_uid: fire.auth().currentUser.uid, // yeah I see you!
            estimated: false, 
            session_uid: sessionUid
        }).then(() => {
            this.inputE2.value = ''; // whoop! we're done, ready for the next one!
        }, (error) => {
            console.log(error); // because errors
        });
    }
    updateIssue(e, id, bln) {
        fire.database().ref('issues').child(id).update({ estimated: bln }).then(() => {
            // aw look you did a thing 👍
        }, (error) => {
            console.log(error); // because errors
        });
    }
    removeIssue(e, id) {
        let ref = fire.database().ref('issues'); // get ready to delete the thing
        let rmIssue = window.confirm("You are about to delete this issue!");
        if (rmIssue) {
            ref.child(id).remove().then(() => {
                // successfully removed issue 👍
            }, (error) => {
                console.log(error); // because errors
            });
        }
    }
    render() {
        return (
            <div>
                <div className="row">
                    <form className="col s12" onSubmit={this.addIssue.bind(this)}>
                        <input placeholder="Create a new issue" id="new_issue" type="text" className="validate" ref={e2 => this.inputE2 = e2} />
                        <input className="btn waves-effect waves-light" type="submit" value="Do it!" />
                    </form>
                </div>
                <div className="row">
                    <div className="input-field col s6">
                        <ul class="collection with-header">
                            <li class="collection-header"><h4>Unestimated Issues</h4></li>
                            {
                                Object.values(this.state.unestimated).map(issue =>
                                    <li class="collection-item" key={issue.id}>
                                        <div>{issue.title}
                                            <a href="" onClick={(e) => this.updateIssue(e, issue.id, true)} title="confirm estimate" id={issue.id} className="secondary-content"><i className="material-icons">done</i></a>
                                            <a href="" onClick={(e) => this.removeIssue(e, issue.id)} title="confirm estimate" id={issue.id} className="secondary-content"><i className="material-icons">delete_forever</i></a>
                                        </div>
                                    </li>
                                )
                            }
                        </ul>
                    </div>
                    <div className="input-field col s6">
                        <ul class="collection with-header">
                            <li class="collection-header"><h4>Estimated Issues</h4></li>
                            {
                                Object.values(this.state.estimated).map(issue =>
                                    <li class="collection-item" key={issue.id}>
                                        <div>{issue.title}
                                            <a href="" onClick={(e) => this.updateIssue(e, issue.id, false)} title="confirm estimate" id={issue.id} className="secondary-content"><i className="material-icons">cancel</i></a>
                                            <a href="" onClick={(e) => this.removeIssue(e, issue.id)} title="confirm estimate" id={issue.id} className="secondary-content"><i className="material-icons">delete_forever</i></a>
                                        </div>
                                    </li>
                                )
                            }
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
}

export default SessionPage;