import React from 'react';
import { connect } from 'react-redux';
import './Input.css';
import { addNode } from '../../../redux/actions';

class AddNode extends React.Component {
  constructor(props) {
    super(props);
    this.state = { input: '' };
  }

  updateInput = input => {
    this.setState({ input });
  };

  handleAddNode = () => {
    this.props.addNode(this.state.input);
    this.setState({ input: '' });
  };

  render() {
    return (
      <div>
        <input
          onChange={e => this.updateInput(e.target.value)}
          value={this.state.input}
        />
        <button className="add-node" onClick={this.handleAddNode}>
          Add Node
        </button>
      </div>
    );
  }
}

export default connect(
  null,
  { addNode }
)(AddNode);
