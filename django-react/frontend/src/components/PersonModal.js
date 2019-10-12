// frontend/src/components/PersonModal.js

    import React, { Component } from "react";
    import Select from 'react-select';
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
    import Choices from '../Person';

    

    export default class CustomModal extends Component {
      constructor(props) {
        super(props);
        this.state = {
          activeItem: this.props.activeItem
        };
      }
      handleChange = e => {
        let { name, value } = e.target;
        // Doesn't work, needed DateTime Field
        //if (e.target.name === "birth_date") {
        //  if(e.target.value.length === 10){
        //    console.log(Date.parse(e.target.value));
        //    e.target.value = Date.parse(e.target.value);
        //  }
        // }
        const activeItem = { ...this.state.activeItem, [name]: value };
        this.setState({ activeItem });
      };
      render() {
        const { toggle, onSave } = this.props;
        return (
          <Modal isOpen={true} toggle={toggle}>
            <ModalHeader toggle={toggle}> Person </ModalHeader>
            <ModalBody>
              <Form>
              <FormGroup>
                  <Label for="first_name">First Name</Label>
                  <Input
                    type="text"
                    name="first_name"
                    value={this.state.activeItem.first_name}
                    onChange={this.handleChange}
                    placeholder="Mordo"
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="last_name">Last Name</Label>
                  <Input
                    type="text"
                    name="last_name"
                    value={this.state.activeItem.last_name}
                    onChange={this.handleChange}
                    placeholder="Mordeczko"
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="birth_date">Birth Date</Label>
                  <Input
                    type="text"
                    name="birth_date"
                    value={this.state.activeItem.birth_date}
                    onChange={this.handleChange}
                    placeholder="Tu bedzie wybieranie daty, kiedys..."
                  />
                </FormGroup>
            <FormGroup>
                  <Label for="status_choices">Status of life</Label>
                  <Select
                    onChange={this.handleChange}
                    options={Choices}
                    placeholder="Czy Ty kurwa zyjesz szmato jebana czy nie?"
                    clearable={false}
                    //onClose={this.closeSelect}
                    value={this.state.activeItem.status_choices} />
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