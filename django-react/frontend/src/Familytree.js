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
          personClassCoordinatesOld: [],
          relationships: [],
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

      componentDidUpdate(){
        if(this.state.personClassCoordinates !== this.state.personClassCoordinatesOld){
          this.renderRelationships();
          this.setState({
            personClassCoordinatesOld: this.state.personClassCoordinates
          })
        }
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
            person={item}
            activePersons={this.state.activePersons}
            getPersonCoordinates={this.getPersonCoordinates.bind(this)}
            renderRelationships={this.renderRelationships.bind(this)}
            coordinates={this.coordinates.bind(this)}
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
          }).then(() => {
            for (var i = 0; i<foot.length; i+=2){
              final.push({id1: foot[i].id, id2: foot[i+1].id, x1: foot[i].screen.x, y1: foot[i].screen.y, x2: foot[i+1].screen.x, y2: foot[i+1].screen.y});
            }
            this.setState({
              relationships: (final.map(item => (
                <React.Fragment>
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
                  className="error">
                    Here will be the relationship name
                  </text>
                </React.Fragment>
                )
              )
            )});
          });
      }

      render() {
        return (
          <React.Fragment>
            <div className="contentPerson">
              {this.renderItems()}
              <svg height="1080" width="1920">
                {this.state.relationships.length > 0 ? this.state.relationships : null}
              </svg>
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