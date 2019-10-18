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
      Input,
      Label
    } from "reactstrap";

    export default class CustomModal extends Component {
      constructor(props) {
        super(props);
        this.state = { 
          personList: this.props.personList,
          activePersons: this.props.activePersons,
          relationship_choices: ""
        };
      }
      handleChange = (e) => {
        var relationship = [...this.state.relationship_choices];
        relationship = e.target.value;
        this.setState({relationship_choices: relationship});
      };

      getPerson(idPerson){
        var targetPerson = this.state.personList.find(item => item.id === idPerson);
        return targetPerson.first_name + " " + targetPerson.last_name;
      }

      render() {
        const { toggle, onSave } = this.props;
        return (
          <Modal isOpen={true} toggle={toggle}>
            <ModalHeader toggle={toggle}> Relationship</ModalHeader>
            <ModalBody>
              <Form>
                <FormGroup>
                  <Label for="relationship_choices">What's the relation between {this.getPerson(this.state.activePersons[0])} and {this.getPerson(this.state.activePersons[1])}</Label>
                  <select
                    className="form-control"
                    name = "relationship_choices"
                    onChange={this.handleChange}
                  >
                    <option value="father">Father</option>
                    <option value="mother">Mother</option>
                    <option value="brother/sister">Brother or Sister</option>
                  </select>
                </FormGroup>
              </Form>
            </ModalBody>
            <ModalFooter>
              <Button color="success" onClick={() => onSave({"id_1": this.state.activePersons[0], "id_2": this.state.activePersons[1],"relationships": this.state.relationship_choices})}>
                Save
              </Button>
            </ModalFooter>
          </Modal>
        );
      }
    }