// frontend/src/components/RelationshipModal.js
/*eslint no-useless-computed-key: 0*/

    import React, { Component } from "react";
    import DatePicker from "react-datepicker";
    import 'react-datepicker/dist/react-datepicker.css';
    import axios from "axios";
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
            begin_date: false,
            end_date: false,
          },
          personList: [],
        };
      }

      componentWillMount(){
        this.refreshPersonList();
      }

      // if it's new relationship, then generate color
      componentDidMount(){ 
        if(this.state.activeItem.color === ""){
          const activeItem = { ...this.state.activeItem, ["color"]: this.genColor()};
          this.setState({ activeItem });
        }
      }

      // used only to get person's names from their ID's
      refreshPersonList = () => {
        axios
          .get("http://localhost:8000/api/familytreepersons/", {
            headers: { Authorization: `JWT ${localStorage.getItem('token')}`}
          })
          .then(res => this.setState({ personList: res.data }))
          .catch(err => {
            console.log(err);
            ShowNotification(NOTIFY.ERROR);
          });
      };

      // handles Form changes for any field except date & select
      handleChange = (e) => {
        let { name, value } = e.target;
        const activeItem = { ...this.state.activeItem, [name]: value};
        this.setState({ activeItem });
      };

      // gets person's first & last name by using only its ID
      getPerson(idPerson){
        if(this.state.personList.length === 0){ return "" }
        var targetPerson = this.state.personList.find(item => item.id === idPerson); // find certain person in personList
        return targetPerson.first_name + " " + targetPerson.last_name;
      }

      // generates color for relationship
      genColor(){
        var randomColor = require('random-color');
        var color = randomColor(0.3, 0.99); // light color
        return color.hexString();
      }

      // error handling
      handleBlur = (field) => (evt) => {
        this.setState({
          touched: { ...this.state.touched, [field]: true },
        });
      }

      // handle Form changes for Begin Date field
      handleChangeBeginDate = date => {
        const activeItem = { ...this.state.activeItem, ["begin_date"]: (new Date(date)).toISOString().slice(0, 10)};
        this.setState({activeItem});
      };

      // handle Form changes for End Date field
      handleChangeEndDate = date => {
        const activeItem = { ...this.state.activeItem, ["end_date"]: (new Date(date)).toISOString().slice(0, 10)};
        this.setState({activeItem});
      };

      // error handling, validates fields
      validate(title, begin_date){
        return{
          title: title.trim().length === 0,
          begin_date: begin_date.toString().trim().length === 0,
        }
      }

      render() {
        const { toggle, onSave } = this.props;
        const errors = this.validate(this.state.activeItem.title, this.state.activeItem.begin_date);
        const isEnabled = !Object.keys(errors).some(x => errors[x]); // button is disabled as long as error exists
        return (
          <Modal isOpen={true} toggle={toggle}>
            <ModalHeader toggle={toggle}> Relationship</ModalHeader>
            <ModalBody>
              <Form>
                <FormGroup>
                  <Label for="title">Title</Label>
                  <Input
                    type="text"
                    name="title"
                    className={errors.title?"error":""}
                    onBlur={this.handleBlur('title')}
                    value={this.state.activeItem.title}
                    onChange={this.handleChange}
                    placeholder="Title"
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="description">Description</Label>
                  <Input
                    type="text"
                    name="description"
                    className="form-control"
                    value={this.state.activeItem.description}
                    onChange={this.handleChange}
                    placeholder="Description"
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="begin_date">Begin Date</Label><br />
                  <DatePicker 
                    name="begin_date"
                    className={"form-control " + (errors.begin_date ? "error" : "")}
                    value={this.state.activeItem.begin_date}
                    onChange={ this.handleChangeBeginDate} 
                    onBlur={this.handleBlur('begin_date')}
                    peekNextMonth
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"/>
                </FormGroup>
                <FormGroup>
                  <Label for="end_date">End date (optional)</Label><br />
                  <DatePicker 
                    name="end_date"
                    className="form-control"
                    value={this.state.activeItem.end_date}
                    onChange={ this.handleChangeEndDate} 
                    peekNextMonth
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"/>
                </FormGroup>
                <FormGroup>
                  <Label for="relationships">What's {this.getPerson(this.state.activeItem.id_1)} to the {this.getPerson(this.state.activeItem.id_2)}</Label>
                  <select
                    className="form-control"
                    name = "relationships"
                    onChange={this.handleChange}
                    value={this.state.activeItem.relationships}
                  >
                    <option value="father">Father</option>
                    <option value="mother">Mother</option>
                    <option value="brother">Brother</option>
                    <option value="sister">Sister</option>
                    <option value="son">Son</option>
                    <option value="daughter">Daughter</option>
                    <option value="adoptive son">Adoptive son</option>
                    <option value="adoptive daughter">Adoptive daughter</option>
                    <option value="surrogate father">Surrogate father</option>
                    <option value="surrogate mother">Surrogate mother</option>
                    <option value="stepbrother">Stepbrother</option>
                    <option value="stepsister">Stepsister</option>
                    <option value="stepson">Stepson</option>
                    <option value="stepdaughter">Stepdaughter</option>
                  </select>
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