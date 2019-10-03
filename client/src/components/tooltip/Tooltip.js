import React from 'react';
import { connect } from 'react-redux';
import ReactTooltip from 'react-tooltip';
import './Tooltip.css';

import {
  initCreateNode,
  initEditNode,
  toggleNode
} from '../../redux/actions';

class TooltipComponent extends React.Component {
    render () {
        const {
          x, y, isActive
        } = this.props;

        const styles = {
          position: 'absolute',
          display: isActive ? 'block' : 'none',
          left: `${y + 120}px`,
          top: `${x - 15}px`,
          pointer: 'cursor'
        };

        return (
          <div style={ styles }>
            <button onClick={ 
              () => this.props.initCreateNode(this.props.id) 
            }>Create</button>

            <button onClick={
              () => this.props.initEditNode(this.props.id)
            }>Edit</button>

            <button onClick={ 
              () => this.props.toggleNode(this.props.id)
            }>Collapse</button>
          </div>
        );
    } 
}

const mapDispatchToProps = (dispatch) => ({
    initCreateNode: (...args) => dispatch(initCreateNode(...args)),
    initEditNode: (...args) => dispatch(initEditNode(...args)),
    toggleNode: (...args) => dispatch(toggleNode(...args))
});

const mapStateToProps = state => {
  const {
    tree: {
      activeNode
    }
  } = state;

  if (activeNode && activeNode.activeState === 'SHOW_OPTIONS') {
    const {
      id,
      position: {
        x, y
      }
    } = activeNode;

    return {
      isActive: true,
      id,
      x,
      y
    }
  } else {
    return {
      isActive: false
    }
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TooltipComponent);

