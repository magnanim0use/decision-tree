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
  render () {
    return (
      <div>
        <Modal
          isOpen={this.props.modalIsOpen}
          style={customStyles}
          contentLabel="Example Modal"
        >
    
          <h2>Hello</h2>
          <div>I am a modal</div>
          <form>
            <input />
            <button>tab navigation</button>
            <button>stays</button>
            <button>inside</button>
            <button>the modal</button>
          </form>
        </Modal>
      </div>
    );
  }
  // constructor() {
  //   super();
 
  //   this.state = {
  //     modalIsOpen: false
  //   };
 
  //   this.openModal = this.openModal.bind(this);
  //   this.afterOpenModal = this.afterOpenModal.bind(this);
  //   this.closeModal = this.closeModal.bind(this);
  // }
 
  // openModal() {
  //   this.setState({modalIsOpen: true});
  // }
 
  // afterOpenModal() {
  //   this.subtitle.style.color = '#f00';
  // }
 
  // closeModal() {
  //   this.setState({ modalIsOpen: false });
  // }
 
}

const mapStateToProps = state => {
  const {
    modal: {
      modalIsOpen
    }
  } = state;

  return {
    modalIsOpen
  };
};

export default connect(
  mapStateToProps
)(ModalComponent);

