import '../../polyfill.js'
import React from 'react';
import ReactDOM from 'react-dom';
import fire from '../../fire';
import UnestimatedIssue from './UnestimatedIssue';

it('renders without crashing', () => {
  const div = document.createElement('div');
  let component = ReactDOM.render(<UnestimatedIssue key={"unestimated_index"} id={"issueid"} owner={"this.state.owner"} title={"issue.title"} estimated={false} />, div);
  let comp = ReactDOM.findDOMNode(component);
  component.updateIssue();
  component.removeIssue();
  component.submitEstimate();
  ReactDOM.unmountComponentAtNode(div);
});
