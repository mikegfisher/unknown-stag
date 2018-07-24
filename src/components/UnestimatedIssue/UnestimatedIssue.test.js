import React from 'react';
import ReactDOM from 'react-dom';
import UnestimatedIssue from './UnestimatedIssue';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<UnestimatedIssue key={"unestimated_index"} id={"issueid"} owner={"this.state.owner"} title={"issue.title"} estimated={false} />, div);
  ReactDOM.unmountComponentAtNode(div);
});
