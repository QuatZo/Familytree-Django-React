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
          windowSize: {width: 0, height: 0},
          saving: false
        };
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
      }  

      componentDidMount(){
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
        this.getCoordinates()
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
            .then(() => this.refreshPersonList())
            .catch(err => console.log(err));
          return;
        }
        axios
          .post("http://localhost:8000/api/familytreepersons/", item)
          .then(() => this.refreshPersonList())
          .catch(err => console.log(err));
      };

      handleSubmitRelationship = item => {
        this.toggleRelationshipModal();
        if (item.id) {
          axios
            .put(`http://localhost:8000/api/familytreerelationship/${item.id}/`, item)
            .then(() => this.refreshRelationshipList())
            .catch(err => console.log(err));
          return;
        }
        axios
          .post("http://localhost:8000/api/familytreerelationship/", item)
          .then(() => this.refreshRelationshipList())
          .catch(err => console.log(err));
      };
      
      createPerson = () => {
        const item = { first_name: "", last_name: "", birth_date: "", status_choices: 'living', sex_choices: 'male', birth_place: ""};
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

        this.getCoordinates()
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
              personNew.x = coords.screen.x / this.state.windowSize.width;
              personNew.y = coords.screen.y / this.state.windowSize.height;
            }
            })
          })
          .then(() => axios.put(`http://localhost:8000/api/familytreepersons/${personNew.id}/`, personNew)) 
          .catch(err => console.log(err));           
        })
        this.setState({
          saving: true,
        }, () => {
          setTimeout(() => {
            this.setState({saving: false})
          }, 3000);
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
          const randomColor = [0, 31, 63, 95, 127, 159, 191, 223, 255];

          relationshipList.map(relationship => {
            this.state.personClassCoordinates.map(person => {
              if(parseInt(relationship.id_1) === parseInt(person.id) || parseInt(relationship.id_2) === parseInt(person.id)){
                relationshipPersonList.push(person);
                relationshipsNames.push(relationship.relationships);
              }
            });
          });
          for (var i = 0; i < relationshipPersonList.length; i+=2){
            relationshipPairList.push({ 
              relationship: relationshipsNames[i],
              id: i / 2,
              id1: relationshipPersonList[i].id, 
              id2: relationshipPersonList[i+1].id, 
              x1: relationshipPersonList[i].screen.x + this.state.personSize.width / 2, 
              y1: relationshipPersonList[i].screen.y + this.state.personSize.height / 2, 
              x2: relationshipPersonList[i+1].screen.x + this.state.personSize.width / 2, 
              y2: relationshipPersonList[i+1].screen.y + this.state.personSize.height / 2});
          }

          var colorOfRelationship = []

          relationshipPairList.map(() => (
              colorOfRelationship.push('rgb(' + randomColor[Math.floor(Math.random()*randomColor.length)] + ',' + randomColor[Math.floor(Math.random()*randomColor.length)] + ',' + randomColor[Math.floor(Math.random()*randomColor.length)] + ')')
          ))

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
                stroke = {colorOfRelationship[item.id]}
                strokeWidth="3" 
                fill="none"/>
                <text 
                x={(Math.round(item.x1) + Math.round(item.x2))/2} 
                y={Math.round((Math.round(item.y1) + Math.round(item.y2))/2) - 5} 
                className="relationshipNames"
                fill={colorOfRelationship[item.id]}>
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
                .then(() => this.refreshRelationshipList())
                .catch(err => console.log(err));
              }
            })
          })
          .catch(err => console.log(err));
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
              <button onClick={this.resetCoords.bind(this)} className="btn btn-outline-danger btn-circle btn-xl">
                <i className="fas fa-redo"></i>
              </button>
              <button disabled={this.state.saving} onClick={this.saveCoords.bind(this)} className="btn btn-outline-info btn-circle btn-xl">
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