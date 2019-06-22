import React from 'react';
import { connect } from 'react-redux';

const Node = ({ node }) => (
  <div>
    { node }
  </div>
);

const mapStateToProps = state => {
	const {
		tree: {
			nodes = []
		}
	} = state;

	if (!nodes.length) {
		return;
	}

  	return { node: nodes[ nodes.length - 1 ] };
};

export default connect(mapStateToProps)(Node);
