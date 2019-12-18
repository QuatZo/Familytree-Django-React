// frontend/src/components/RelationshipModal.js

    import React, { Component } from "react";
    
    import {
      Button,
      Modal,
      ModalHeader,
      ModalBody,
      ModalFooter,
      Form,
      FormGroup,
      Label
    } from "reactstrap";

    export default class CustomModal extends Component {
      constructor(props) {
        super(props);
        this.state = { 
          activeItem: {
            user_id: localStorage.getItem("user_id"),
            id_1: this.props.activePersons[0],
            id_2: this.props.activePersons[1],
            relationships: 'father',
            color: this.genColor()
          },
          personList: this.props.personList,
        };
      }
      
      handleChange = (e) => {
        var relationship = [...this.state.activeItem.relationships];
        relationship = e.target.value;
        
        this.setState({
          activeItem: {
            user_id: this.state.activeItem.user_id, 
            id_1: this.state.activeItem.id_1, 
            id_2: this.state.activeItem.id_2, 
            relationships: relationship, 
            color: this.state.activeItem.color
          }
        });
      };

      getPerson(idPerson){
        var targetPerson = this.state.personList.find(item => item.id === idPerson);
        return targetPerson.first_name + " " + targetPerson.last_name;
      }

      genColor(){
        var randomColor = require('random-color');
        var color = randomColor(0.3, 0.99);
        return color.hexString();
      }

      render() {
        const { toggle, onSave } = this.props;
        return (
          <Modal isOpen={true} toggle={toggle}>
            <ModalHeader toggle={toggle}> Relationship</ModalHeader>
            <ModalBody>
              <Form>
                <FormGroup>
                  <Label for="relationship_choices">What's {this.getPerson(this.state.activeItem.id_1)} to the {this.getPerson(this.state.activeItem.id_2)}</Label>
                  <select
                    className="form-control"
                    name = "relationship_choices"
                    onChange={this.handleChange}
                    defaultValue="father"
                  >
                    <option value="father">Father</option>
                    <option value="mother">Mother</option>
                    <option value="brother">Brother</option>
                    <option value="sister">Sister</option>
                    <option value="son">Son</option>
                    <option value="daughter">Daughter</option>
                    <option value="adoptive son">Adoptive son</option>
                    <option value="adoptive daughter">Adoptive daughter</option>
                    <option value="surrogate father">Surrogate father</option>
                    <option value="surrogate mother">Surrogate mother</option>
                    <option value="stepbrother">Stepbrother</option>
                    <option value="stepsister">Stepsister</option>
                    <option value="stepson">Stepson</option>
                    <option value="stepdaughter">Stepdaughter</option>
                  </select>
                </FormGroup>
              </Form>
            </ModalBody>
            <ModalFooter>
              <Button color="success" onClick={() => onSave(this.state.activeItem)}>
                Save
              </Button>
            </ModalFooter>
          </Modal>
        );
      }
    }