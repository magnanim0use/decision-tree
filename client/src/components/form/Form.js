import React from 'react';
import { connect } from 'react-redux';
import './Form.css';

import {
  findNodeById
} from '../../helpers';

import {
  createNode,
  editNode,
  deleteNode
} from '../../redux/actions';

import fields from './fields.json';

class Form extends React.Component {
    constructor(props) {
      super(props);
      this.state = { 
        name: this.props.formData.name || 'Name of Node',
        description: this.props.formData.description || 'Description of Node'
      };
    }

    updateInput = (input, inputName) => {
      this.setState({
        [ inputName ]: input.target.value 
      });
    }

    render () {
        const fieldMode = fields[ this.props.mode ];

        return (
          <div className='Form'>
            <h2 className='FormTitle'>{ fieldMode.title }</h2>
            <form>
              { 
                fieldMode.inputs.map((inputValues) => {
                  return (
                    <div className={ `FormInput FormInput_${ inputValues.title }` }>
                      <h4>{ inputValues.title }</h4>
                      <input
                        type="text"
                        value={ this.state[inputValues.name] }
                        onChange={ 
                          (input) => this.updateInput(input, inputValues.name) 
                        }
                      >
                      </input>
                    </div>
                  );
                })                 
              }

              {
                this.props.mode === 'CREATE' ?
                  <div>
                    <button className='FormButton' 
                      onClick={
                        () => this.props.createNode({
                            parentId: this.props.formData.parentId,
                            name: this.state.name,
                            description: this.state.description
                        })
                      }
                    >
                      Create Node
                    </button>
                  </div>
                :
                this.props.mode === 'EDIT' ?
                  <div>
                    <button className='FormButton' 
                      onClick={
                        () => this.props.editNode({
                            id: this.props.formData.id,
                            name: this.state.name,
                            description: this.state.description
                        })
                      }
                    > 
                      Update Node
                    </button>
                    <button className='FormButton' 
                      onClick={
                        () => this.props.editNode({
                          id: this.props.formData.id,
                          status: 'COMPLETE',
                          name: this.state.name,
                          description: this.state.description
                        })
                      }
                    >
                      Mark As Complete
                    </button>
                    <button className='FormButton' 
                      onClick={
                        () => this.props.deleteNode({
                          id: this.props.formData.id,
                          parentId: this.props.formData.parentId
                        })
                      }
                    >
                      Delete
                    </button> 
                  </div>
                : null  
              }                 
            </form>
          </div>
        );
    } 
}

const mapDispatchToProps = (dispatch) => ({
    createNode: (...args) => dispatch(createNode(...args)),
    editNode: (...args) => dispatch(editNode(...args)),
    deleteNode: (...args) => dispatch(deleteNode(...args))
});

const mapStateToProps = state => {
  const {
    form: {
      mode
    },
    tree: {
      activeNode,
      data
    }
  } = state;

  if (!mode || !activeNode) {
    return;
  }

  const {
    id,
    parentId
  } = activeNode;

  const {
    name,
    description,
    status
  } = findNodeById(data, id);

  return {
    mode,
    formData: {
      id,
      parentId,
      name,
      description
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Form);

