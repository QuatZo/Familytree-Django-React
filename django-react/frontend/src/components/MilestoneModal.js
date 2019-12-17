// frontend/src/components/MilestoneAddModal.js
/*eslint no-useless-computed-key: 0*/

    import React, { Component } from "react";
    import axios from "axios";
    import DatePicker from "react-datepicker";
    import 'react-datepicker/dist/react-datepicker.css';
    import MultiSelect from "@khanacademy/react-multi-select";    
    import NOTIFY from '../Enums.ts';
    import ShowNotification from './Notification';
    
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
          },
          personSelectOptions: [],
        };
      }

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

      handleChange = (e) => {
        let { name, value } = e.target;
        const activeItem = { ...this.state.activeItem, [name]: value};
        this.setState({ activeItem });
      };

      handleChangeDate = date => {
        const activeItem = { ...this.state.activeItem, ["date"]: (new Date(date)).toISOString().slice(0, 10)};
        this.setState({activeItem});
      };

      validate(title, date, person_id){
        person_id = person_id.filter(el => el !== undefined);
        return{
          title: title.trim().length === 0,
          date: date.toString().trim().length === 0,
          person_id: person_id.length === 0
        }
      }

      handleBlur = (field) => (evt) => {
        this.setState({
          touched: { ...this.state.touched, [field]: true },
        });
      }
      
      render() {
        const { toggle, onSave } = this.props;
        const errors = this.validate(this.state.activeItem.title, this.state.activeItem.date, this.state.activeItem.person_id);
        const isEnabled = !Object.keys(errors).some(x => errors[x]);
        return (
          <Modal isOpen={true} toggle={toggle}>
            <ModalHeader toggle={toggle}> Milestone </ModalHeader>
            <ModalBody>
              <Form>
              <FormGroup>
                  <Label for="title">Title</Label>
                  <Input
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
                    options={this.state.personSelectOptions}
                    className={"form-control " + (errors.person_id ? "error" : "")}
                    selected={this.state.activeItem.person_id}
                    onSelectedChanged={selected => this.setState({ activeItem: {
                        user_id: this.state.activeItem.user_id,
                        person_id: selected,
                        date: this.state.activeItem.date,
                        title: this.state.activeItem.title,
                        text: this.state.activeItem.text,
                        image: this.state.activeItem.image,
                      }})}
                  />
                  </FormGroup>
                {/* Missing: 
                  - File upload
                */}
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