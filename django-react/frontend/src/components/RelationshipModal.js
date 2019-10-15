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
          personList: this.props.personList,
          activePersons: this.props.activePersons,
          pair: []
        };
      }
      handleChange = (e) => {
        let { name, value } = e.target;
        const activeItem = { ...this.state.activeItem, [name]: value};
        this.setState({ activeItem });
      };

      getPerson(idPerson){
        var targetPerson = "";
        this.state.personList.map(item => {
          if(idPerson === item.id){
            targetPerson = item.first_name + " " + item.last_name;    
          }
        })
        return targetPerson;
      }

      render() {
        const { toggle, onSave } = this.props;
        return (
          <Modal isOpen={true} toggle={toggle}>
            <ModalHeader toggle={toggle}> Relationship</ModalHeader>
            <ModalBody>
              <Form>
                <FormGroup>
                  <Label for="status_choices">What's the relation between {this.getPerson(this.state.activePersons[0])} and {this.getPerson(this.state.activePersons[1])}</Label>
                  <select
                    className="form-control"
                    name = "status_choices"
                    onChange={this.handleChange}
                  >
                    <option value="living">Living</option>
                    <option value="deceased">Deceased</option>
                    <option value="unknown">Unknown</option>
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