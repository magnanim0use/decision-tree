import React from 'react';
import { connect } from 'react-redux';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};

class ModalComponent extends React.Component {
    constructor(props) {
      super(props);
      this.state = { input: '' };
    }

    updateInput = event => {
        this.setState({ 
            input: event.target.value
        });
    }

    render () {
        return (
          <div>
            <Modal
              isOpen={this.props.modalIsOpen}
              shouldCloseOnOverlayClick={this.props.shouldCloseOnOverlayClick}
              style={customStyles}
              contentLabel="Nodal"
            >

              <h2>Hello</h2>
              <div>Create a Node</div>
              <form>
                <input
                    value={this.state.input}
                    onChange={(input) => this.updateInput(input)}
                / >
                <div className="add-node" onClick={() => this.props.createNode(this.state.input)}>
                  Add Node
                </div>
              </form>
              <button onClick={this.props.closeModal}>close</button>
            </Modal>
          </div>
        );
    } 
}

const createNode = (name) => ({
    type: 'CREATE_NODE',
    payload: {
        name
    }
});

const closeModal = () => ({
    type: 'CLOSE_MODAL'
});

const mapDispatchToProps = (dispatch) => ({
    createNode: (...args) => dispatch(createNode(...args)),
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

