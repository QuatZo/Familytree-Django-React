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
            title: false,
            date: false,
            person_id: false,
            file: false,
          },
          personSelectOptions: [],
        };
      }

      file = null; // chosen files

      componentDidMount(){
        var options = [];
        axios
          .get("http://localhost:8000/api/familytreepersons/", {
            headers: { Authorization: `JWT ${localStorage.getItem('token')}`}
          })
          .then(res => {
            res.data.map(item => {
              options.push({
                label: item.first_name + " " + item.last_name,
                value: item.id,
              });
            });
            this.setState({personSelectOptions: options});
          })
          .catch(err => {
            console.log(err);
            ShowNotification(NOTIFY.ERROR);
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
        const activeItem = { ...this.state.activeItem, ["date"]: (new Date(date)).toISOString().slice(0, 10)};
        this.setState({activeItem});
      };

      // handles change for File Field
      handleChangeFile = (e) => {
        this.file = e.target.files[0];
      }

      // error handling
      handleBlur = (field) => (evt) => {
        this.setState({
          touched: { ...this.state.touched, [field]: true },
        });
      }
      
      // error handling, validates given fields
      validate(title, date, person_id, file){
        person_id = person_id.filter(el => el !== undefined);
        return{
          title: title.trim().length === 0,
          date: date.toString().trim().length === 0,
          person_id: person_id.length === 0,
          file: file === null && this.state.activeItem.id === undefined,
        }
      }

      render() {
        const { toggle, onSave } = this.props;
        const errors = this.validate(this.state.activeItem.title, this.state.activeItem.date, this.state.activeItem.person_id, this.file);
        const isEnabled = !Object.keys(errors).some(x => errors[x]); // button is disables as long as error exists
        return (
          <Modal className={"modal-open-"+this.props.theme} isOpen={true} toggle={toggle}>
            <ModalHeader className={"modal-header-"+this.props.theme} toggle={toggle}> Milestone </ModalHeader>
            <ModalBody className={"modal-body-"+this.props.theme}>
              <Form>
              <FormGroup>
                  <Label for="title">Title</Label>
                  <Input
                    id={this.props.theme}
                    type="text"
                    name="title"
                    className={errors.title ? "error" : ""}
                    onBlur={this.handleBlur('title')}
                    value={this.state.activeItem.title}
                    onChange={this.handleChange}
                    placeholder="Title"
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="text">Text</Label>
                  <Input
                    id={this.props.theme}
                    type="text"
                    name="text"
                    className="form-control"
                    value={this.state.activeItem.text}
                    onChange={this.handleChange}
                    placeholder="Text"
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="date">Date</Label><br />
                  <DatePicker 
                    id={this.props.theme}
                    name="date"
                    className={"form-control " + (errors.date ? "error" : "")}
                    value={this.state.activeItem.date}
                    onChange={ this.handleChangeDate} 
                    onBlur={this.handleBlur('date')}
                    peekNextMonth
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"/>
                </FormGroup>
                <FormGroup>
                  <Label for="person_id">Persons {errors.person_id ? " (please, choose at least one person from the list)" : null}</Label><br />
                  <MultiSelect
                    id={this.props.theme}
                    options={this.state.personSelectOptions}
                    className={"form-control " + (errors.person_id && this.state.activeItem.id === undefined ? "error" : "")}
                    selected={this.state.activeItem.person_id}
                    onSelectedChanged={selected => this.setState({ activeItem: {
                        id: this.state.activeItem.id,
                        user_id: this.state.activeItem.user_id,
                        person_id: selected.filter(el => el !== undefined),
                        date: this.state.activeItem.date,
                        title: this.state.activeItem.title,
                        text: this.state.activeItem.text,
                        image: this.state.activeItem.image,
                      }})}
                  />
                  </FormGroup>
                  <FormGroup>
                    <Label for="imageUrl">Image/Movie</Label>
                    <Input
                      id={this.props.theme}
                      type="file"
                      name="imageUrl"
                      className={errors.file ? "error" : ""}
                      onBlur={this.handleBlur('imageUrl')}
                      onChange={this.handleChangeFile}
                    />
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