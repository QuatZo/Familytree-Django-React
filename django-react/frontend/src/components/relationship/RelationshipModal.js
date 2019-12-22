// frontend/src/components/RelationshipModal.js
/*eslint no-useless-computed-key: 0*/

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
          activeItem: this.props.activeRelationship,
          touched: {
            title: false,
            begin_date: false,
            end_date: false,
          },
          personList: this.props.personList,
        };
      }

      componentDidMount(){
        if(this.state.activeItem.color === ""){
          const activeItem = { ...this.state.activeItem, ["color"]: this.genColor()};
          this.setState({ activeItem });
        }
      }

      handleChange = (e) => {
        let { name, value } = e.target;
        const activeItem = { ...this.state.activeItem, [name]: value};
        this.setState({ activeItem });
      };

      getPerson(idPerson){
        var targetPerson = this.state.personList.find(item => item.id === idPerson);
        return targetPerson.first_name + " " + targetPerson.last_name;
      }

      genColor(){
        var randomColor = require('random-color');
        var color = randomColor(0.3, 0.99);
        return color.hexString();
      }

      handleBlur = (field) => (evt) => {
        this.setState({
          touched: { ...this.state.touched, [field]: true },
        });
      }

      handleChangeBeginDate = date => {
        const activeItem = { ...this.state.activeItem, ["begin_date"]: (new Date(date)).toISOString().slice(0, 10)};
        this.setState({activeItem});
      };

      handleChangeEndDate = date => {
        const activeItem = { ...this.state.activeItem, ["end_date"]: (new Date(date)).toISOString().slice(0, 10)};
        this.setState({activeItem});
      };

      validate(title, begin_date){
        return{
          title: title.trim().length === 0,
          begin_date: begin_date.toString().trim().length === 0,
        }
      }

      render() {
        const { toggle, onSave } = this.props;
        const errors = this.validate(this.state.activeItem.title, this.state.activeItem.begin_date);
        const isEnabled = !Object.keys(errors).some(x => errors[x]);
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
                  <Label for="relationship_choices">What's {this.getPerson(this.state.activeItem.id_1)} to the {this.getPerson(this.state.activeItem.id_2)}</Label>
                  <select
                    className="form-control"
                    name = "relationship_choices"
                    onChange={this.handleChange}
                    defaultValue="father"
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