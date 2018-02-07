import React, { Component } from 'react'
import fire from '../fire';

class SessionPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            issues: []
        };
    }
    componentWillMount() {
        function getQueryStringParameter(paramToRetrieve) {
            var params = document.URL.split("?")[1].split("&");
            for (var ii in params) {
                var singleParam = params[ii].split("=");
                if (singleParam[0] === paramToRetrieve)
                    return singleParam[1];
            }
        };
        let sessionUid = getQueryStringParameter("uid");
        let dbRef = fire.database().ref('issues').orderByChild("session_uid").equalTo(sessionUid);
        dbRef.on('child_added', snapshot => {
            let issue = {
                title: snapshot.val().title,
                id: snapshot.key
            };
            this.setState({ issues: [issue].concat(this.state.issues) });
        })
    }
    render() {
        return (
            <div>
                <ul class="collection with-header">
                    <li class="collection-header"><h4>Issues</h4></li>
                    {
                        this.state.issues.map(issue =>
                            <li class="collection-item" key={issue.id}>
                                <div>{issue.title}</div>
                            </li>
                        )
                    }
                </ul>
            </div>
        );
    }
}

export default SessionPage;