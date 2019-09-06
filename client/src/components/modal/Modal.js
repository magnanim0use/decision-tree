import React from 'react';
import { connect } from 'react-redux';
import Modal from 'react-modal';

import {
  createNode,
  editNode,
  closeModal
} from '../../redux/actions';

import fields from './fields.json';

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

    updateInput = (input, inputName) => {
      this.setState({
        name: input.target.value 
      })
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

              <h2>{ fields[ this.props.mode ] ? fields[ this.props.mode ].title : 'Hello' }</h2>
              <form>
                { 
                  fields[ this.props.mode ] ? fields[this.props.mode].inputs.map((inputValues) => {
                    return (
                      <div>
                        <h4>{ inputValues.title }</h4>
                        <input
                          type="text"
                          value={ this.state[inputValues.name] }
                          onChange={ (input) => this.updateInput(input, inputValues.name) }
                        >
                        </input>
                      </div>
                    );
                  }) : 'Hi'                  
                }
                {
                  <div  
                    onClick={
                      () => this.props.mode ? this.props.editNode({
                        name: this.state.input,
                        description: this.state.description,
                        parentId: this.props.parentId
                      }
                    ) : "Hi"
                  }>
                    Add / Update Node
                  </div>
                }
              </form>
              <button onClick={ this.props.closeModal }>close</button>
            </Modal>
          </div>
        );
    } 
}

const mapDispatchToProps = (dispatch) => ({
    createNode: (...args) => dispatch(createNode(...args)),
    editNode: (...args) => dispatch(editNode(...args)),
    closeModal: () => dispatch(closeModal())
});

const mapStateToProps = state => {
  const {
    modal: {
      mode,
      modalIsOpen,
      shouldCloseOnOverlayClick
    },
    tree: {
      activeNode
    }
  } = state;

  if (!mode || !activeNode) {
    return;
  }

  const {
    // status,
    parentId
  } = activeNode;

  return {
    mode,
    modalIsOpen,
    shouldCloseOnOverlayClick,
    parentId
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModalComponent);

