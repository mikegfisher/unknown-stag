import React, { Component } from 'react';

import fire from '../fire';

class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: []
        }
    }
    componentWillMount() {
        let dbRef = fire.database().ref('messages').orderByKey().limitToLast(100);
        dbRef.on('child_added', snapshot => {
            let message = { text: snapshot.val(), id: snapshot.key };
            this.setState({ messages: [message].concat(this.state.messages) });
        })
    }
    addMessage(e) {
        e.preventDefault();
        fire.database().ref('messages').push(this.inputE1.value);
        this.inputE1.value = '';
    }

    render() {
        return (
            <form onSubmit={this.addMessage.bind(this)}>
                <input type="text" ref={e1 => this.inputE1 = e1} />
                <input type="submit" />
                <ul>
                    {this.state.messages.map(message => <li key={message.id}>{message.text}</li>)}
                </ul>
            </form>
        );
    }
}


export default HomePage;