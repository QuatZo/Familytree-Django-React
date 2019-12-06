// frontend/src/components/PersonModal.js

    import React, { Component } from "react";
    import DatePicker from "react-datepicker";
    import 'react-datepicker/dist/react-datepicker.css';
    
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
          activeItem: this.props.activeItem,
          touched: {
            first_name: false,
            last_name: false,
          },
        };
      }
      handleChange = (e) => {
        let { name, value } = e.target;
        const activeItem = { ...this.state.activeItem, [name]: value};
        this.setState({ activeItem });
      };
      handleChangeDate = date => {
        const activeItem = { ...this.state.activeItem, ["birth_date"]: (new Date(date)).toISOString().slice(0, 10)};
        this.setState({activeItem});
      };
      validate(first_name, last_name){
        return{
          first_name: first_name.trim().length === 0,
          last_name: last_name.trim().length === 0
        }
      }
      handleBlur = (field) => (evt) => {
        this.setState({
          touched: { ...this.state.touched, [field]: true },
        });
      }
      render() {
        const { toggle, onSave } = this.props;
        const errors = this.validate(this.state.activeItem.first_name, this.state.activeItem.last_name);
        const isEnabled = !Object.keys(errors).some(x => errors[x]);
        return (
          <Modal isOpen={true} toggle={toggle}>
            <ModalHeader toggle={toggle}> Person </ModalHeader>
            <ModalBody>
              <Form>
              <FormGroup>
                <Input
                type="number"
                name="user_id"
                value={localStorage.getItem('user_id')}
                hidden
                readOnly
                >
                </Input>
              </FormGroup>
              <FormGroup>
                  <Label for="first_name">First Name</Label>
                  <Input
                    type="text"
                    name="first_name"
                    className={errors.first_name?"error":""}
                    onBlur={this.handleBlur('first_name')}
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
                    className={errors.last_name?"error":""}
                    onBlur={this.handleBlur('last_name')}
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
                    onChange={ this.handleChangeDate} 
                    peekNextMonth
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"/>
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
                  <Label for="birth_place">Birthplace</Label>
                  <Input
                    type="text"
                    name="birth_place"
                    value={this.state.activeItem.birth_place}
                    onChange={this.handleChange}
                    placeholder="Place of birth"
                  />
                </FormGroup>
              </Form>
            </ModalBody>
            <ModalFooter>
              <Button disabled={!isEnabled} color="success" onClick={() => onSave(this.state.activeItem)}>
                Save
              </Button>
            </ModalFooter>
          </Modal>
        );
      }
    }