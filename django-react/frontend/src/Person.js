// frontend/src/Person.js

    import React, { Component } from "react";
    import ModalPerson from "./components/PersonModal";
    import axios from "axios";
    import Draggable from 'react-draggable';
    import ModalRelationship from "./components/RelationshipModal";
    
    import './Person.css';
    import 'react-datepicker/dist/react-datepicker.css';
    import { SteppedLineTo } from 'react-lineto';
    
    const StatusChoices = [
      {value: 'living', label: 'Living'},
      {value: 'deceased', label: 'Deceased'},
      {value: 'unknown', label: 'Unknown'}
    ]

    const SexChoices = [
      {value: 'male', label: 'Male'},
      {value: 'female', label: 'Female'},
      {value: 'other', label: 'Other'}
    ]

    const RelationshipsChoices = [
      {value: 'father', label: 'Father'},
      {value: 'mother', label: 'Mother'},
      {value: 'brother/sister', label: 'Brother/Sister'}
    ]

    class Person extends Component {    
      constructor(props) {
        super(props);
        this.state = {
          viewCompleted: false,
          activeItem: {
            first_name: "",
            last_name: "",
            birth_date: "",
            status_choices:  StatusChoices.values[0],
            sex_choices:  SexChoices.values[0],
            birth_place: "",
            relationship_choices: RelationshipsChoices.values[0]
          },
          personList: [],
          activePersons: []
        };
      }          
      componentDidMount() {
        this.refreshList();
      }
      refreshList = () => {
        axios
          .get("http://localhost:8000/api/familytreepersons/")
          .then(res => this.setState({ personList: res.data }))
          .catch(err => console.log(err));
      };
      /* 
      getRelationship(){
        axios
          .get("http://localhost:8000/api/familytreerelationship/")
          .then(function (response) {
            console.log(response.data);
            return response.data;
          })
      } 
      */
      setActive(id) {
        var array = [...this.state.activePersons];
          if(array.includes(id)){
            var index = array.indexOf(id);
            array.splice(index, 1);
          }
          else{
            array.push(id);
          }
          if(array.length > 2)
              array.splice(0, 1);
          if(array.length === 2){
            /* 
            console.log(this.getRelationship())
            this.getRelationship().map(item => {
              if(!array.includes(item.id_1) || !array.includes(item.id_2) ) 
              */
                this.toggleRelationship();
            //})
          }
          this.setState({activePersons: array});
      }
      renderItems = () => {
        const newItems = this.state.personList;
        // swobodne poruszanie -> usuń grida z handlerów 
        const dragHandlers = {onStart: this.onStart, onStop: this.onStop, grid: [20, 20]};
        return newItems.map(item => (
          <Draggable cancel="img, button" {...dragHandlers}>
          <div
            className={"person id_" + item.id + " " + (this.state.activePersons.includes(item.id)?"active":"inactive") +  " border rounded"}
            onClick={() => this.setActive(item.id)}
          >
            <img src="https://live.staticflickr.com/7038/6944665187_b8cd703bc2.jpg" 
            className = "img-thumbnail"
            alt = "Error not found"/>
            <div
              className={`name`}
              last_name={item.first_name}
            >
              {item.first_name + ' ' + item.last_name }
            </div> 
            <div
              className={'buttons'}
            >
              <button
                onClick={() => this.editItem(item)}
                className="btn btn-secondary mr-2"
              >
                Edit{" "}
              </button>
              <button
                onClick={() => this.handleDelete(item)}
                className="btn btn-danger"
              >
                Delete{" "}
              </button>
            </div>
          </div>
          </Draggable>
        ));
      };
      toggle = () => {
        this.setState({ modal: !this.state.modal });
      };
      toggleRelationship = () => {
        this.setState({ ModalRelationship: !this.state.ModalRelationship });
      };
      handleSubmit = item => {
        console.log(item);
        this.toggle();
        if (item.id) {
          axios
            .put(`http://localhost:8000/api/familytreepersons/${item.id}/`, item)
            .then(res => this.refreshList());
          return;
        }
        axios
          .post("http://localhost:8000/api/familytreepersons/", item)
          .then(res => this.refreshList());
      };
      handleSubmitRelationship = item => {
        console.log(item.id_1);
        this.toggleRelationship();
        if (item.id) {
          axios
            .put(`http://localhost:8000/api/familytreerelationship/${item.id}/`, item)
            .then(res => this.refreshList());
          return;
        }
        axios
          .post("http://localhost:8000/api/familytreerelationship/", item)
          .then(res => this.refreshList());
      };
      handleDelete = item => {
        axios
          .delete(`http://localhost:8000/api/familytreepersons/${item.id}`)
          .then(res => this.refreshList());
      };
      createItem = () => {
        const item = { first_name: "", last_name: "", birth_date: "", status_choices: StatusChoices.values[0], sex_choices: SexChoices.values[0], birth_place: ""};
        this.setState({ activeItem: item, modal: !this.state.modal });
      };
      editItem = item => {
        this.setState({ activeItem: item, modal: !this.state.modal });
      }; 

      render() {
        return (
          <React.Fragment>
            <button onClick={this.createItem} className="btn btn-primary">
              Create Person
            </button>
            <div className="contentPerson">
              {this.renderItems()}
              {/* 
              <SteppedLineTo from="person id_22 active border rounded react-draggable react-draggable-dragged" to="person id_25 active border rounded react-draggable react-draggable-dragged" orientation="v" zIndex={-1}/>
              <SteppedLineTo from="person id_22 active border rounded react-draggable react-draggable-dragged" to="person id_25 inactive border rounded react-draggable react-draggable-dragged" orientation="v" zIndex={-1} />
              <SteppedLineTo from="person id_22 active border rounded react-draggable react-draggable-dragged" to="person id_25 active border rounded react-draggable" orientation="v" zIndex={-1} />
              <SteppedLineTo from="person id_22 active border rounded react-draggable react-draggable-dragged" to="person id_25 inactive border rounded react-draggable" orientation="v" zIndex={-1} />
              
              <SteppedLineTo from="person id_22 inactive border rounded react-draggable react-draggable-dragged" to="person id_25 active border rounded react-draggable react-draggable-dragged" orientation="v" zIndex={-1} />
              <SteppedLineTo from="person id_22 inactive border rounded react-draggable react-draggable-dragged" to="person id_25 inactive border rounded react-draggable react-draggable-dragged" orientation="v" zIndex={-1} />
              <SteppedLineTo from="person id_22 inactive border rounded react-draggable react-draggable-dragged" to="person id_25 active border rounded react-draggable" orientation="v" zIndex={-1} />
              <SteppedLineTo from="person id_22 inactive border rounded react-draggable react-draggable-dragged" to="person id_25 inactive border rounded react-draggable" orientation="v" zIndex={-1} />
              
              <SteppedLineTo from="person id_22 active border rounded react-draggable react-draggable-dragged" to="person id_25 active border rounded react-draggable react-draggable-dragged" orientation="v" zIndex={-1} />
              <SteppedLineTo from="person id_22 active border rounded react-draggable react-draggable-dragged" to="person id_25 inactive border rounded react-draggable react-draggable-dragged" orientation="v" zIndex={-1} />
              <SteppedLineTo from="person id_22 active border rounded react-draggable react-draggable-dragged" to="person id_25 active border rounded react-draggable" orientation="v" zIndex={-1} />
              <SteppedLineTo from="person id_22 active border rounded react-draggable react-draggable-dragged" to="person id_25 inactive border rounded react-draggable" orientation="v" zIndex={-1} />
              
              <SteppedLineTo from="person id_22 inactive border rounded react-draggable" to="person id_25 active border rounded react-draggable react-draggable-dragged" orientation="v" zIndex={-1} />
              <SteppedLineTo from="person id_22 inactive border rounded react-draggable" to="person id_25 inactive border rounded react-draggable react-draggable-dragged" orientation="v" zIndex={-1} />
              <SteppedLineTo from="person id_22 inactive border rounded react-draggable" to="person id_25 active border rounded react-draggable" orientation="v" zIndex={-1} />
              <SteppedLineTo from="person id_22 inactive border rounded react-draggable" to="person id_25 inactive border rounded react-draggable" orientation="v" zIndex={-1} /> 
              */}
              
              {this.state.modal ? (
                <ModalPerson
                  activeItem={this.state.activeItem}
                  toggle={this.toggle}
                  onSave={this.handleSubmit}
                />
              ) : null}
              {this.state.ModalRelationship ? (
                <ModalRelationship
                  personList={this.state.personList}
                  activePersons={this.state.activePersons}
                  toggle={this.toggleRelationship}
                  onSave={this.handleSubmitRelationship}
                />
              ) : null}
            </div>
          </React.Fragment>
        );
      }
    }
    export default Person;