import React, { Component } from 'react';
import fire from '../../fire'; // 🔥

class Issue extends Component {
    constructor(props) {
        super(props);
        this.state = {
            estimates: {}
        }
        // "this" is a thing
        this.updateIssue = this.updateIssue.bind(this); 
        this.removeIssue = this.removeIssue.bind(this); 
    }
    componentWillMount() {
        /*let refEstimates = fire.database().ref('estimates').orderByChild("issue_uid").equalTo(sessionUid);
        refEstimates.on('child_added', snapshot => {
            let estimate = {
                num: snapshot.val().num,
                id: snapshot.key
            };
            let estimates = this.state.estimates;
            estimates[snapshot.key] = estimate;
            this.setState({ estimates });
        });*/
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
                <li className="collection-item" key={this.props.id}>
                    <div>{this.props.title}
                        <a href="" onClick={(e) => this.updateIssue(e, this.props.id, !this.props.estimated)} title="toggle done" id={this.props.id} className="secondary-content"><i className="material-icons">compare_arrows</i></a>
                        <a href="" onClick={(e) => this.removeIssue(e, this.props.id)} title="delete issue" id={this.props.id} className="secondary-content"><i className="material-icons">delete_forever</i></a>
                    </div>
                </li>
        );
    }
}
export default Issue;