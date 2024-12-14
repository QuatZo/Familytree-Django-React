// frontend/src/Familytree.js
/*eslint no-useless-computed-key: 0*/
/*eslint array-callback-return: 0*/

import React, { Component, createRef } from "react";
import axios from "axios";
import Person from "./components/person/Person";
import Relationship from "./components/relationship/Relationship"
import ModalRelationship from "./components/relationship/RelationshipModal";
import ModalPerson from "./components/person/PersonAddModal";
import ModalFirstTime from './components/auth/FirstTimeModal';
import {NOTIFY} from './components/Enums.ts';
import ShowNotification from './components/notification/Notification';
import './Familytree.css';
import ModalConfirm from './components/ConfirmationModal'
import Draggable from "react-draggable";

class Familytree extends Component {    
  constructor(props) {
    super(props);
    this.state = {
      windowSize: {width: 0, height: 0}, // size of the window
      saving: false, // flag, if it's saving coordinates
      printable: false,

      personList: this.props.personList, // list of persons
      personCoordinates: [], // list of person's coordinates
      personSize: [], // size of person's container (to calculate middle)
      activePersonData: [], // data for creating new Person
      activePersonIDList: [], // list of active persons (double-clicked)
      personIsOffScreen: [], // list of persons, if off screen

      relationshipList: this.props.relationshipList, // list of relationships
      activeRelationshipData: [], // relationship

      activeConfirmData: [],
    };
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    this.parentRef = createRef();
    this.personRefs = {};
  }

  componentDidMount(){
    this.checkNewUserStatus();
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateChildrenVisibility = () => {
    var personListIsOffScreen = [...this.state.personIsOffScreen]
    Object.values(this.personRefs).forEach((personRef) => {
      if(personRef){
        const personIsOffScreen = personRef.updateVisibility();
        var index = personListIsOffScreen.findIndex(el => el.id === personIsOffScreen.id);
        if (index === -1){
          personListIsOffScreen.push(personIsOffScreen);
        }
        else {
          personListIsOffScreen[index].isOffScreen = personIsOffScreen.isOffScreen
        }
      }
    });
    this.setState({
      personIsOffScreen: personListIsOffScreen
    });
  };

  checkNewUserStatus(){
    var registerDate = new Date(localStorage.getItem('date_joined'));
    if(Date.now() - registerDate <= 86400000){ // 24hrs period since account registration
      this.toggleFirstTimeModal();
    }
  }

  updateWindowDimensions() {
    var winSize = {width: window.innerWidth, height: window.innerHeight}
    this.setState({ windowSize: winSize }, () => this.getCoordinates());
  }

  // refreshes persons list and then gets their coords
  refreshPersonList = () => {
    axios
      .get("/api/familytreepersons/", {
        headers: { Authorization: `JWT ${localStorage.getItem('token')}`}
      })
      .then(res => this.setState({ personList: res.data }))
      .then(() => this.getCoordinates())
      .catch(err => {
        console.log(err);
        ShowNotification(NOTIFY.ERROR, this.props.theme);
      });
  };

  // refreshes relationships list
  refreshRelationshipList = () => {
    axios
      .get("/api/familytreerelationship/", {
        headers: { Authorization: `JWT ${localStorage.getItem('token')}`}
      })
      .then(res => this.setState({ relationshipList: res.data }))
      .then(() => this.renderRelationships())
      .catch(err => {
        console.log(err);
        ShowNotification(NOTIFY.ERROR, this.props.theme);
      });
  };

  toggleFirstTimeModal = () => {
    this.setState({ ModalFirstTime: !this.state.ModalFirstTime });
  }

  toggleConfirmModal = (header="", content="", confirmText="", cancelText="", onConfirm=() => this.toggleConfirmModal) => {
    this.setState({
      activeConfirmData: {
        header: header,
        content: content,
        confirmText: confirmText,
        cancelText: cancelText,
        onConfirm: onConfirm,
      },
      ModalConfirm: !this.state.ModalConfirm,
    });
  }
  
  // toggles Person Add modal
  togglePersonModal = () => {
    this.setState({ modal: !this.state.modal });
  };

  // toggles Relationship Add modal
  toggleRelationshipModal = () => {
    this.setState({ activeRelationshipData: {
      user_id: localStorage.getItem('user_id'),
      id_1: this.state.activePersonIDList[0], // 1st active person
      id_2: this.state.activePersonIDList[1], // 2nd active person
      color: "",
      title: "",
      description: "",
      begin_date: null,
      end_date: null,
      descendant: false, // flag, if it's a 2-level relationship
      relationships: 'married', // default value for select
    },
    ModalRelationship: !this.state.ModalRelationship });
  };

  // handles new Person submission
  handleSubmitPerson = (item) => {
    this.togglePersonModal();
    var SHA256 = require("crypto-js/sha256"); // SHA256 encryption
    var newFilename = SHA256(Date.now().toString() + item.avatar.name) + item.avatar.name.substring(item.avatar.name.indexOf(".")); // encrypted avatar's filename

    let data = new FormData(); // creates a data based on form, w/ values mentioned below
    data.append('user_id', item.user_id);
    data.append('first_name', item.first_name);
    data.append('last_name', item.last_name);
    data.append('birth_date', item.birth_date);
    data.append('death_date', item.death_date);
    data.append('status_choices', item.status_choices);
    data.append('sex_choices', item.sex_choices);
    data.append('birth_place', item.birth_place);
    data.append('relationship_choices', item.relationship_choices);
    data.append('avatar', item.avatar, newFilename); // SHA256 encryption

    axios.post('/api/familytreepersons/', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `JWT ${localStorage.getItem('token')}`
      }
    })
    .then(() => this.refreshPersonList())
    .then(() => ShowNotification(NOTIFY.ADD_PERSON, this.props.theme))
    .catch(err => {
      console.log(err);
      ShowNotification(NOTIFY.ERROR, this.props.theme);
    });
  };

  // handles new Relationship submission
  handleSubmitRelationship = item => {
    this.toggleRelationshipModal();
    axios.post('/api/familytreerelationship/', item, {
      headers: {
        'Content-Type': 'application/json',
        Accept : 'application/json',
        Authorization: `JWT ${localStorage.getItem('token')}`
      }
    })
      .then(() => this.refreshRelationshipList())
      .then(() => ShowNotification(NOTIFY.ADD_RELATIONSHIP, this.props.theme))
      .catch(err => {
        console.log(err);
        ShowNotification(NOTIFY.ERROR, this.props.theme);
      });
  };
  
  // prepares activePersonData for new Person
  createPerson = () => {
    this.setState({ activePersonData: {
      user_id: localStorage.getItem('user_id'), 
      first_name: "", 
      last_name: "", 
      birth_date: "", 
      death_date: "", 
      status_choices: 'living', 
      sex_choices: 'male', 
      birth_place: "", 
      avatar: undefined,
    }, modal: !this.state.modal });
  };

  // gets the CSS Transform values for HTML element & its parent
  getCSSTransformValues(personHTML){
    // get parent coords (because of Draggable)
    var personParentCoords = personHTML.parentElement.style.transform; // get CSS Transform as string
    var personParentX = parseFloat(personParentCoords.slice(10, personParentCoords.indexOf("px"))) // value between '(' and 'px'
    var personParentY = personParentCoords.slice(personParentCoords.indexOf("px") + 4, personParentCoords.length) // string between 'px, ' and EOF
    personParentY = parseFloat(personParentY.slice(0, personParentY.indexOf("px"))) // value between 'px, ' and 'px)'

    // same as above, but for HTML element (because of Draggable)
    var personTransformCoords = personHTML.style.transform;
    var personTransformX = parseFloat(personTransformCoords.slice(10, personTransformCoords.indexOf("px")))
    var personTransformY = personTransformCoords.slice(personTransformCoords.indexOf("px") + 4, personTransformCoords.length)
    personTransformY = parseFloat(personTransformY.slice(0, personTransformY.indexOf("px")))

    return {parent: {x: personParentX, y: personParentY}, person: {x: personTransformX, y: personTransformY}};
  }

  // gets coords for every Person element
  getCoordinates(){
    var personList = [...this.state.personList]
    var personListCoords = [...this.state.personCoordinates]
    var personListHTML = Array.from(document.querySelectorAll("div.person")); // all HTML element of DIV type, w/ 'person' in className
    var personCoords = [];

    personList.map(person => { // for every person in personList
      try{
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
      }
      catch(TypeError){
        return
      }
    })
    this.setState({
      personCoordinates: personListCoords,
      personSize: {width: personCoords.width, height: personCoords.height}
    }, () => this.renderRelationships());
  }

  // resets the Person's coords to the initial (the ones from API)
  resetCoords(){
    var personList = [...this.state.personList]
    var personListCoords = [...this.state.personCoordinates]
    var personListHTML = Array.from(document.querySelectorAll("div.person")); // all HTML element of DIV type, w/ 'person' in className

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
      ShowNotification(NOTIFY.RESET, this.props.theme);
    });
  }
  
  // saves new Person's coords to the API
  saveCoords(){
    this.toggleConfirmModal();
    ShowNotification(NOTIFY.SAVING, this.props.theme)
    var saved = true;
    var personListCoords = [...this.state.personCoordinates]
    var personList = [...this.state.personList]

    personListCoords.map(item => {
      var coords = {x: item.screen.x / this.state.windowSize.width, y: item.screen.y / this.state.windowSize.height}; // calculates new coords

      if(personList.findIndex(el => el.id === item.id) !== -1){
        let formData = new FormData();
        formData.append('x', coords.x);
        formData.append('y', coords.y);
        axios
        .patch(`/api/familytreepersons/${item.id}/`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `JWT ${localStorage.getItem('token')}`
          }
        })
          .catch(err => {
            console.log(err);
            saved = false;
            ShowNotification(NOTIFY.ERROR, this.props.theme);
          })
      }          
    })
    setTimeout(() => {
      this.setState({saving: false});
      if (saved) { ShowNotification(NOTIFY.SAVE_COORDS, this.props.theme) };
    }, 5000);
  }

  // sets the Person to be active, if double-clicked
  setActivePerson(id) {
    var array = [...this.state.activePersonIDList];

      if(array.includes(id)){ // if it is active, then make it inactive
        var index = array.indexOf(id);
        array.splice(index, 1);
      }
      else{ // if it's not active, then make it active
        array.push(id);
      }
      if(array.length > 2) // if we have more than 2 active elements, delete the first one (should be unnecessary)
          array.splice(0, 1);

      if(array.length === 2){ // if we already got 2 active elements, then toggle New Relationship modal
        this.setState({activePersonIDList: array}, () => {
          this.toggleRelationshipModal();
          this.setState({activePersonIDList: []});
        });
      }
      this.setState({activePersonIDList: array});
  }

  // delete whole familytree; since relationships are connected w/ persons, we don't need to delete any relationship. Just persons.
  deleteEverything(){
    this.toggleConfirmModal();
    axios
      .get("/api/familytreepersons/", {
        headers: { Authorization: `JWT ${localStorage.getItem('token')}`}
      })
      .then(res => {
        res.data.map(item => {
          axios
          .delete(`/api/familytreepersons/${item.id}`, {
            headers: { Authorization: `JWT ${localStorage.getItem('token')}`}
          })
          .then(() => {
            this.refreshPersonList();
            this.refreshRelationshipList();
          })
        })
      })
      .then(() => {
        ShowNotification(NOTIFY.DELETE, this.props.theme);
      })
      .catch(err => {
        console.log(err);
        ShowNotification(NOTIFY.ERROR, this.props.theme);
      });
  }

  // render persons by using Person component
  renderItems = () => {
    const newItems = this.state.personList;
    var coordinates = [...this.state.personCoordinates];
    return newItems.map(item => (
      <Person 
        key={item.id}
        person={item}
        activePersons={this.state.activePersonIDList}
        printable={this.state.printable}
        showButtons={this.props.showButtons}
        refresh={this.refreshPersonList.bind(this)}
        setActivePerson={this.setActivePerson.bind(this)}
        getCoordinates={this.getCoordinates.bind(this)}
        renderRelationships={this.renderRelationships.bind(this)}
        refreshRelationships={this.refreshRelationshipList.bind(this)}
        toggleConfirmModal={this.toggleConfirmModal.bind(this)}
        theme={this.props.theme}
        parentRef={this.parentRef}
        ref={(ref) => (this.personRefs[item.id] = ref)}
        personCoordinates={coordinates}
        personIsOffScreen={this.state.personIsOffScreen}
      />
    ));
  };

  renderArrows = () => {
    var offScreenCounter = {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    }
    this.state.personIsOffScreen.map((person) => {
      Object.entries(person.isOffScreen).filter(([_, isOff]) => isOff === true).map(([direction]) => 
      offScreenCounter[direction] = offScreenCounter[direction] + 1
     )
    });
  
    return Object.entries(offScreenCounter).filter(([_, isOff]) => isOff > 0).map(([direction]) => 
      <div key={direction} className={`arrow ${direction}`}>x{offScreenCounter[direction]}</div>
    )
  }

  // render Relationships by using Relationship component
  renderRelationships = () => {
    var relationshipList = [...this.state.relationshipList];
    var coordinates = [...this.state.personCoordinates];
    var personSize = this.state.personSize;
    var pairs = [];
    
    // date - if older, then lower. i.e. 2019-01-01 < 2019-12-31 means true, 2019-12-31 < 2019-01-01 means false
    relationshipList.map(item => {
      var exists = false
      if(pairs.length){
        for(var i = 0; i < pairs.length; i++){
          if((item.id_1 === pairs[i].id_1 || item.id_1 === pairs[i].id_2) && (item.id_2 === pairs[i].id_2 || item.id_2 === pairs[i].id_1)){
            // draw only the newest one of certain pair
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
          personCoordinates={coordinates}
          personSize={personSize}
        />
        )
      )
    )});
  }

  downloadPDF = () =>{
    this.setState({
      printable: true,
    }, () => {
      var css = '@page { size: 20in 9in; margin: 0;}',
      head = document.head || document.getElementsByTagName('head')[0],
      style = document.createElement('style');

      style.type = 'text/css';
      style.media = 'print';

      if (style.styleSheet){
        style.styleSheet.cssText = css;
      } else {
        style.appendChild(document.createTextNode(css));
      }

      head.appendChild(style);

      window.print();

      this.setState({
        printable: false,
      })
    })
  }

  // renders whole Familytree page, which is visible after log-in (content + buttons, no nav bar)
  render() {
    const dragHandlers = {onStart: this.onStart, onStop: this.onStop, grid: [1, 1]};
    return (
      <React.Fragment>
        <Draggable 
          cancel="button" {...dragHandlers} 
          key="container"
          defaultPosition={{x: 0, y: 0}}
          onDrag={this.updateChildrenVisibility}
        >
          <div
          ref={this.parentRef}
          className="contentPerson"
          >
            <svg className={'relationshipContainer-' + this.props.theme} height={this.state.windowSize.height} width={this.state.windowSize.width}>
              {this.state.relationships}
            </svg>
            {this.renderItems()}
            {this.state.ModalFirstTime ? (
              <ModalFirstTime
                toggle={this.toggleFirstTimeModal}
                onSave={this.toggleFirstTimeModal}
                theme={this.props.theme}
              />
            ) : null}
            {this.state.modal ? (
              <ModalPerson
              activeItem={this.state.activePersonData}
              toggle={this.togglePersonModal}
              onSave={this.handleSubmitPerson}
              theme={this.props.theme}
              />
            ) : null}
            {this.state.ModalRelationship ? (
              <ModalRelationship
                activeItem={this.state.activeRelationshipData}
                toggle={this.toggleRelationshipModal}
                onSave={this.handleSubmitRelationship}
                theme={this.props.theme}
              />
            ) : null}
            {this.state.ModalConfirm ? (
              <ModalConfirm 
                header={this.state.activeConfirmData.header}
                content={this.state.activeConfirmData.content}
                confirmText={this.state.activeConfirmData.confirmText}
                cancelText={this.state.activeConfirmData.cancelText}
                toggle={this.toggleConfirmModal}
                onConfirm={this.state.activeConfirmData.onConfirm}
                theme={this.props.theme}
              />
            ) : null}
          </div>
        </Draggable>
        <React.Fragment>
        {this.renderArrows()}
        </React.Fragment>
        {this.state.printable ? null :(
        <div className="buttons">
          {/* <div className="download-buttons">
            <button onClick={() => this.downloadPDF()} className={"btn " + (this.props.theme === 'dark' ? 'dark btn-outline-' : 'light btn-') + "primary btn-circle btn-xl famtree"}>
              <i className="fas fa-download"></i>
            </button>
          </div> */}
          <div className={"operating-buttons " + this.props.theme} id="operating-buttons">
            <button className="floating-btn" onClick={() => document.getElementById('operating-buttons').classList.toggle('active')}>
              <i className="fa fa-bars"></i>
            </button>

            <menu className="items-wrapper">
              <button className="menu-item fas fa-plus" onClick={this.createPerson}></button>
              <button href="#" className="menu-item far fa-save" onClick={() => this.toggleConfirmModal("Zapisz współrzędne", "Czy jesteś pewien?", "Zapisz", "Anuluj", () => this.saveCoords())}></button>
              <button href="#" className="menu-item fas fa-redo" onClick={this.resetCoords.bind(this)}></button>
              <button href="#" className="menu-item fas fa-times" onClick={() => this.toggleConfirmModal("Usuń drzewo genealogiczne", "Czy jesteś pewien?", "Usuń", "Anuluj", () => this.deleteEverything())}></button>
              </menu>
          </div>
        </div>
        )}
      </React.Fragment>
    );
  }
}
export default Familytree;