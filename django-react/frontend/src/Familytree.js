// frontend/src/Familytree.js
/*eslint no-useless-computed-key: 0*/
/*eslint array-callback-return: 0*/

    import React, { Component } from "react";
    import axios from "axios";
    import Person from "./Person";
    import ModalRelationship from "./components/RelationshipModal";
    import ModalPerson from "./components/PersonModal";

    
    import './Familytree.css';

    class Familytree extends Component {    
      constructor(props) {
        super(props);
        this.state = {
          viewCompleted: false,
          activePersonData: {
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
          init: false,
          colorArray: [0, 32, 64, 96, 128, 160, 192, 224, 256]
        };
      }  

      componentDidMount(){
        this.getCoordinates()
      }

      refreshPersonList = () => {
        axios
          .get("http://localhost:8000/api/familytreepersons/")
          .then(res => this.setState({ personList: res.data }))
          .then(() => this.getCoordinates())
          .catch(err => console.log(err));
      };

      refreshRelationshipList = () => {
        axios
          .get("http://localhost:8000/api/familytreerelationship/")
          .then(res => this.setState({ relationshipList: res.data }))
          .then(() => this.renderRelationships())
          .catch(err => console.log(err));
      };

      togglePersonModal = () => {
        this.setState({ modal: !this.state.modal });
      };

      toggleRelationshipModal = () => {
        this.setState({ ModalRelationship: !this.state.ModalRelationship });
      };

      handleSubmitPerson = item => {
        this.togglePersonModal();
        if (item.id) {
          axios
            .put(`http://localhost:8000/api/familytreepersons/${item.id}/`, item)
            .then(() => this.refreshPersonList());
          return;
        }
        axios
          .post("http://localhost:8000/api/familytreepersons/", item)
          .then(() => this.refreshPersonList());
      };

      handleSubmitRelationship = item => {
        this.toggleRelationshipModal();
        if (item.id) {
          axios
            .put(`http://localhost:8000/api/familytreerelationship/${item.id}/`, item)
            .then(() => this.refreshRelationshipList());
          return;
        }
        axios
          .post("http://localhost:8000/api/familytreerelationship/", item)
          .then(() => this.refreshRelationshipList());
      };
      
      createPerson = () => {
        const item = { first_name: "", last_name: "", birth_date: "", status_choices: 'living', sex_choices: 'male', birth_place: ""};
        this.setState({ activeItem: item, modal: !this.state.modal });
      };

      getCoordinates() {
        if(this.state.init){
          this.getCoordinatesInitTrue();
        }
        else{
          this.setState({
            init: true
          })
          this.getCoordinatesInitFalse();
        }
      }

      getCoordinatesInitTrue(){
        var personList = [...this.state.personList]
        var personListCoords = [...this.state.personClassCoordinates]
        var personListHTML = Array.from(document.querySelectorAll("div.person"));

        personList.map(person => {
          for(var i = 0; i < personListHTML.length; i++){
            if(parseInt(person.id) !== parseInt(personListHTML[i].id)){
              continue;
            }            
            var personHTML = document.getElementById(personListHTML[i].classList[1].split("_").pop());
            
            var personCoordinates = personHTML.getBoundingClientRect();
            var personParentCoords = personHTML.parentElement.style.transform
            var firstPx = personParentCoords.indexOf("px")
            var personParentX = parseInt(personParentCoords.slice(10, firstPx))
            var personParentY = personParentCoords.slice(firstPx + 4, personParentCoords.length)
            personParentY = parseInt(personParentY.slice(0, personParentY.indexOf("px")))

            if(typeof personListCoords !== undefined){
              if(personListCoords.length === 0){
                personListCoords.push({id: person.id, screen: {x: person.x + personParentX, y: person.y + personParentY}});
                break;
              }
              var alreadyHasThisPerson = false
              for(var j = 0; j < personListCoords.length; j++){
                if(personListCoords[j].id === person.id){
                  personListCoords[j].screen = {x: person.x + personParentX, y: person.y + personParentY}
                  alreadyHasThisPerson = true;
                }
              }
              if(!alreadyHasThisPerson){
                personListCoords.push({id: person.id, screen: {x: person.x + personParentX, y: person.y + personParentY}});
              }
            }
            this.setState({
              personClassCoordinates: personListCoords,
              personSize: {width: personCoordinates.width, height: personCoordinates.height}
            })
          }
        })
      }

      getCoordinatesInitFalse(){
        var personList = [...this.state.personList]
        var personListCoords = [...this.state.personClassCoordinates]
        var personListHTML = Array.from(document.querySelectorAll("div.person"));

        personList.map(person => {
          for(var i = 0; i < personListHTML.length; i++){
            if(parseInt(person.id) !== parseInt(personListHTML[i].id)){
              continue;
            }            
            var personHTML = document.getElementById(personListHTML[i].classList[1].split("_").pop());
            
            personHTML.style.transform = "translate(" + (person.x - personHTML.offsetLeft + 5) + "px, " + (person.y - personHTML.offsetTop + 5) + "px)"
            
            var personCoordinates = personHTML.getBoundingClientRect();
            if(typeof personListCoords !== undefined){
              if(personListCoords.length === 0){
                personListCoords.push({id: person.id, screen: {x: person.x, y: person.y}});
                break;
              }
              var alreadyHasThisPerson = false
              for(var j = 0; j < personListCoords.length; j++){
                if(personListCoords[j].id === person.id){
                  personListCoords[j].screen = {x: person.x, y: person.y}
                  alreadyHasThisPerson = true;
                }
              }
              if(!alreadyHasThisPerson){
                personListCoords.push({id: person.id, screen: {x: person.x, y: person.y}});
              }
            }
            this.setState({
              hasPersonCoords: true,
              personClassCoordinates: personListCoords,
              personSize: {width: personCoordinates.width, height: personCoordinates.height}
            }, () => this.renderRelationships())
          }
        })
      }

      resetCoords(){
        window.location.reload(); 
      }
      
      saveCoords(){
        var personListHTML = Array.from(document.querySelectorAll("div.person"));
        var personListCoords = [...this.state.personClassCoordinates]
        personListHTML.map(item => {
          var personNew = [];
          axios
          .get(`http://localhost:8000/api/familytreepersons/${item.id}/`, item)
          .then(res => {
            personNew = res.data;
            personListCoords.map(coords => {
            if(coords.id === res.data.id){
              personNew.x = coords.screen.x;
              personNew.y = coords.screen.y;
            }
            })
          })
          .then(() => axios.put(`http://localhost:8000/api/familytreepersons/${personNew.id}/`, personNew));
        })
      }

      setActivePerson(id) {
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
            if(!exists) this.toggleRelationshipModal();
            // else - delete/edit relationship OR if above toggle 
          }
          this.setState({activePersons: array});
      }

      renderRelationships = () => {
          var relationshipPairList = [];
          var relationshipPersonList = [];
          var relationshipsNames = [];
          var relationshipList = [...this.state.relationshipList]
          var randomColor = [...this.state.colorArray]
          relationshipList.map(relationship => {
            this.state.personClassCoordinates.map(person => {
              if(parseInt(relationship.id_1) === parseInt(person.id) || parseInt(relationship.id_2) === parseInt(person.id)){
                relationshipPersonList.push(person);
                relationshipsNames.push(relationship.relationships);
              }
            });
          });

          for (var i = 0; i<relationshipPersonList.length; i+=2){
            relationshipPairList.push({ 
              relationship: relationshipsNames[i],
              id1: relationshipPersonList[i].id, 
              id2: relationshipPersonList[i+1].id, 
              x1: relationshipPersonList[i].screen.x + this.state.personSize.width / 2, 
              y1: relationshipPersonList[i].screen.y + this.state.personSize.height / 2, 
              x2: relationshipPersonList[i+1].screen.x + this.state.personSize.width / 2, 
              y2: relationshipPersonList[i+1].screen.y + this.state.personSize.height / 2});
          }
          this.setState({
            relationships: (relationshipPairList.map(item => (
              <React.Fragment
              key={"fragment_" + item.id1 + "_" + item.id2}
              >
                <polyline 
                id={"path_" + item.id1 + "_" + item.id2}
                points={Math.round(item.x1) + " " + Math.round(item.y1) +
                ", " + Math.round(item.x1) + " " + Math.round((Math.round(item.y1) + Math.round(item.y2))/2) +
                ", " + Math.round(item.x2) + " " + Math.round((Math.round(item.y1) + Math.round(item.y2))/2) +
                ", " + Math.round(item.x2) + " " + Math.round(item.y2)} 
                stroke={'rgb(' + randomColor[Math.floor(Math.random()*randomColor.length)] + ',' + randomColor[Math.floor(Math.random()*randomColor.length)] + ',' + randomColor[Math.floor(Math.random()*randomColor.length)] + ')'}
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
      }

      deleteRelationships(id){
        var relationships = [];
        axios
          .get("http://localhost:8000/api/familytreerelationship/")
          .then(res => relationships = res.data )
          .then(() => {
            relationships.map(item => {
              if(parseInt(id)===parseInt(item.id_1) || parseInt(id)===parseInt(item.id_2)){
                axios
                .delete(`http://localhost:8000/api/familytreerelationship/${item.id}`)
                .then(() => this.refreshRelationshipList());
              }
            })
          })
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
            deleteRelationships={this.deleteRelationships.bind(this)}
          />
        ));
      };

      render() {
        return (
          <React.Fragment>
            <div className="contentPerson">
              <svg height="1080" width="1920">
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
                  activePersons={this.state.activePersons}
                  toggle={this.toggleRelationshipModal}
                  onSave={this.handleSubmitRelationship}
                />
              ) : null}
            </div>
            <div className="buttons">
              <button onClick={this.resetCoords} className="btn btn-outline-danger btn-circle btn-xl">
                <i className="fas fa-redo"></i>
              </button>
              <button onClick={this.saveCoords.bind(this)} className="btn btn-outline-info btn-circle btn-xl">
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