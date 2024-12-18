// frontend/src/components/MilestoneAddModal.js
/*eslint no-useless-computed-key: 0*/
/*eslint array-callback-return: 0*/

    import React, { Component } from "react";
    import axios from "axios";
    import DatePicker from "react-datepicker";
    import 'react-datepicker/dist/react-datepicker.css';
    import MultiSelect from "@khanacademy/react-multi-select";    
    import {NOTIFY} from '../Enums.ts';
    import ShowNotification from '../notification/Notification';
    import '../Modal.css';
    import moment from 'moment';
    import Dropzone from 'react-dropzone'
    
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
          personSelectOptions: [],
          fileMessage: "Drag 'n' drop file here, or click to select file",
        };
      }

      componentDidMount(){
        var options = [];
        axios
          .get("/api/familytreepersons/", {
            headers: { Authorization: `JWT ${localStorage.getItem('token')}`}
          })
          .then(res => {
            Array.from(res.data).map(item => {
              options.push({
                label: item.first_name + " " + item.last_name,
                value: item.id,
              });
            });
            this.setState({personSelectOptions: options});
          })
          .catch(err => {
            console.log(err);
            ShowNotification(NOTIFY.ERROR, this.props.theme);
          });
      }

      // handles change for form fields except Date, File & Select
      handleChange = (e) => {
        let { name, value } = e.target;
        const activeItem = { ...this.state.activeItem, [name]: value};
        this.setState({ activeItem });
      };

      // handles change for Date Field
      handleChangeDate = date => {
        var dt;
        try{
          dt = moment(date).format('YYYY-MM-DD')
        }
        catch(RangeError){
          dt = "";
        }
        const activeItem = { ...this.state.activeItem, ["date"]: dt};
        this.setState({activeItem});
      };

      // handles change for File Field
      handleChangeFile = (file) => {
        var fileMessage = "Drag 'n' drop file here, or click to select file";

      if(file !== null){
        fileMessage = file.name;
      }
        const activeItem = { ...this.state.activeItem, ["image"]: file};
        this.setState({activeItem, fileMessage});
      }

      handleChangeSelect = selected => {
        const activeItem = { ...this.state.activeItem, ["person_id"]: selected.filter(el => el !== undefined)};
        this.setState({activeItem});
      }
      
      // error handling, validates given fields
      validate(form){
        var file_extension_invalid = false;
        if(form.image !== null && form.image !== undefined && form.image.name !== undefined){
          var extensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg', '.raw', '.mp4', '.webm', '.wmv', '.avi', '.wav', '.mp3'];
          var file_ext_check = false;
          extensions.map(ext => {
            var file_ext = form.image.name.substring(form.image.name.lastIndexOf('.'))
            if(ext === file_ext){
              file_ext_check = true;
            }
          })

          if(!file_ext_check){ file_extension_invalid = true;}
        }

        try{
          form.person_id = form.person_id.filter(el => el !== undefined);
        }
        catch(TypeError){
          form.person_id = []
        }

        return{
          title: form.title.trim().length === 0,
          title_too_long: form.title.trim().length > 64,
          text: form.text.trim().length > 512,
          date: form.date.toString().trim().length === 0 || !(moment(form.date.toString(), "YYYY-MM-DD").isValid()),
          person_id: form.person_id.length === 0,
          file_extension: file_extension_invalid,
          file: (form.image === null || form.image === undefined) && form.id === undefined,
        }
      }

      render() {
        const { toggle, onSave } = this.props;
        const errors = this.validate(this.state.activeItem);
        const isEnabled = !Object.keys(errors).some(x => errors[x]); // button is disables as long as error exists
        return (
          <Modal className={"modal-open-"+this.props.theme} isOpen={true} toggle={toggle}>
            <ModalHeader className={"modal-header-"+this.props.theme} toggle={toggle}> Milestone </ModalHeader>
            <ModalBody className={"modal-body-"+this.props.theme}>
              <Form>
              <FormGroup>
                  <Label for="title">Title</Label>
                  <Input
                    type="text"
                    name="title"
                    className={this.props.theme + ((errors.title || errors.title_too_long) ? " error" : "")}
                    value={this.state.activeItem.title}
                    onChange={this.handleChange}
                    placeholder="Title"
                  />
                  {errors.title?(<small className={'errortext ' + this.props.theme}>Please insert title</small>):null}
                  {errors.title_too_long?(<small className={'errortext ' + this.props.theme}>This title is too long, max length is 64</small>):null}
                </FormGroup>
                <FormGroup>
                  <Label for="text">Text</Label>
                  <Input
                    type="text"
                    name="text"
                    className={"form-control " + this.props.theme + (errors.text ? " error" : "")}
                    value={this.state.activeItem.text}
                    onChange={this.handleChange}
                    placeholder="Text"
                  />
                  {errors.text?(<small className={'errortext ' + this.props.theme}>This text is too long, max length is 512</small>):null}
                </FormGroup>
                <FormGroup>
                  <Label for="date">Date</Label><br />
                  <DatePicker 
                    name="date"
                    className={"form-control " + this.props.theme + (errors.date ? " error" : "")}
                    value={this.state.activeItem.date}
                    onChange={ this.handleChangeDate} 
                    peekNextMonth
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"/>
                    {errors.date?(<small className={'errortext ' + this.props.theme}>Please choose date</small>):null}
                </FormGroup>
                <FormGroup>
                  <Label for="person_id">Persons {errors.person_id ? "" : null}</Label><br />
                  <MultiSelect
                    name="multiselect"
                    options={this.state.personSelectOptions}
                    className={"form-control " + this.props.theme + (errors.person_id && this.state.activeItem.id === undefined ? " error" : "")}
                    selected={this.state.activeItem.person_id}
                    onSelectedChanged={this.handleChangeSelect}
                  />
                  {errors.person_id?(<small className={'errortext ' + this.props.theme}> Please, choose at least one person from the list</small>):null}
                  </FormGroup>
                  <FormGroup>
                    <Label for="imageUrl">Image/Movie</Label>
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
                      {errors.file?(<small className={'errortext ' + this.props.theme}>Please upload Media File<br/></small>):null}
                      {errors.file_extension?(<small className={'errortext ' + this.props.theme}>This File has unsupported extension. Supported extensions: <b>JPG, PNG, GIF, BMP, SVG, RAW, MP4, WEBM, WMV, AVI, WAV, MP3</b></small>):null}
                  </FormGroup>
              </Form>
            </ModalBody>
            <ModalFooter className={"modal-footer-"+this.props.theme}>
              <Button disabled={!isEnabled} className="confirm" onClick={() => onSave(this.state.activeItem)}>
                Zapisz
              </Button>
            </ModalFooter>
          </Modal>
        );
      }
    }