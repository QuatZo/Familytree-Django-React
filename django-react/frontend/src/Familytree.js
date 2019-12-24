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

      getCSSTransformValues(personHTML){
        // get parent coords (because of draggable)
        var personParentCoords = personHTML.parentElement.style.transform;
        var personParentX = parseFloat(personParentCoords.slice(10, personParentCoords.indexOf("px")))
        var personParentY = personParentCoords.slice(personParentCoords.indexOf("px") + 4, personParentCoords.length)
        personParentY = parseFloat(personParentY.slice(0, personParentY.indexOf("px")))

        // get transform coords (because of draggable)
        var personTransformCoords = personHTML.style.transform;
        var personTransformX = parseFloat(personTransformCoords.slice(10, personTransformCoords.indexOf("px")))
        var personTransformY = personTransformCoords.slice(personTransformCoords.indexOf("px") + 4, personTransformCoords.length)
        personTransformY = parseFloat(personTransformY.slice(0, personTransformY.indexOf("px")))

        return {parent: {x: personParentX, y: personParentY}, person: {x: personTransformX, y: personTransformY}};
      }

      getCoordinates(){
        var personList = [...this.state.personList]
        var personListCoords = [...this.state.personClassCoordinates]
        var personListHTML = Array.from(document.querySelectorAll("div.person"));
        var personCoords = [];

        personList.map(person => { // for every person in personList
          var personHTML = document.getElementById(personListHTML.find(el => parseInt(el.id) === person.id).classList[1].split("_").pop()); // get HTML Element
          personCoords = personHTML.getBoundingClientRect(); // get rectangle of the previously mentioned HTML ELement

          var transform = this.getCSSTransformValues(personHTML); // use function which gets the CSS values for transform of HTML element & its parent

          var index = personListCoords.findIndex(el => el.id === person.id); // find index of specific person in personListCoords (state personClassCoordinates) array
          // calculate new coordinates, if function resetCoords has been called at least once, then it uses the 'previous parent transform' values
          var x = person.x * this.state.windowSize.width + transform.parent.x - (!isNaN(transform.person.x) ? (person.x * this.state.windowSize.width - transform.person.x) : 0);
          var y = person.y * this.state.windowSize.height + transform.parent.y - (!isNaN(transform.person.y) ? (person.y * this.state.windowSize.height - transform.person.y) : 0);
          
          
          if(index !== -1){ // if this person already exists in an array which contains coordinates of persons
            personListCoords[index].screen = {x: x, y: y}; // then overwrite coords with the newest ones
          }
          else{ // if not...
            personListCoords.push({id: person.id, screen: {x: x, y: y}}); // add this person with its coordinates to the array
            personHTML.style.transform = "translate(" + (x - personHTML.offsetLeft + 5) + "px, " + (y - personHTML.offsetTop + 5) + "px)" // move HTML element to the coords
          }
        })
        this.setState({
          personClassCoordinates: personListCoords,
          personSize: {width: personCoords.width, height: personCoords.height}
        }, () => this.renderRelationships());
      }

      resetCoords(){
        var personList = [...this.state.personList]
        var personListCoords = [...this.state.personClassCoordinates]
        var personListHTML = Array.from(document.querySelectorAll("div.person"));

        personList.map(person => { // for every person in personList
          var personHTML = document.getElementById(personListHTML.find(el => parseInt(el.id) === person.id).classList[1].split("_").pop()); // get HTML Element

          var transform = this.getCSSTransformValues(personHTML); // use function which gets the CSS values for transform of HTML element & its parent

          var index = personListCoords.findIndex(el => el.id === person.id); // find index of specific person in personListCoords (state personClassCoordinates) array
          // set the values to the initial ones (ratio donwloaded from API * actual window size)
          var x = person.x * this.state.windowSize.width;
          var y = person.y * this.state.windowSize.height;

          var oldPersonParent = {x: x - transform.person.x, y: y - transform.person.y} // calculate old parent CSS transform
          var needToMove = {x: transform.parent.x - oldPersonParent.x, y: transform.parent.y - oldPersonParent.y} // calculate distance it needs to move, by using actual & old parent CSS transform values

          personHTML.style.transform = "translate(" + (transform.person.x - needToMove.x) + "px, " + (transform.person.y - needToMove.y) + "px)" // move HTML element to the previously calculated forms

          personListCoords[index].screen = {x: x, y: y}; // overwrite coords with the initial ones
        })
        this.setState({
          personClassCoordinates: personListCoords,
        }, () => {
          this.renderRelationships();
          ShowNotification(NOTIFY.RESET);
        });
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
            this.setState({activePersons: array}, () => {
              this.toggleRelationshipModal();
              this.setState({activePersons: []});
            });
          }
          this.setState({activePersons: array});
      }

      // since relationships are connected w/ persons, we don't need to delete any relationship. Just persons.
      deleteEverything(){
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
        var pairs = [];
        
        // date - if older, then lower. i.e. 2019-01-01 < 2019-12-31 means true, 2019-12-31 < 2019-01-01 means false
        relationshipList.map(item => {
          var exists = false
          if(pairs.length){
            for(var i = 0; i < pairs.length; i++){
              if((item.id_1 === pairs[i].id_1 || item.id_1 === pairs[i].id_2) && (item.id_2 === pairs[i].id_2 || item.id_2 === pairs[i].id_1)){
                if(
                  (pairs[i].end_date === null && item.end_date === null && pairs[i].begin_date < item.begin_date) 
                  || 
                  (pairs[i].end_date !== null && item.end_date === null)
                  ||
                  (pairs[i].end_date !== null && item.end_date != null && pairs[i].end_date < item.end_date)
                ){ pairs[i] = item }
                exists = true;
                break;
              }
            }
          }
          if(!exists){ pairs.push(item); }
        })

        this.setState({
          relationships: (pairs.map(item => (
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
                  activeItem={this.state.activeRelationship}
                  toggle={this.toggleRelationshipModal}
                  onSave={this.handleSubmitRelationship}
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