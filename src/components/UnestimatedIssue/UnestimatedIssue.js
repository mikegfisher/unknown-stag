import React, { Component } from 'react';
import fire from '../../fire'; 

class Issue extends Component {
    constructor(props) {
        super(props);
        this.state = {
            estimates: {}
        }
        this.updateIssue = this.updateIssue.bind(this);
        this.removeIssue = this.removeIssue.bind(this);
        this.submitEstimate = this.submitEstimate.bind(this);
    }
    componentWillMount() {
        let refEstimates = fire.database().ref('estimates/' + this.props.id);
        refEstimates.on('child_added', snapshot => {
            let estimate = {
                points: snapshot.val().points,
                id: snapshot.key, 
                photo: snapshot.val().creator_photoURL,
                name: snapshot.val().creator_displayName
            };
            if(snapshot.val().creator_uid === fire.auth().currentUser.uid) {
              this.inputS1.value = estimate.points;
            }
            let estimates = this.state.estimates;
            estimates[snapshot.key] = estimate;
            this.setState({ estimates });
        });
    }
    updateIssue(e) {
        fire.database().ref('issues').child(this.props.id).update({
            estimated: !this.props.estimated
        }).then(() => {}, (error) => {
            console.log(error); 
        });
    }
    removeIssue(e) {
        let ref = fire.database().ref('issues'); 
        let rmIssue = window.confirm("You are about to delete this issue!");
        if (rmIssue) {
            ref.child(this.props.id).remove().then(() => {}, (error) => {
                console.log(error); 
            });
        }
    }
    submitEstimate(e) {
        e.preventDefault();
        let p = 0;
        if (this.inputS1) {
            p = this.inputS1.value;
        }
        let newEstimate = fire.database().ref('estimates/' + this.props.id + '/' + fire.auth().currentUser.uid);
        return newEstimate.set({
            uid: newEstimate.key, 
            points: p, 
            creator_photoURL: fire.auth().currentUser.photoURL, 
            creator_displayName: fire.auth().currentUser.displayName, 
            creator_uid: fire.auth().currentUser.uid 
        }).then(() => {
            return fire.database().ref('estimates').child(this.props.id).once('value').then((snapshot) => {
                let estimates = Object.values(snapshot.val());
                let sum = 0;
                estimates.forEach(element => {
                    sum += parseInt(element.points,10);
                });
                let average = Math.ceil(sum / estimates.length);
                let issueRef = fire.database().ref('issues/' + this.props.id);
                return issueRef.update({
                    average: average
                });
            });
        }).catch((e) => {
            console.log(e);
        });
    }
    render() {
        return (
            <li className="collection-item">
                <div>{this.props.title}
                    <a href="" onClick={(e) => this.submitEstimate(e)} title="confirm estimate" className="secondary-content"><i className="material-icons">done</i></a>
                    <a href="" onClick={(e) => this.updateIssue(e)} hidden={!this.props.owner} title="toggle done" className="secondary-content"><i className="material-icons">compare_arrows</i></a>
                    <a href="" onClick={(e) => this.removeIssue(e)} hidden={!this.props.owner} title="delete issue" className="secondary-content"><i className="material-icons">delete_forever</i></a>
                    <form>
                        <p className="range-field">
                            <input type="range" min="1" max="10" ref={s1 => this.inputS1 = s1} />
                        </p>
                    </form>
                    {Object.values(this.state.estimates).map(estimate =>
                        <div className="chip" key={estimate.id} title={estimate.name} >
                            <img src={estimate.photo} alt="img" />
                            ?
                         </div>
                    )}
                    </div>
            </li>
        );
    }
}
export default Issue;