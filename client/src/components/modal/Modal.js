import React from 'react';
import { connect } from 'react-redux';
import Modal from 'react-modal';
import Form from '../form/Form';
import './Modal.css';

import {
  closeModal
} from '../../redux/actions';

Modal.setAppElement('#root');

class ModalComponent extends React.Component {
    render () {
        return (
          <div>
            <Modal
              isOpen={this.props.modalIsOpen}
              shouldCloseOnOverlayClick={this.props.shouldCloseOnOverlayClick}
              contentLabel="Nodal"
            >
              <Form />
              <div onClick={ this.props.closeModal }>Close</div>
            </Modal>
          </div>
        );
    } 
}

const mapDispatchToProps = (dispatch) => ({
    closeModal: () => dispatch(closeModal())
});

const mapStateToProps = state => {
  const {
    modal: {
      modalIsOpen,
      shouldCloseOnOverlayClick
    },
    tree: {
      activeNode
    }
  } = state;

  if (!activeNode) {
    return;
  }

  return {
    modalIsOpen,
    shouldCloseOnOverlayClick
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModalComponent);

