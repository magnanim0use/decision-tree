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
          x, 
          y, 
          isActive
        } = this.props;

        const styles = {
          display: isActive ? 'block' : 'none',
          left: `${y + 110}px`,
          top: `${x - 20}px`
        };

        return (
          <div className='Tooltip' style={ styles }>
            <button onClick={ 
              () => this.props.initCreateNode(this.props.id) 
            }>Create Subnode</button>

            <button onClick={
              () => this.props.initEditNode(this.props.id)
            }>Edit</button>

            {
              this.props.children || this.props._children ?
                <button onClick={ 
                  () => this.props.toggleNode(this.props.id)
                }>{ this.props._children ? 'Expand' : 'Collapse' }</button>
              : null
            }
          </div>
        );
    } 
}

const mapDispatchToProps = (dispatch) => ({
    initCreateNode: (...args) => dispatch(initCreateNode(...args)),
    initEditNode: (...args) => dispatch(initEditNode(...args)),
    toggleNode: (...args) => dispatch(toggleNode(...args))
});

const mapStateToProps = (state, ownProps) => {
  const {
    tree: {
      activeNode
    }
  } = state;

  if (activeNode && activeNode.activeState === 'SHOW_OPTIONS' && activeNode.id !== ownProps.id) {
    const {
      id,
      position: {
        x, y
      },
      children,
      _children
    } = activeNode;

    return {
      isActive: true,
      id,
      x,
      y,
      children,
      _children
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

