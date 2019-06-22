import React from 'react';
import { connect } from 'react-redux';
import Node from '../node/Node';

const SVG = ({ nodes }) => {
  return (
    <div>
      <svg>
      </svg>
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
    tree: {
      nodes 
    }
  } = state;
  return { nodes };
};

export default connect(mapStateToProps)(SVG);
