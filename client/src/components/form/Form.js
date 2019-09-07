import React from 'react';
import { connect } from 'react-redux';

import {
  createNode,
  editNode
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
                    () => this.props.mode ? this.props.editNode({
                      id: this.props.formData.id,
                      name: this.state.name,
                      description: this.state.description,
                      parentId: this.props.formData.parentId
                    }
                  ) : "Hi"
                }>
                  Add / Update Node
                </div>
              }
            </form>
          </div>
        );
    } 
}

const mapDispatchToProps = (dispatch) => ({
    createNode: (...args) => dispatch(createNode(...args)),
    editNode: (...args) => dispatch(editNode(...args))
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
      name,
      description
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Form);

