// frontend/src/Person.js
/*eslint no-useless-computed-key: 0*/
/*eslint array-callback-return: 0*/

    import React, { Component } from "react";
    import ModalPerson from "./components/PersonModal";
    import axios from "axios";
    import Draggable from 'react-draggable';
    import ModalRelationship from "./components/RelationshipModal";
    
    import './Person.css';
    import 'react-datepicker/dist/react-datepicker.css';
    import {PathLine} from 'react-svg-pathline'
    
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
          activePersons: [],
          draggedPoint: {screen: {x: 0, y: 0}, div: {x: 0, y: 0}, actual: {x: 0, y: 0}},
          personClassCoordinates: [],
          relationships: [],
        };
      }          
      componentDidMount() {
        this.refreshList();
        setTimeout(() => requestAnimationFrame(() => this.renderRelationships()), );
      }
      refreshList = () => {
        axios
          .get("http://localhost:8000/api/familytreepersons/")
          .then(res => this.setState({ personList: res.data }))
          .catch(err => console.log(err));
      };
      
      async getRelationships(){
        const res = await axios
          .get("http://localhost:8000/api/familytreerelationship/");
        return res.data;
      } 
      
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
            var exists = false;
            this.getRelationships().then(data => {
              data.map(item => {
              if(array.includes(parseInt(item.id_1)) && array.includes(parseInt(item.id_2)))
                exists = true;
            })
            if(!exists) this.toggleRelationship();
            // else - delete/edit relationship OR if above toggle 
            });
          }
          this.setState({activePersons: array});
      }

      coordinates(e) {
        var scr = {x: e.nativeEvent.x, y: e.nativeEvent.y}
        var act = {x: e.nativeEvent.layerX, y: e.nativeEvent.layerY}
        e.nativeEvent.path.map(item =>{
          if(item.className !== undefined && item.className.includes("person")){
            var dv = {x: item.clientWidth + item.clientTop, y: item.clientHeight + item.clientLeft}
            this.setState({draggedPoint: {screen: scr, div: dv, actual: act}})
          }
        })
      }

      renderItems = () => {
        const newItems = this.state.personList;
        // free movement -> delete grid from handlers
        const dragHandlers = {onStart: this.onStart, onStop: this.onStop, grid: [20, 20]};
        return newItems.map(item => (
          <Draggable cancel="img, button" {...dragHandlers} key={item.id}>
          <div
            id={item.id}
            onLoad={this.getPersonCoordinates.bind(this)}
            onMouseMove={this.coordinates.bind(this)}
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
      
      getPersonCoordinates(e){
        var array = [...this.state.personClassCoordinates];
        var idPerson = -1;
        e.nativeEvent.path.map(item =>{
          if(!isNaN(parseInt(item.id))){
            idPerson = item.id;
          }
        })
        var persons = Array.from(document.querySelectorAll("div.person"));
        for(var i = 0; i < persons.length; i++){
          var person = document.getElementById(persons[i].classList[1].split("_").pop());
          if(person.id === idPerson){
            var personCoordinates = person.getBoundingClientRect();
            array.push({id: idPerson, 
              screen: {x: personCoordinates.left + personCoordinates.width / 2, y: personCoordinates.top + personCoordinates.height / 2}
            })
          }
        }
        this.setState({personClassCoordinates: array});
      }

      functTemp(item){
        console.log([{ x: item.x1, y: item.y1 }, { x: (item.x1+item.x2)/2, y: item.y1 }, { x: (item.x2+item.x1)/2, y: (item.y2+item.y1)/2 }, { x: item.x2, y: item.y2 } ]);
      }

      renderRelationships = () => {
          var final = [];
          var foot = [];
          this.getRelationships().then(data => {
            data.map(relationship => {
              
              this.state.personClassCoordinates.map(person => {
                if(relationship.id_1 === person.id || relationship.id_2 === person.id){
                  foot.push(person);
                }
              });
            });
          }).then(data => {
            console.log(foot);
            for (var i = 0; i<foot.length; i+=2){
              final.push({x1: foot[i].screen.x, y1: foot[i].screen.y, x2: foot[i+1].screen.x, y2: foot[i+1].screen.y});
            }
            console.log(final);
            this.setState({
              relationships: (final.map(item => (
                <svg id={item.id_1 + "_" + item.id_2}> 
                  {this.functTemp(item)}
                  <path d={"M " + item.x1 + " " + item.y1 + " " + "l " + item.x2 + " "+ item.y2} stroke="red" strokeWidth="3" fill="none" />
                  </svg>)
              )
            )});
          });
  
          
      }

      render() {
        return (
          <React.Fragment>
            <button onClick={this.createItem} className="btn btn-primary">
              Create Person
            </button>
            <div className="contentPerson">
              {this.renderItems()}
              {this.state.relationships}
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