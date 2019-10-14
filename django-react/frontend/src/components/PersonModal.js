// frontend/src/components/PersonModal.js

    import React, { Component } from "react";
    import DatePicker from "react-datepicker";
    
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
          activeItem: this.props.activeItem
        };
      }
      handleChange = (e) => {
        let { name, value } = e.target;
        const activeItem = { ...this.state.activeItem, [name]: value};
        this.setState({ activeItem });
      };
      handleChange1 = date => {
        const activeItem = { ...this.state.activeItem, ["birth_date"]: (new Date(date)).toISOString().slice(0, 10)};
        console.log(activeItem);
        this.setState({activeItem});
        console.log(this.state);
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
                    placeholder="First Name"
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="last_name">Last Name</Label>
                  <Input
                    type="text"
                    name="last_name"
                    value={this.state.activeItem.last_name}
                    onChange={this.handleChange}
                    placeholder="Last Name"
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="birth_date">Birth Date</Label><br />
                  <DatePicker 
                  className="form-control"
                    name="birth_date"
                    value={this.state.activeItem.birth_date}
                    onChange={ this.handleChange1} />
                </FormGroup>
                <FormGroup>
                  <Label for="status_choices">Status of life</Label>
                  <select
                    className="form-control"
                    name = "status_choices"
                    value={this.state.activeItem.status_choices}
                    onChange={this.handleChange}
                  >
                    <option value="living">Living</option>
                    <option value="deceased">Deceased</option>
                    <option value="unknown">Unknown</option>
                  </select>
                </FormGroup>
                <FormGroup>
                  <Label for="sex_choices">Sex</Label>
                  <select
                    className="form-control"
                    name = "sex_choices"
                    value={this.state.activeItem.sex_choices}
                    onChange={this.handleChange}
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </FormGroup>
                <FormGroup>
                  <Label for="birthplace">Birthplace</Label>
                  <Input
                    type="text"
                    name="birthplace"
                    value={this.state.activeItem.birthplace}
                    onChange={this.handleChange}
                    placeholder=""
                  />
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