import React from 'react';
import { connect } from 'react-redux';
import ReactModal from 'react-modal';
import Form from '../form/Form';
import './Modal.css';

import {
  closeModal
} from '../../redux/actions';

ReactModal.setAppElement('#root');

class ModalComponent extends React.Component {
    render () {
        return (
          <div>
            <ReactModal
              isOpen={this.props.modalIsOpen}
              shouldCloseOnOverlayClick={true}
              className='Modal'
            >
              <div className='CloseButton' onClick={ this.props.closeModal } />
              <Form />
            </ReactModal>
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
    }
  } = state;

  return {
    modalIsOpen,
    shouldCloseOnOverlayClick
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModalComponent);

