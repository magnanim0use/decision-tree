import React from 'react';
import { connect } from 'react-redux';
import Node from '../node/Node';
import render from '../render';

const data = require('../data.json');

const SVG = ({ nodes }) => {
  render(data);
  return (
    <div>
      // <div id='decision-tree-container' />
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
