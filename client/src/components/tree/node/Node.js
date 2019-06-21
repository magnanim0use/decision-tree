import React from 'react';
import { connect } from 'react-redux';

const Node = ({ nodes }) => (
  <div>
    Hi hello
  </div>
);

const mapStateToProps = state => {
  console.log('Node state:', state);
  return state;
};

export default connect(mapStateToProps)(Node);
