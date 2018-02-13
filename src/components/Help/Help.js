import React, { Component } from 'react';
import './Help.css';

class Help extends Component {
    constructor(props) {
        super(props);
        this.state = {
            helperClass: "hidden"
        };
        this.handleClick = this.handleClick.bind(this);
    }
    handleClick(e) {
        e.preventDefault();
        if(this.state.helperClass === "hidden") {
            this.setState({helperClass: ""});
            return;
        }
        this.setState({helperClass: "hidden"});
    }
    render() {
        return (
            <div className="help row">
            <div className={this.state.helperClass} >
                <div className="row">
                    <div className="col s12 l4">
                        <p>
                            Coming soon...
                        </p>
                    </div>
                </div>
                </div>
                <a onClick={(e) => this.handleClick(e)} className="btn-floating btn-large waves-effect waves-light red"><i className="material-icons">more_horiz</i></a>
            </div>
        )
    }
}
export default Help;