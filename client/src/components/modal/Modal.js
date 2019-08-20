import React from 'react';
import { connect } from 'react-redux';

const Modal = ({ nodes }) => {
  return (
    <div>
      <div id='decision-tree-container' />
      <ul>
        {nodes && nodes.length
          ? nodes.map((node, index) => {
              return <Node key={index} node={node} />;
            })
          : 'No nodes, yay!!'}
      </ul>
    </div>
  )
};

const mapStateToProps = state => {
  const { 
    modal = {
      isOpen
    }
  } = state;

  return { modal };
};

export default connect(mapStateToProps)(Modal);