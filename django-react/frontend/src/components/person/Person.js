// frontend/src/Person.js

    import React, { Component } from "react";
    import Draggable from 'react-draggable';
    import ModalPerson from "./PersonEditTimelineModal"
    import axios from "axios";
    import './Person.css';
    import {NOTIFY} from '../Enums.ts';
    import ShowNotification from '../notification/Notification';

    class Person extends Component {
      constructor(props) {
        super(props);
        this.state = {
          dragging: false, // flag, which says if user is draggin person or not
         };
      }

      // prepares data for Edit Person Modal
      editItem = item => {
        this.setState({ activeItem: item, modal: !this.state.modal });
      };

      // handles Person's submission for existing person (changes its data in API)
      handleSubmit = (item, file) => {
        this.toggle();

        if (item.id) {
          var SHA256 = require("crypto-js/sha256");
          var newFilename = file !== null ? SHA256(Date.now().toString() + file.name) + file.name.substring(file.name.indexOf(".")) : null;
          var oldItem = this.props.person;

          let data = new FormData();
          // following conditional instructions are to patch (update) only the data that has been changed, it makes the transfer data lower, especially while having media files
          if(oldItem.user_id !== item.user_id) data.append('user_id', item.user_id);
          if(oldItem.first_name !== item.first_name) data.append('first_name', item.first_name);
          if(oldItem.last_name !== item.last_name) data.append('last_name', item.last_name);
          if(oldItem.birth_date !== item.birth_date) data.append('birth_date', item.birth_date);
          if(oldItem.status_choices !== item.status_choices) data.append('status_choices', item.status_choices);
          if(oldItem.sex_choices !== item.sex_choices) data.append('sex_choices', item.sex_choices);
          if(oldItem.birth_place !== item.birth_place) data.append('birth_place', item.birth_place);
          if(oldItem.relationship_choices !== item.relationship_choices) data.append('relationship_choices', item.relationship_choices);
          if(oldItem.avatar !== file && file !== null) data.append('avatar', file, newFilename); // sha256 encryption

          axios
          .patch(`http://localhost:8000/api/familytreepersons/${item.id}/`, data, {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `JWT ${localStorage.getItem('token')}`
            }
          })
            .then(() => this.props.refresh())
            .then(() => ShowNotification(NOTIFY.SAVE_PERSON))
            .catch(err => {
              console.log(err);
              ShowNotification(NOTIFY.ERROR);
            });
        }
      };

      // toggles the Edit Person Modal
      toggle = () => {
        this.setState({ modal: !this.state.modal });
      };

      // handles deletion of existing Person
      handleDelete = item => {
        // Django's foreign key & on_delete param handles the deletion of relationships, so it's no longer needed to do this manually
        // Delete Relationship function hasn't been deleted from familytree.js, because it'll probably be used for single relationship delete
        // this.props.deleteRelationships(item.id)
        axios
          .delete(`http://localhost:8000/api/familytreepersons/${item.id}`, {
            headers: { Authorization: `JWT ${localStorage.getItem('token')}`}
          })
          .then(() => this.props.refresh())
          .then(() => this.props.refreshRelationships())
          .then(() => ShowNotification(NOTIFY.DELETE_PERSON))
          .catch(err => {
            console.log(err);
            ShowNotification(NOTIFY.ERROR);
          });
      };

      // handles click on existing Person (tells if user wants to drag a person or no)
      handleClick = e => {
        if(e.type === "mousedown"){
          this.setState({
            dragging: true
          })
        }
        else{
          this.setState({
            dragging: false
          })
        }
      }

      // handles person movement; updates coords & relationships only when person container is moving (react can't decide because of changing CSS Transform values, not states)
      handleMovement(){
        if(this.state.dragging){
          this.props.getCoordinates()
          this.props.renderRelationships()
        }
      }

      render() {
        // free movement -> delete grid from handlers
        const dragHandlers = {onStart: this.onStart, onStop: this.onStop, grid: [1, 1]};
        return (
          <React.Fragment>
            <Draggable 
              cancel="button" {...dragHandlers} 
              key={this.props.person.id}
              defaultPosition={{x: 0, y: 0}}
            >
              <div 
              className="personcontainer"
              >
                <div
                  id={this.props.person.id}
                  className={"person id_" + this.props.person.id + " " + (this.props.activePersons.includes(this.props.person.id)?"active":"inactive") +  " border rounded"}
                  onDoubleClick={() => this.props.setActivePerson(this.props.person.id)}
                  onMouseDown={this.handleClick.bind(this)}
                  onMouseUp={this.handleClick.bind(this)}
                  onMouseMove={this.handleMovement.bind(this)}
                >
                  <img src={this.props.person.avatar}
                  draggable="false"
                  className = "img-thumbnail"
                  alt = "Error: not found"/>
                  <div
                    className={`name`}
                    first_name={this.props.person.first_name}
                  >
                    {this.props.person.first_name + ' ' + this.props.person.last_name}
                  </div> 
                  <div>
                    <button
                      onClick={() => this.editItem(this.props.person)}
                      className="btn btn-outline-info btn-xl personbutton"
                    >
                      <i className="fas fa-user-edit"></i>
                    </button>
                    <button
                      onClick={() => {if(window.confirm("Are you sure you want to delete " + this.props.person.first_name + " " + this.props.person.last_name + " with connected relationships from Familytree?")) this.handleDelete(this.props.person)}}
                      className="btn btn-outline-danger btn-xl personbutton"
                    >
                      <i className="fas fa-user-minus"></i>
                    </button>
                  </div>
                </div>
              </div>
            </Draggable>
            {this.state.modal ? (
              <ModalPerson
                activeItem={this.props.person}
                toggle={this.toggle}
                onSave={this.handleSubmit}
                refreshRelationships={this.props.refreshRelationships.bind(this)}
              />
            ) : null}
          </React.Fragment>
        );
      }
    }
    export default Person;