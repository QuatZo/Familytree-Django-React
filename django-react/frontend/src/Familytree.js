// frontend/src/Familytree.js
/*eslint no-useless-computed-key: 0*/
/*eslint array-callback-return: 0*/

    import React, { Component } from "react";
    import axios from "axios";
    import Person from "./Person";
    import ModalRelationship from "./components/RelationshipModal";
    import ModalPerson from "./components/PersonAddModal";
    import { Tooltip } from 'react-svg-tooltip';
    import NOTIFY from './Enums.ts';
    import ShowNotification from './components/Notification';
    
    import './Familytree.css';

    class Familytree extends Component {    
      constructor(props) {
        super(props);
        this.state = {
          viewCompleted: false,
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
          relationshipMarkers: [],
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
        this.setState({ ModalRelationship: !this.state.ModalRelationship });
      };

      handleSubmitPerson = item => {
        this.togglePersonModal();
        if (item.id) {
          const options = {
            url: `http://localhost:8000/api/familytreepersons/${item.id}/`,
            content: item,
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `JWT ${localStorage.getItem('token')}`
            },
            data: item
          };
          axios(options)
            .then(() => this.refreshPersonList())
            .then(() => ShowNotification(NOTIFY.SAVE_PERSON))
            .catch(err => {
              console.log(err);
              ShowNotification(NOTIFY.ERROR);
            });
          return;
        }

        const options = {
          url: 'http://localhost:8000/api/familytreepersons/',
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
          .then(() => this.refreshPersonList())
          .then(() => ShowNotification(NOTIFY.ADD_PERSON))
          .catch(err => {
            console.log(err);
            ShowNotification(NOTIFY.ERROR);
          });
      };

      handleSubmitRelationship = item => {
        this.toggleRelationshipModal();
        if (item.id) {
          const options = {
            url: `http://localhost:8000/api/familytreerelationship/${item.id}/`,
            content: item,
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `JWT ${localStorage.getItem('token')}`
            },
            data: item
          };
          axios(options)
            .then(() => this.refreshRelationshipList())
            .then(() => ShowNotification(NOTIFY.SAVE_RELATIONSHIP))
            .catch(err => {
              console.log(err);
              ShowNotification(NOTIFY.ERROR);
            });
          return;
        }

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
        var personListHTML = Array.from(document.querySelectorAll("div.person"));
        var personListCoords = [...this.state.personClassCoordinates]
        personListHTML.map(item => {
          var personNew = [];
          axios
          .get(`http://localhost:8000/api/familytreepersons/${item.id}/`, { 
            headers: { Authorization: `JWT ${localStorage.getItem('token')}` }
          })
          .then(res => {
            personNew = res.data;
            personListCoords.map(coords => {
            if(coords.id === res.data.id){
              personNew.x = coords.screen.x / this.state.windowSize.width;
              personNew.y = coords.screen.y / this.state.windowSize.height;
            }
            })
          })
          .then(() => axios.put(`http://localhost:8000/api/familytreepersons/${personNew.id}/`, personNew, {
            headers: { Authorization: `JWT ${localStorage.getItem('token')}`}
          }))
          .catch(err => {
            console.log(err);
            saved = false;
            ShowNotification(NOTIFY.ERROR);
          });        
        })
        this.setState({
          saving: true,
        }, () => {
          setTimeout(() => {
            this.setState({saving: false});
            if (saved) { ShowNotification(NOTIFY.SAVE_COORDS) };
          }, 5000);
        })
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
            if(!exists) this.toggleRelationshipModal();
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
      
      // it will be useful in the future, after some rework
      /* deleteRelationships(id){
        var relationships = [];
        axios
          .get("http://localhost:8000/api/familytreerelationship/", {
            headers: { Authorization: `JWT ${localStorage.getItem('token')}`}
          })
          .then(res => relationships = res.data )
          .then(() => {
            relationships.map(item => {
              if(parseInt(id)===parseInt(item.id_1) || parseInt(id)===parseInt(item.id_2)){
                axios
                .delete(`http://localhost:8000/api/familytreerelationship/${item.id}`, {
                  headers: { Authorization: `JWT ${localStorage.getItem('token')}`}
                })
                .then(() => this.refreshRelationshipList())
                .then(() => ShowNotification(NOTIFY.DELETE_RELATIONSHIP)))
                .catch(err => {
                  console.log(item)
                  console.log(err);
                  ShowNotification(NOTIFY.ERROR);
                });
              }
            })
          })
          .catch(err => {
            console.log(err);
            ShowNotification(NOTIFY.ERROR);
          });
      } */
    
      calcSideCenters(first, second){
        const nav = document.getElementById("nav").getBoundingClientRect().height - 5;

        var relationshipPoints = {
          top: [
            {x: first.screen.x + this.state.personSize.width / 2, y: first.screen.y},
            {x: second.screen.x + this.state.personSize.width / 2, y: second.screen.y}
          ],
          right: [
            {x: first.screen.x + this.state.personSize.width, y: first.screen.y + this.state.personSize.height / 2},
            {x: second.screen.x + this.state.personSize.width, y: second.screen.y + this.state.personSize.height / 2}
          ],
          bottom: [
            {x: first.screen.x + this.state.personSize.width / 2, y: first.screen.y + this.state.personSize.height},
            {x: second.screen.x + this.state.personSize.width / 2, y: second.screen.y + this.state.personSize.height}
          ],
          left: [
            {x: first.screen.x, y: first.screen.y + this.state.personSize.height / 2},
            {x: second.screen.x, y: second.screen.y + this.state.personSize.height / 2}
          ],
          mid: [
            {x: first.screen.x + this.state.personSize.width / 2, y: first.screen.y + this.state.personSize.height / 2},
            {x: second.screen.x + this.state.personSize.width / 2, y:second.screen.y + this.state.personSize.height / 2}
          ],
        };

        var x1Temp, y1Temp, x2Temp, y2Temp;
        var horizontalTemp = false;

        if(relationshipPoints.top[0].y > relationshipPoints.bottom[1].y + 10){
          x1Temp = relationshipPoints.top[0].x + 5;
          y1Temp = relationshipPoints.top[0].y + nav + 10;
          x2Temp = relationshipPoints.bottom[1].x + 5;
          y2Temp = relationshipPoints.bottom[1].y + nav + 20;
        }
        else if(relationshipPoints.bottom[0].y < relationshipPoints.top[1].y - 10){
          x1Temp = relationshipPoints.bottom[0].x + 5;
          y1Temp = relationshipPoints.bottom[0].y + nav + 5;
          x2Temp = relationshipPoints.top[1].x + 5;
          y2Temp = relationshipPoints.top[1].y + nav;
        }
        else if(relationshipPoints.right[0].x < relationshipPoints.left[1].x){
          x1Temp = relationshipPoints.right[0].x + 5;
          y1Temp = relationshipPoints.right[0].y + nav + 5;
          x2Temp = relationshipPoints.left[1].x + 5;
          y2Temp = relationshipPoints.left[1].y + nav + 5;
          horizontalTemp = true;
        }
        else if(relationshipPoints.left[0].x > relationshipPoints.right[1].x){
          x1Temp = relationshipPoints.left[0].x + 5;
          y1Temp = relationshipPoints.left[0].y + nav + 5;
          x2Temp = relationshipPoints.right[1].x + 5;
          y2Temp = relationshipPoints.right[1].y + nav + 5;
          horizontalTemp = true;
        }
        else{
          x1Temp = relationshipPoints.mid[0].x;
          y1Temp = relationshipPoints.mid[0].y;
          x2Temp = relationshipPoints.mid[0].x;
          y2Temp = relationshipPoints.mid[0].y;
        }

        return {x1: x1Temp, y1: y1Temp, x2: x2Temp, y2: y2Temp, horizontal: horizontalTemp};
      }

      calcTextWidth(text, font) {
        var canvas = this.calcTextWidth.canvas || (this.calcTextWidth.canvas = document.createElement("canvas"));
        var context = canvas.getContext("2d");
        context.font = font;
        var metrics = context.measureText(text);
        return metrics.width;
      }

      renderRelationships = () => {
          var relationshipPairList = [];
          var relationshipPersonList = [];
          var relationshipsNames = [];
          var relationshipList = [...this.state.relationshipList]
          var relationshipColor = [];

          relationshipList.map(relationship => {
            this.state.personClassCoordinates.map(person => {
              if(parseInt(relationship.id_1) === parseInt(person.id) || parseInt(relationship.id_2) === parseInt(person.id)){
                relationshipPersonList.push(person);
                relationshipsNames.push(relationship.relationships);
                relationshipColor.push(relationship.color);
              }
            });
          });
          for (var i = 0; i < relationshipPersonList.length; i += 2){
            var sideCoords = this.calcSideCenters(relationshipPersonList[i], relationshipPersonList[i + 1]);

            var pointsTemp = Math.round(sideCoords.x1) + " " + Math.round(sideCoords.y1) +
            ", " + Math.round(sideCoords.x1) + " " + Math.round((Math.round(sideCoords.y1) + Math.round(sideCoords.y2))/2) +
            ", " + Math.round(sideCoords.x2) + " " + Math.round((Math.round(sideCoords.y1) + Math.round(sideCoords.y2))/2) +
            ", " + Math.round(sideCoords.x2) + " " + Math.round(sideCoords.y2)

            if(sideCoords.horizontal){
              pointsTemp = Math.round(sideCoords.x1) + " " + Math.round(sideCoords.y1) +
              ", " + Math.round((Math.round(sideCoords.x1) + Math.round(sideCoords.x2))/2) + " " + Math.round(sideCoords.y1) +
              ", " + Math.round((Math.round(sideCoords.x1) + Math.round(sideCoords.x2))/2) + " " + Math.round(sideCoords.y2) +
              ", " + Math.round(sideCoords.x2) + " " + Math.round(sideCoords.y2);
            }

            relationshipPairList.push({ 
              id: i / 2,
              relationship: relationshipsNames[i],
              id1: relationshipPersonList[i].id, id2: relationshipPersonList[i+1].id, 
              color: relationshipColor[i],
              points: pointsTemp,
            });
          }

          var reference = [];

          relationshipPairList.map( () => {
            const lineRef = React.createRef();
            reference.push(lineRef);
          })

          this.setState({
            relationshipMarkers: (relationshipPairList.map(item => (
              <marker 
              id={'head_' + item.color.substring(1)} 
              key={'head_' + item.color.substring(1)} 
              orient="auto"
              markerWidth='6' markerHeight='6'
              refX='0.1' refY='3'
              >
                <path d='M0,0 V6 L3,3 Z' fill={item.color} stroke={item.color}/>
              </marker>
            ))),
            relationships: (relationshipPairList.map(item => (
              <React.Fragment
              key={"fragment_" + item.id1 + "_" + item.id2}
              >
                <polyline 
                ref={reference[item.id]}
                id={"path_" + item.id1 + "_" + item.id2}
                markerEnd={'url(#head_' + item.color.substring(1) + ')'}
                points={item.points} 
                stroke = {item.color}
                strokeWidth="3" 
                fill="none"/>
                <Tooltip triggerRef={reference[item.id]}>
                    <rect x={0} y={-35} width={this.calcTextWidth(item.relationship, "16pt arial")+29} height={35} rx={5} ry={5} fill='black'/>
                    <text x={15} y={-10} fontSize={"16pt"} fill='white'>{item.relationship}</text>
                </Tooltip>
              </React.Fragment>
              )
            )
          )});
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

      render() {
        return (
          <React.Fragment>
            <div className="contentPerson">
              <svg height={this.state.windowSize.height} width={this.state.windowSize.width}>
              <defs>
                {this.state.relationshipMarkers}
              </defs>
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