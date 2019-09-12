import React from 'react';
import { connect } from 'react-redux';

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
        // name: this.props.formData.name,
        // description: this.props.formData.description
        name: 'Placeholder name',
        description: 'Placeholder description'
      };
    }

    updateInput = (input, inputName) => {
      this.setState({
        [ inputName ]: input.target.value 
      });
    }

    render () {
        return (
          <div>
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
                    () => this.props.mode === 'EDIT' ? this.props.editNode({
                        id: this.props.formData.id,
                        name: this.state.name,
                        description: this.state.description
                      }
                    ) : this.props.mode === 'CREATE' ? this.props.createNode({
                        parentId: this.props.formData.parentId,
                        name: this.state.name
                    }) :
                      "Hi"
                  }
                >
                  Add / Update Node
                </div>
              }
              {
                <div
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
                </div>
              }
              {
                <div
                  onClick={
                    () => this.props.deleteNode({
                      id: this.props.formData.id,
                      parentId: this.props.formData.parentId
                    })
                  }
                >
                  Delete
                </div>
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
      activeNode
    }
  } = state;

  if (!mode || !activeNode) {
    return;
  }

  const {
    id,
    parentId,
    name,
    description
  } = activeNode;

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

