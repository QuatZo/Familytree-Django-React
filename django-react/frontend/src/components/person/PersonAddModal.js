// frontend/src/components/PersonAddModal.js
/*eslint no-useless-computed-key: 0*/

    import React, { Component } from "react";
    import DatePicker from "react-datepicker";
    import 'react-datepicker/dist/react-datepicker.css';
    import '../Modal.css';
    
    import {
      Button,
      Modal,
      ModalHeader,
      ModalBody,
      ModalFooter,
      Form,
      FormGroup,
      Input,
      Label,
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

      file = null; // chosen file (avatar)

      // handles change of all fields, except date, file & select
      handleChange = (e) => {
        let { name, value } = e.target;
        const activeItem = { ...this.state.activeItem, [name]: value};
        this.setState({ activeItem });
      };

      // handles change of Date Field
      handleChangeDate = date => {
        const activeItem = { ...this.state.activeItem, ["birth_date"]: (new Date(date)).toISOString().slice(0, 10)};
        this.setState({activeItem});
      };

      // handles change of File Field (upload)
      handleChangeFile = (e) => {
        this.file = e.target.files[0];
      }

      // error handling, validates given form fields
      validate(first_name, last_name, file){
        return{
          first_name: first_name.trim().length === 0,
          first_name_too_long: first_name.trim().length > 50,
          last_name: last_name.trim().length === 0,
          last_name_too_long: last_name.trim().length > 50,
          file: file === null,
        }
      }

      // error handling
      handleBlur = (field) => (evt) => {
        this.setState({
          touched: { ...this.state.touched, [field]: true },
        });
      }
      
      render() {
        const { toggle, onSave } = this.props;
        const errors = this.validate(this.state.activeItem.first_name, this.state.activeItem.last_name, this.file);
        const isEnabled = !Object.keys(errors).some(x => errors[x]); // button is disabled as long as error exists
        return (
          <Modal className={"modal-open-"+this.props.theme} isOpen={true} toggle={toggle}>
            <ModalHeader className={"modal-header-"+this.props.theme} toggle={toggle}> Person </ModalHeader>
            <ModalBody className={"modal-body-"+this.props.theme}>
              <Form>
              <FormGroup >
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
                    className={this.props.theme + ((errors.first_name || errors.first_name_too_long) ? " error" : "")}
                    onBlur={this.handleBlur('first_name')}
                    value={this.state.activeItem.first_name}
                    onChange={this.handleChange}
                    placeholder="First Name"
                    
                  />
                  {errors.first_name?(<small className='errortext'>Please insert first name</small>):null}
                  {errors.first_name_too_long?(<small className='errortext'>This name is too long, max length is 50</small>):null}
                </FormGroup>
                <FormGroup>
                  <Label for="last_name">Last Name</Label>
                  <Input
                    type="text"
                    name="last_name"
                    className={this.props.theme + ((errors.last_name || errors.last_name_too_long) ? " error" : "")}
                    onBlur={this.handleBlur('last_name')}
                    value={this.state.activeItem.last_name}
                    onChange={this.handleChange}
                    placeholder="Last Name"
                  />
                  {errors.last_name?(<small className='errortext'>Please insert last name</small>):null}
                  {errors.last_name_too_long?(<small className='errortext'>This name is too long, max length is 50</small>):null}
                </FormGroup>
                <FormGroup>
                  <Label for="birth_date">Birth Date</Label><br />
                  <DatePicker 
                    className={"form-control " + this.props.theme}
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
                    className={"form-control " + this.props.theme}
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
                    className={"form-control " + this.props.theme}
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
                    className={"form-control " + this.props.theme}
                    value={this.state.activeItem.birth_place}
                    onChange={this.handleChange}
                    placeholder="Place of birth"
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="avatar">Avatar</Label>
                  <Input
                    type="file"
                    name="avatar"
                    className={this.props.theme + (errors.file ? " error" : "")}
                    onBlur={this.handleBlur('avatar')}
                    onChange={this.handleChangeFile}
                  />
                  {errors.file?(<small className='errortext'>Please input your avatar</small>):null}
                </FormGroup>
              </Form>
            </ModalBody>
            <ModalFooter className={"modal-footer-"+this.props.theme}>
              <Button disabled={!isEnabled} color="success" onClick={() => onSave(this.state.activeItem, this.file)}>
                Save
              </Button>
            </ModalFooter>
          </Modal>
        );
      }
    }