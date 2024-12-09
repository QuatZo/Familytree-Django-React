// frontend/src/components/RelationshipModal.js
/*eslint no-useless-computed-key: 0*/

    import React, { Component } from "react";
    import DatePicker from "react-datepicker";
    import 'react-datepicker/dist/react-datepicker.css';
    import axios from "axios";
    import {NOTIFY} from '../Enums.ts';
    import ShowNotification from '../notification/Notification';
    import '../Modal.css';
    import moment from 'moment';

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
          .get("/api/familytreepersons/", {
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
        this.setState({ activeItem }, () => name === 'relationships' ? this.handleChangeDescendant(value) : null);
      };

      handleChangeDescendant = (value) => {
        var twoLvl = ['niece/nephew', 'child', 'adopted child']
        var activeItem = { ...this.state.activeItem, ["descendant"]: false};
        if(twoLvl.indexOf(value) !== -1){
          activeItem = { ...this.state.activeItem, ["descendant"]: true};
        }
        this.setState({ activeItem });
      };

      // gets person's first & last name by using only its ID
      getPerson(idPerson){
        if(this.state.personList.length === 0 ||this.state.personList.length === undefined ){ return "" }
        var targetPerson = Array.from(this.state.personList).find(item => item.id === idPerson); // find certain person in personList
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
        var dt;
        try{
          dt = moment(date).format('YYYY-MM-DD');
        }
        catch(RangeError){
          dt = null;
        }
        const activeItem = { ...this.state.activeItem, ["begin_date"]: dt};
        this.setState({activeItem});
      };

      // handle Form changes for End Date field
      handleChangeEndDate = date => {
        var dt;
        try{
          dt = moment(date).format('YYYY-MM-DD');
        }
        catch(RangeError){
          dt = null;
        }
        const activeItem = { ...this.state.activeItem, ["end_date"]: dt};
        this.setState({activeItem});
      };

      // error handling, validates fields
      validate(form){
        return{
          title_too_long: form.title.trim().length > 64,
          description: form.description.trim().length > 512,
          end_date_earlier_than_begin: form.end_date !== null && form.end_date !== undefined && form.end_date !== "" && form.end_date.toString().trim() < form.begin_date.toString().trim(),
        }
      }

      render() {
        const { toggle, onSave } = this.props;
        const errors = this.validate(this.state.activeItem);
        const isEnabled = !Object.keys(errors).some(x => errors[x]); // button is disabled as long as error exists
        return (
          <Modal className={"modal-open-"+this.props.theme} isOpen={true} toggle={toggle}>
            <ModalHeader className={"modal-header-"+this.props.theme} toggle={toggle}> Relationship</ModalHeader>
            <ModalBody className={"modal-body-"+this.props.theme}>
              <Form>
                <FormGroup>
                  <Label for="title">Title</Label>
                  <Input
                    type="text"
                    name="title"
                    className={this.props.theme + ((errors.title_too_long) ? " error" : "")}
                    onBlur={this.handleBlur('title')}
                    value={this.state.activeItem.title}
                    onChange={this.handleChange}
                    placeholder="Title"
                  />
                  {errors.title_too_long ? (<small className={'errortext ' + this.props.theme}>This title is too long, max length is 64</small>) : null}
                </FormGroup>
                <FormGroup>
                  <Label for="description">Description</Label>
                  <Input
                    type="text"
                    name="description"
                    className={this.props.theme + (errors.description ? " error" : "")}
                    value={this.state.activeItem.description}
                    onChange={this.handleChange}
                    placeholder="Description"
                  />
                  {errors.description ? (<small className={'errortext ' + this.props.theme}>This description is too long, max length is 512</small>) : null}
                </FormGroup>
                <FormGroup>
                  <Label for="begin_date">Begin Date</Label><br />
                  <DatePicker 
                    name="begin_date"
                    className={"form-control " + this.props.theme}
                    value={this.state.activeItem.begin_date}
                    onChange={ this.handleChangeBeginDate} 
                    onBlur={this.handleBlur('begin_date')}
                    peekNextMonth
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"/>
                </FormGroup>
                <FormGroup>
                  <Label for="end_date">End date</Label><br />
                  <DatePicker 
                    name="end_date"
                    className={"form-control " + this.props.theme + (errors.end_date_earlier_than_begin ? " error" : "")}
                    value={this.state.activeItem.end_date}
                    onChange={ this.handleChangeEndDate} 
                    peekNextMonth
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"/>
                  {errors.end_date_earlier_than_begin ? (<small className={'errortext ' + this.props.theme}>End date can't be earlier than begin date. We don't support time travel</small>) : null}
                </FormGroup>
                <FormGroup>
                  <Label for="relationships">What's {this.getPerson(this.state.activeItem.id_2)} to the {this.getPerson(this.state.activeItem.id_1)}</Label>
                  <CustomInput 
                    id="relationships"
                    type="select"
                    className={"form-control " + this.props.theme}
                    name = "relationships"
                    onChange={this.handleChange}
                    value={this.state.activeItem.relationships}
                  >
                    <option value="married">Married</option>
                    <option value="divorced">Divorced</option>
                    <option value="fiance">Fiance</option>
                    <option value="sibling">Sibling</option>
                    <option value="stepsibling">Step Sibling</option>
                    <option value="sibling-in-law">Sibling-in-law</option>
                    <option value="cousin">Cousin</option>
                    <option value="niece/nephew">Niece/Nephew</option>
                    <option value="child">Child</option>
                    <option value="adopted child">Adopted Child</option>
                  </CustomInput>
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