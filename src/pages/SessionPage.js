import React, { Component } from 'react'
import fire from '../fire';
import UnestimatedIssue from '../components/UnestimatedIssue/UnestimatedIssue'
import EstimatedIssue from '../components/EstimatedIssue/EstimatedIssue'
import './Pages.css';

class SessionPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            unestimated: {},
            estimated: {},
            sessionTitle: 'Session',
            owner: false
        };
        this.getQueryStringParameter = this.getQueryStringParameter.bind(this);
    }
    componentWillMount() {
        let sessionUid = this.getQueryStringParameter("uid");
        let refUnestimated = fire.database().ref('issues').orderByChild("session_uid").equalTo(sessionUid);
        refUnestimated.on('child_added', snapshot => {
            let issue = {
                title: snapshot.val().title,
                id: snapshot.key,
                estimated: snapshot.val().estimated,
                average: snapshot.val().average || 0
            };
            if (issue.estimated === false) {
                this.setState((prevState) => {
                    let unEst = prevState.unestimated;
                    unEst[snapshot.key] = issue;
                    return {
                        unestimated: unEst
                    }
                });
                return;
            }
            let estimated = this.state.estimated;
            estimated[snapshot.key] = issue;
            this.setState({ estimated });
        });
        fire.auth().onAuthStateChanged((user) => {
            if(user) {
                return fire.database().ref('sessions').child(sessionUid).once('value').then((snapshot) => {
                    this.setState({ sessionTitle: snapshot.val().title });
                    if (snapshot.val().creator_uid === fire.auth().currentUser.uid) {
                        this.setState({ owner: true })
                    }
                }, (error) => {
                    console.log(error);
                });
            }
        });
    }
    getQueryStringParameter(paramToRetrieve) {
        var params = document.URL.split("?")[1].split("&");
        for (var ii in params) {
            var singleParam = params[ii].split("=");
            if (singleParam[0] === paramToRetrieve)
                return singleParam[1];
        }
    }
    addIssue(e) {
        e.preventDefault();
        let sessionUid = this.getQueryStringParameter("uid");
        let newIssues = fire.database().ref('issues').push();
        return newIssues.set({
            uid: newIssues.key,
            title: this.inputE2.value,
            creator_photoURL: fire.auth().currentUser.photoURL,
            creator_displayName: fire.auth().currentUser.displayName,
            creator_uid: fire.auth().currentUser.uid,
            estimated: false,
            session_uid: sessionUid
        }).then(() => {
            this.inputE2.value = '';
        }, (error) => {
            console.log(error);
        });
    }
    render() {
        return (
            <div className="page">
                <div className="row">
                    <div className="col l12 s12">
                        <h3>{this.state.sessionTitle}</h3>
                    </div>
                </div>
                <div className="row">
                    <form className="col l12 s12" onSubmit={this.addIssue.bind(this)}>
                        <input placeholder="Create a new issue in this session..." id="new_issue" type="text" className="validate" ref={e2 => this.inputE2 = e2} />
                        <input className="btn waves-effect waves-light" type="submit" value="Go" />
                    </form>
                </div>
                <div className="row">
                    <div className="input-field col l6 s12">
                        <ul className="collection with-header">
                            <li className="collection-header grey lighten-4"><h4>Unestimated</h4></li>
                            {
                                Object.values(this.state.unestimated).map((issue, index) =>
                                    <UnestimatedIssue key={"unestimated_" + index} id={issue.id} owner={this.state.owner} title={issue.title} estimated={issue.estimated} />
                                )
                            }
                        </ul>
                    </div>
                    <div className="input-field col l6 s12">
                        <ul className="collection with-header">
                            <li className="collection-header grey lighten-4"><h4>Estimated</h4></li>
                            {
                                Object.values(this.state.estimated).map((issue, index) =>
                                    <EstimatedIssue key={"estimated_" + index} id={issue.id} owner={this.state.owner} avg={issue.average} title={issue.title} estimated={issue.estimated} />
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
