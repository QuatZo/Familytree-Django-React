// frontend/src/components/PersonAddModal.js
/*eslint no-useless-computed-key: 0*/
/*eslint array-callback-return: 0*/

    import React, { Component } from "react";
    import DatePicker from "react-datepicker";
    import 'react-datepicker/dist/react-datepicker.css';
    import '../Modal.css';
    import moment from 'moment'
    import Dropzone from 'react-dropzone'

    import {
      Button,
      CustomInput,
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
          fileMessage: "Drag 'n' drop file here, or click to select file",
        };
      }

      // handles change of all fields, except date, file & select
      handleChange = (e) => {
        let { name, value } = e.target;
        const activeItem = { ...this.state.activeItem, [name]: value};
        this.setState({ activeItem });
      };

      // handles change of Date Field
      handleChangeDate = date => {
        const activeItem = { ...this.state.activeItem, ["birth_date"]: moment(date).format('YYYY-MM-DD')};
        this.setState({activeItem});
      };
      handleChangeDateDeath = date => {
        const activeItem = { ...this.state.activeItem, ["death_date"]: moment(date).format('YYYY-MM-DD')};
        this.setState({activeItem});
      };

      // handles change of File Field (upload)
      handleChangeFile = (file) => {
        var fileMessage = "Drag 'n' drop file here, or click to select file";

        if(file !== null){
          fileMessage = file.name;
        }

        const activeItem = { ...this.state.activeItem, ["avatar"]: file};
        this.setState({activeItem, fileMessage});
      }

      // error handling, validates given form fields
      validate(form){
        var extensions = ['.bmp', '.cgm', '.gif', '.ico', '.jpeg', '.jpg', '.png', '.ras', '.rgb', '.svg', '.tiff']
        var file_extension_invalid = true
        if(form.avatar !== null && form.avatar !== undefined){
          extensions.map(ext => {
            var file_ext = form.avatar.name.substring(form.avatar.name.lastIndexOf('.'))
            if(ext === file_ext){
              file_extension_invalid = false;
            }
          })
        }
        return{
          first_name: form.first_name.trim().length === 0,
          first_name_too_long: form.first_name.trim().length > 50,
          last_name: form.last_name.trim().length === 0,
          last_name_too_long: form.last_name.trim().length > 50,
          file: form.avatar === null || form.avatar === undefined,
          file_extension: file_extension_invalid,
          birth_place: form.birth_place.trim().length > 50,
        }
      }
      
      render() {
        const { toggle, onSave } = this.props;
        const errors = this.validate(this.state.activeItem);
        const isEnabled = !Object.keys(errors).some(x => errors[x]); // button is disabled as long as error exists
        return (
          <Modal className={"modal-open-"+this.props.theme} isOpen={true} toggle={toggle}>
            <ModalHeader className={"modal-header-"+this.props.theme} toggle={toggle}> Person </ModalHeader>
            <ModalBody className={"modal-body-"+this.props.theme}>
              <Form>
              <FormGroup>
                  <Label for="first_name">First Name</Label>
                  <Input
                    type="text"
                    name="first_name"
                    className={this.props.theme + ((errors.first_name || errors.first_name_too_long) ? " error" : "")}
                    value={this.state.activeItem.first_name}
                    onChange={this.handleChange}
                    placeholder="First Name"
                    
                  />
                  {errors.first_name?(<small className={'errortext ' + this.props.theme}>Please insert first name</small>):null}
                  {errors.first_name_too_long?(<small className={'errortext ' + this.props.theme}>This name is too long, max length is 50</small>):null}
                </FormGroup>
                <FormGroup>
                  <Label for="last_name">Last Name</Label>
                  <Input
                    type="text"
                    name="last_name"
                    className={this.props.theme + ((errors.last_name || errors.last_name_too_long) ? " error" : "")}
                    value={this.state.activeItem.last_name}
                    onChange={this.handleChange}
                    placeholder="Last Name"
                  />
                  {errors.last_name?(<small className={'errortext ' + this.props.theme}>Please insert last name</small>):null}
                  {errors.last_name_too_long?(<small className={'errortext ' + this.props.theme}>This name is too long, max length is 50</small>):null}
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
                  <Label for="death_date">Death Date</Label><br />
                  <DatePicker 
                    className={"form-control " + this.props.theme}
                    name="death_date"
                    value={this.state.activeItem.death_date}
                    onChange={ this.handleChangeDateDeath} 
                    peekNextMonth
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"/>
                </FormGroup>
                <FormGroup>
                  <Label for="status_choices">Status of life</Label>
                  <CustomInput 
                    id="status_choices"
                    type="select"
                    className={"form-control " + this.props.theme}
                    name = "status_choices"
                    value={this.state.activeItem.status_choices}
                    onChange={this.handleChange}
                  >
                    <option value="living">Living</option>
                    <option value="deceased">Deceased</option>
                    <option value="unknown">Unknown</option>
                  </CustomInput>
                </FormGroup>
                <FormGroup>
                  <Label for="sex_choices">Sex</Label>
                  <CustomInput 
                    id="sex_choices"
                    type="select"
                    className={"form-control " + this.props.theme}
                    name = "sex_choices"
                    value={this.state.activeItem.sex_choices}
                    onChange={this.handleChange}
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </CustomInput>
                </FormGroup>
                <FormGroup>
                  <Label for="birth_place">Birthplace</Label>
                  <Input
                    type="text"
                    name="birth_place"
                    className={"form-control " + this.props.theme + (errors.birth_place ? " error" : "")}
                    value={this.state.activeItem.birth_place}
                    onChange={this.handleChange}
                    placeholder="Place of birth"
                  />
                  {errors.birth_place?(<small className={'errortext ' + this.props.theme}>This birth place is too long, max length is 50</small>):null}
                </FormGroup>
                <FormGroup>
                  <Label for="avatar">Avatar</Label>
                  <Dropzone 
                    onDrop={acceptedFiles => this.handleChangeFile(acceptedFiles[0])}
                    onFileDialogCancel={() => this.handleChangeFile(null)}
                    multiple={false}
                  >
                    {({getRootProps, getInputProps}) => (
                      <section>
                        <div {...getRootProps()} className={"dropzone " + this.props.theme + ((errors.file || errors.file_extension) ? " error" : "")}>
                          <input {...getInputProps()} />
                          <p>{this.state.fileMessage}</p>
                        </div>
                      </section>
                    )}
                  </Dropzone>
                  {errors.file?(<small className={'errortext ' + this.props.theme}>Please upload Image<br/></small>):null}
                  {errors.file_extension?(<small className={'errortext ' + this.props.theme}>This File has unsupported extension. Supported extensions: <b>BMP, CGM, GIF, ICO, JPEG, JPG, PNG, RAS, RGB, SVG, TIFF</b></small>):null}
                </FormGroup>
              </Form>
            </ModalBody>
            <ModalFooter className={"modal-footer-"+this.props.theme}>
              <Button disabled={!isEnabled} className="confirm" onClick={() => onSave(this.state.activeItem)}>
                Save
              </Button>
            </ModalFooter>
          </Modal>
        );
      }
    }