// frontend/src/Familytree.js
/*eslint no-useless-computed-key: 0*/
/*eslint array-callback-return: 0*/

    import React, { Component } from "react";
    import axios from "axios";
    import Person from "./Person";
    import ModalRelationship from "./components/RelationshipModal";
    import ModalPerson from "./components/PersonModal";
    
    import './Familytree.css';
    import 'react-datepicker/dist/react-datepicker.css';

    class Familytree extends Component {    
      constructor(props) {
        super(props);
        this.state = {
          viewCompleted: false,
          activeItem: {
            first_name: '',
            last_name: '',
            birth_date: '',
            status_choices: 'living',
            sex_choices:  'male',
            birth_place: '',
            relationship_choices: 'father'
          },
          personList: [],
          activePersons: [],
          personClassCoordinates: [],
          //personClassCoordinatesOld: [],
          relationships: [],
          hasPersonCoords: false,
          personSize: [],
        };
      }  

      handleSubmit = item => {
        this.toggle();
        if (item.id) {
          axios
            .put(`http://localhost:8000/api/familytreepersons/${item.id}/`, item)
            .then(() => this.refreshList());
          return;
        }
        axios
          .post("http://localhost:8000/api/familytreepersons/", item)
          .then(() => this.refreshList());
      };

      componentDidMount() {
        this.refreshList();
        this.renderRelationships();
      }

      /* componentDidUpdate(){
        if(this.state.personClassCoordinates !== this.state.personClassCoordinatesOld){
          this.renderRelationships();
          this.setState({
            personClassCoordinatesOld: this.state.personClassCoordinates
          })
        }
      } */

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
            this.setState({activePersons: []});
            // else - delete/edit relationship OR if above toggle 
            });
          }
          this.setState({activePersons: array});
      }

      coordinates(e) {
        var coords = [...this.state.personClassCoordinates];

        e.nativeEvent.path.map(item =>{
          if(item.className !== undefined && item.className.includes("person")){
            for(var i = 0; i < coords.length; i++){
              // if it's the whole person div
              if (coords[i].id === item.id){
                // take the transform value from style (draggable component)
                var transform = item.style.transform.toString();

                var startX = transform.indexOf("(") + 1;
                var endX = transform.indexOf(",") - 2;
                var x = parseInt(transform.substring(startX, endX));

                var startY = transform.indexOf(",") + 2;
                var endY = transform.indexOf(")") - 2;
                var y = parseInt(transform.substring(startY, endY));
                var newX = item.offsetLeft + item.clientWidth/2 + x;
                var newY = item.offsetTop + item.clientHeight/2 + y;

                // set the middle of the div as: corner of the div, relatively to body + half of the div width + translation value from style (draggable component)
                if(coords[i].screen.x !== newX || coords[i].screen.y !== newY){
                  coords[i].screen = {x: newX, y: newY};
                }
              }
            }
          }
        });
        this.setState({personClassCoordinates: coords});
      }

      renderItems = () => {
        const newItems = this.state.personList;
        return newItems.map(item => (
          <Person 
            key={item.id}
            person={item}
            activePersons={this.state.activePersons}
            refresh={this.refreshList.bind(this)}
            setActivePerson={this.setActive.bind(this)}
          />
        ));
      };

      toggle = () => {
        this.setState({ modal: !this.state.modal });
      };

      toggleRelationship = () => {
        this.setState({ ModalRelationship: !this.state.ModalRelationship });
      };

      handleSubmitRelationship = item => {
        this.toggleRelationship();
        if (item.id) {
          axios
            .put(`http://localhost:8000/api/familytreerelationship/${item.id}/`, item)
            .then(() => this.renderRelationships());
          return;
        }
        axios
          .post("http://localhost:8000/api/familytreerelationship/", item)
          .then(() => this.renderRelationships());
      };
      
      createItem = () => {
        const item = { first_name: "", last_name: "", birth_date: "", status_choices: 'living', sex_choices: 'male', birth_place: ""};
        this.setState({ activeItem: item, modal: !this.state.modal });
      };

      renderRelationships = () => {
          var final = [];
          var foot = [];
          var relationships = [];
          this.getRelationships().then(data => {
            data.map(relationship => {
              this.state.personClassCoordinates.map(person => {
                if(parseInt(relationship.id_1) === parseInt(person.id) || parseInt(relationship.id_2) === parseInt(person.id)){
                  foot.push(person);
                  relationships.push(relationship.relationships);
                }
              });
            });
          }).then(() => {
            for (var i = 0; i<foot.length; i+=2){
              final.push({
                relationship: relationships[i], 
                id1: foot[i].id, 
                id2: foot[i+1].id, 
                x1: foot[i].screen.x + this.state.personSize.width / 2, 
                y1: foot[i].screen.y + this.state.personSize.height / 2, 
                x2: foot[i+1].screen.x + this.state.personSize.width / 2, 
                y2: foot[i+1].screen.y + this.state.personSize.height / 2});
            }
            this.setState({
              relationships: (final.map(item => (
                <React.Fragment
                key={"fragment_" + item.id1 + "_" + item.id2}
                >
                  <polyline 
                  id={"path_" + item.id1 + "_" + item.id2}
                  points={Math.round(item.x1) + " " + Math.round(item.y1) +
                  ", " + Math.round(item.x1) + " " + Math.round((Math.round(item.y1) + Math.round(item.y2))/2) +
                  ", " + Math.round(item.x2) + " " + Math.round((Math.round(item.y1) + Math.round(item.y2))/2) +
                  ", " + Math.round(item.x2) + " " + Math.round(item.y2)} 
                  stroke="red" 
                  strokeWidth="3" 
                  fill="none"/>

                  <text 
                  x={(Math.round(item.x1) + Math.round(item.x2))/2} 
                  y={Math.round((Math.round(item.y1) + Math.round(item.y2))/2) - 5} 
                  className="error"
                  // there should be color the same as line color
                  fill="white">
                    {item.relationship}
                  </text>
                </React.Fragment>
                )
              )
            )});
          });
      }

      getCoordinates() {
        var personList = [...this.state.personList]
        var personCoords = [...this.state.personClassCoordinates]
        var persons = Array.from(document.querySelectorAll("div.person"));
        personList.map(person => {
          for(var i = 0; i < persons.length; i++){
            if(parseInt(person.id) !== parseInt(persons[i].id)){
              continue;
            }            
            var personHtml = document.getElementById(persons[i].classList[1].split("_").pop());
            
            personHtml.style.transform = "translate(" + (person.x - personHtml.offsetLeft + 5) + "px, " + (person.y - personHtml.offsetTop + 5) + "px)"
            var personCoordinates = personHtml.getBoundingClientRect();
            if(typeof personCoords !== undefined){
              if(personCoords.length === 0){
                personCoords.push({id: person.id, screen: {x: person.x + personCoordinates.width / 2, y: person.y + personCoordinates.height / 2}});
                break;
              }
              var alreadyHasThisPerson = false
              for(var j = 0; j < personCoords.length; j++){
                if(personCoords[j].id === person.id){
                  personCoords[j].screen = {x: person.x + personCoordinates.width / 2, y: person.y + personCoordinates.height / 2}
                  alreadyHasThisPerson = true;
                }
              }
              if(!alreadyHasThisPerson){
                personCoords.push({id: person.id, screen: {x: person.x, y: person.y}});
              }
            }
            this.setState({
              hasPersonCoords: true,
              personClassCoordinates: personCoords,
              personSize: {width: personCoordinates.width, height: personCoordinates.height}
            }, () => this.renderRelationships())
          }
        })
      }

      render() {
        return (
          <React.Fragment>
            <div className="contentPerson">
              <svg height="1080" width="1920">
                {this.state.relationships.length > 0 ? this.state.relationships : null}
              </svg>
              {this.renderItems()}
              {this.state.hasPersonCoords ? null: this.getCoordinates()}
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
            <button onClick={this.createItem} className="btn btn-danger btn-circle btn-xl">
              <i className="fas fa-plus"></i>
            </button>
          </React.Fragment>
        );
      }
    }
    export default Familytree;