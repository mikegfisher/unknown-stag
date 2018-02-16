import React, { Component } from 'react';
import fire from '../../fire'; 

class EstimatedIssue extends Component {
    constructor(props) {
        super(props);
        this.state = {
            estimates: {}
        }
        this.updateIssue = this.updateIssue.bind(this);
        this.removeIssue = this.removeIssue.bind(this);
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
            let estimates = this.state.estimates;
            estimates[snapshot.key] = estimate;
            this.setState({ estimates });
        });
    }
    updateIssue(e) {
        fire.database().ref('issues').child(this.props.id).update({
            estimated: !this.props.estimated
        }).then(() => {
        }, (error) => {
            console.log(error); 
        });
    }
    removeIssue(e) {
        let ref = fire.database().ref('issues'); 
        let rmIssue = window.confirm("You are about to delete this issue!");
        if (rmIssue) {
            ref.child(this.props.id).remove().then(() => {
            }, (error) => {
                console.log(error); 
            });
        }
    }
    render() {
        return (
            <li className="collection-item">
                <div>{this.props.title}
                    <a href="" onClick={(e) => this.updateIssue(e)} title="toggle done" className="secondary-content"><i className="material-icons">compare_arrows</i></a>
                    <a href="" onClick={(e) => this.removeIssue(e)} hidden={!this.props.owner} title="delete issue" className="secondary-content"><i className="material-icons">delete_forever</i></a>
                    <br />
                    {Object.values(this.state.estimates).map(estimate =>
                        <div className="chip" key={estimate.id} title={estimate.name}>
                            <img src={estimate.photo} alt="img" />
                            {estimate.points}
                         </div>
                    )}
                    <div className="chip">
                            <strong>Average:&nbsp;</strong>{this.props.avg}
                         </div>
                    </div>
            </li>
        );
    }
}
export default EstimatedIssue;