// frontend/src/Familytree.js
/*eslint no-useless-computed-key: 0*/
/*eslint array-callback-return: 0*/

    import React, { Component } from "react";
    import axios from "axios";
    import Person from "./components/person/Person";
    import Relationship from "./components/relationship/Relationship"
    import ModalRelationship from "./components/relationship/RelationshipModal";
    import ModalPerson from "./components/person/PersonAddModal";
    import {NOTIFY} from './components/Enums.ts';
    import ShowNotification from './components/notification/Notification';
    import './Familytree.css';

    class Familytree extends Component {    
      constructor(props) {
        super(props);
        this.state = {
          activePersonData: {
            user_id: localStorage.getItem('user_id'),
            first_name: '',
            last_name: '',
            birth_date: '',
            status_choices: 'living',
            sex_choices:  'male',
            birth_place: '',
            relationship_choices: 'father'
          },
          personList: this.props.personList,
          activePersons: [],
          personClassCoordinates: [],
          relationshipList: this.props.relationshipList,
          personSize: [],
          windowSize: {width: 0, height: 0},
          saving: false,
          activeRelationship: [],
        };
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
      }  

      componentDidMount(){
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
        this.getCoordinates();
      }

      componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
      }

      updateWindowDimensions() {
        var winSize = {width: window.innerWidth, height: window.innerHeight}
        this.setState({ windowSize: winSize }, () => this.getCoordinates());
      }

      refreshPersonList = () => {
        axios
          .get("http://localhost:8000/api/familytreepersons/", {
            headers: { Authorization: `JWT ${localStorage.getItem('token')}`}
          })
          .then(res => this.setState({ personList: res.data }))
          .then(() => this.getCoordinates())
          .catch(err => {
            console.log(err);
            ShowNotification(NOTIFY.ERROR);
          });
      };

      refreshRelationshipList = () => {
        axios
          .get("http://localhost:8000/api/familytreerelationship/", {
            headers: { Authorization: `JWT ${localStorage.getItem('token')}`}
          })
          .then(res => this.setState({ relationshipList: res.data }))
          .then(() => this.renderRelationships())
          .catch(err => {
            console.log(err);
            ShowNotification(NOTIFY.ERROR);
          });
      };

      togglePersonModal = () => {
        this.setState({ modal: !this.state.modal });
      };

      toggleRelationshipModal = () => {
        this.setState({ activeRelationship: {
          user_id: localStorage.getItem('user_id'),
          id_1: this.state.activePersons[0],
          id_2: this.state.activePersons[1],
          color: "",
          title: "",
          description: "",
          begin_date: "",
          end_date: null,
          descendant: false,
          relationships: 'father',
        },
        ModalRelationship: !this.state.ModalRelationship });
      };

      handleSubmitPerson = (item, file) => {
        this.togglePersonModal();
        var SHA256 = require("crypto-js/sha256");
        var newFilename = SHA256(Date.now().toString() + file.name) + file.name.substring(file.name.indexOf("."));

        let data = new FormData();
        data.append('user_id', item.user_id);
        data.append('first_name', item.first_name);
        data.append('last_name', item.last_name);
        data.append('birth_date', item.birth_date);
        data.append('status_choices', item.status_choices);
        data.append('sex_choices', item.sex_choices);
        data.append('birth_place', item.birth_place);
        data.append('relationship_choices', item.relationship_choices);
        data.append('avatar', file, newFilename); // sha256 encryption
    
        axios.post('http://localhost:8000/api/familytreepersons/', data, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `JWT ${localStorage.getItem('token')}`
          }
        })
        .then(() => this.refreshPersonList())
        .then(() => ShowNotification(NOTIFY.ADD_PERSON))
        .catch(err => {
          console.log(err);
          ShowNotification(NOTIFY.ERROR);
        });
      };

      handleSubmitRelationship = item => {
        this.toggleRelationshipModal();
        const options = {
          url: 'http://localhost:8000/api/familytreerelationship/',
          content: item,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept : 'application/json',
            Authorization: `JWT ${localStorage.getItem('token')}`
          },
          data: item
        };
        axios(options)
          .then(() => this.refreshRelationshipList())
          .then(() => ShowNotification(NOTIFY.ADD_RELATIONSHIP))
          .catch(err => {
            console.log(err);
            ShowNotification(NOTIFY.ERROR);
          });
      };
      
      createPerson = () => {
        const item = { user_id: localStorage.getItem('user_id'), first_name: "", last_name: "", birth_date: "", status_choices: 'living', sex_choices: 'male', birth_place: ""};
        this.setState({ activeItem: item, modal: !this.state.modal });
      };

      getCoordinates() {
        var personList = [...this.state.personList]
        var personListCoords = [...this.state.personClassCoordinates]
        var personListHTML = Array.from(document.querySelectorAll("div.person"));
        var personCoordinates = [];
        personList.map(person => {
          for(var i = 0; i < personListHTML.length; i++){
            if(parseInt(person.id) !== parseInt(personListHTML[i].id)){
              continue;
            }    

            var personHTML = document.getElementById(personListHTML[i].classList[1].split("_").pop());
            personCoordinates = personHTML.getBoundingClientRect();

            var personParentCoords = personHTML.parentElement.style.transform
            var firstPx = personParentCoords.indexOf("px")
            var personParentX = parseInt(personParentCoords.slice(10, firstPx))
            var personParentY = personParentCoords.slice(firstPx + 4, personParentCoords.length)
            personParentY = parseInt(personParentY.slice(0, personParentY.indexOf("px")))

            var x;
            var y;

            personHTML.style.transform = "translate(" + (person.x * this.state.windowSize.width - personHTML.offsetLeft + 5) + "px, " + (person.y * this.state.windowSize.height - personHTML.offsetTop + 5) + "px)"  
            
            x = person.x * this.state.windowSize.width + personParentX;
            y = person.y * this.state.windowSize.height + personParentY;

            if(typeof personListCoords !== "undefined"){
              if(personListCoords.length === 0){
                personListCoords.push({id: person.id, screen: {x: x, y: y}});
                break;
              }
              var alreadyHasThisPerson = false
              for(var j = 0; j < personListCoords.length; j++){
                if(personListCoords[j].id === person.id){
                  personListCoords[j].screen = {x: x, y: y}
                  alreadyHasThisPerson = true;
                }
              }
              if(!alreadyHasThisPerson){
                personListCoords.push({id: person.id, screen: {x: x, y: y}});
              }
            }
          }
        });
        this.setState({
          personClassCoordinates: personListCoords,
          personSize: {width: personCoordinates.width, height: personCoordinates.height},
          init: true
        }, () => this.renderRelationships())
      }

      resetCoords(){
        var personList = [...this.state.personList]
        var personListHTML = Array.from(document.querySelectorAll("div.person"));

        for(let i = 0; i < personListHTML.length; i++){
          var personHTML = document.getElementById(personListHTML[i].classList[1].split("_").pop());

          var personParentCoords = personHTML.parentElement.style.transform
          var firstPx = personParentCoords.indexOf("px")
          let personParentX = parseInt(personParentCoords.slice(10, firstPx))
          let personParentY = personParentCoords.slice(firstPx + 4, personParentCoords.length)
          personParentY = parseInt(personParentY.slice(0, personParentY.indexOf("px")))

          this.props.personList.map(person => {
            if(person.id === personList[i].id){
              var parentX = 0;
              var parentY = 0;
              if(typeof personList[i].parent !== "undefined"){
                parentX = personList[i].parent.x;
                parentY = personList[i].parent.y;
              }
              personList[i].x = (person.x * this.state.windowSize.width - personParentX + parentX) / this.state.windowSize.width;
              personList[i].y = (person.y * this.state.windowSize.height - personParentY + parentY) / this.state.windowSize.height;
              personList[i].parent = {x: personParentX, y: personParentY}
            }
          })
        }

        this.getCoordinates();
        ShowNotification(NOTIFY.RESET)
      }
      
      saveCoords(){
        ShowNotification(NOTIFY.SAVING)
        var saved = true;
        var personListCoords = [...this.state.personClassCoordinates]

        personListCoords.map(item => {
          var coords = {x: item.screen.x / this.state.windowSize.width, y: item.screen.y / this.state.windowSize.height};
          let formData = new FormData();
          formData.append('x', coords.x);
          formData.append('y', coords.y);
          axios
          .patch(`http://localhost:8000/api/familytreepersons/${item.id}/`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `JWT ${localStorage.getItem('token')}`
            }
          })
            .catch(err => {
              console.log(err);
              saved = false;
              ShowNotification(NOTIFY.ERROR);
            })
        })
        setTimeout(() => {
          this.setState({saving: false});
          if (saved) { ShowNotification(NOTIFY.SAVE_COORDS) };
        }, 5000);
      }

      setActivePerson(id) {
        // multiple relationships per pair === 'exists' variable is garbage
        var array = [...this.state.activePersons];
        var relationshipList = [...this.state.relationshipList]

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
            relationshipList.map(item => {
              if(array.includes(parseInt(item.id_1)) && array.includes(parseInt(item.id_2)))
                exists = true;
            })
            if(!exists) this.setState({activePersons: array}, () => this.toggleRelationshipModal());
            // else - delete/edit relationship OR if above toggle 
          }
          this.setState({activePersons: array});
      }

      deleteEverything(){
        // since relationships are connected w/ persons, we don't need to delete any relationship. Just persons.
        axios
          .get("http://localhost:8000/api/familytreepersons/", {
            headers: { Authorization: `JWT ${localStorage.getItem('token')}`}
          })
          .then(res => {
            res.data.map(item => {
              axios
              .delete(`http://localhost:8000/api/familytreepersons/${item.id}`, {
                headers: { Authorization: `JWT ${localStorage.getItem('token')}`}
              })
              .then(() => {
                this.refreshPersonList();
                this.refreshRelationshipList();
              })
            })
          })
          .then(() => {
            ShowNotification(NOTIFY.DELETE);
          })
          .catch(err => {
            console.log(err);
            ShowNotification(NOTIFY.ERROR);
          });
      }

      renderItems = () => {
        const newItems = this.state.personList;
        return newItems.map(item => (
          <Person 
            key={item.id}
            person={item}
            activePersons={this.state.activePersons}
            refresh={this.refreshPersonList.bind(this)}
            setActivePerson={this.setActivePerson.bind(this)}
            getCoordinates={this.getCoordinates.bind(this)}
            renderRelationships={this.renderRelationships.bind(this)}
            refreshRelationships={this.refreshRelationshipList.bind(this)}
          />
        ));
      };

      renderRelationships = () => {
        var relationshipList = [...this.state.relationshipList];
        var coordinates = [...this.state.personClassCoordinates];
        var personSize = this.state.personSize;

        this.setState({
          relationships: (relationshipList.map(item => (
            <Relationship
              key={"relationship_" + item.id + Date.now()} // it forces our app to re-render relationships whenever person is dragged
              relationship={item}
              personClassCoordinates={coordinates}
              personSize={personSize}
            />
            )
          )
        )});
      }

      render() {
        return (
          <React.Fragment>
            <div className="contentPerson">
              <svg height={this.state.windowSize.height} width={this.state.windowSize.width}>
                {this.state.relationships}
              </svg>
              {this.renderItems()}     
              {this.state.modal ? (
                <ModalPerson
                 activeItem={this.state.activePersonData}
                 toggle={this.togglePersonModal}
                 onSave={this.handleSubmitPerson}
                />
              ) : null}
              {this.state.ModalRelationship ? (
                <ModalRelationship
                  personList={this.state.personList}
                  toggle={this.toggleRelationshipModal}
                  onSave={this.handleSubmitRelationship}
                  activeRelationship={this.state.activeRelationship}
                />
              ) : null}
            </div>
            <div className="buttons">
              <button onClick={() => {if(window.confirm("Are you sure you want to delete WHOLE Family Tree?")) this.deleteEverything()}} className="btn btn-outline-danger btn-circle btn-xl">
                <i className="fas fa-times"></i>
              </button>
              <button onClick={this.resetCoords.bind(this)} className="btn btn-outline-warning btn-circle btn-xl">
                <i className="fas fa-redo"></i>
              </button>
              <button disabled={this.state.saving} onClick={() => {if(window.confirm("Are you sure you want to save the coordinates?")) this.saveCoords()}} className="btn btn-outline-info btn-circle btn-xl">
                <i className="far fa-save"></i>
              </button>
              <button onClick={this.createPerson} className="btn btn-outline-success btn-circle btn-xl">
                <i className="fas fa-plus"></i>
              </button>
            </div>
          </React.Fragment>
        );
      }
    }
    export default Familytree;