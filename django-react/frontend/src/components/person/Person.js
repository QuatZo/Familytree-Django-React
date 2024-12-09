// frontend/src/Person.js

    import React, { Component, createRef } from "react";
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
          isOffScreen: {
            top: false,
            bottom: false,
            left: false,
            right: false,
          }
         };
         this.elementRef = createRef();
      }

      componentDidMount() {
        this.updateVisibility();
        window.addEventListener("resize", this.updateVisibility);
      }

      componentWillUnmount() {
        window.removeEventListener("resize", this.updateVisibility);
      }

      updateVisibility = () => {
        const { parentRef } = this.props;

        if (!this.elementRef.current || !parentRef.current) return;

        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const parentCoords = parentRef.current.getBoundingClientRect();

        var index = this.props.personCoordinates.findIndex(el => el.id === this.props.person.id);
        const coords = this.props.personCoordinates[index];
        const isOffScreen = {
          top: coords.screen.y + parentCoords.y < 0,
          bottom: coords.screen.y + parentCoords.y > viewportHeight,
          left: coords.screen.x + parentCoords.x < 0,
          right: coords.screen.x + parentCoords.x > viewportWidth,
        };
        this.setState({isOffScreen: isOffScreen});
        return {id: this.props.person.id, isOffScreen: isOffScreen}
      };

      // toggles the Edit Person Modal
      toggleEditPersonModal = () => {
        this.setState({ modal: !this.state.modal });
      };

      // handles Person's submission for existing person (changes its data in API)
      handleSubmit = (item) => {
        this.toggleEditPersonModal();

        if (item.id) {
          var SHA256 = require("crypto-js/sha256");
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
          if(oldItem.avatar !== item.avatar && item.avatar !== null && item.avatar !== undefined){
            var newFilename = SHA256(Date.now().toString() + item.avatar.name) + item.avatar.name.substring(item.avatar.name.indexOf("."));
            data.append('avatar', item.avatar, newFilename); // sha256 encryption
          } 

          axios
          .patch(`/api/familytreepersons/${item.id}/`, data, {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `JWT ${localStorage.getItem('token')}`
            }
          })
            .then(() => this.props.refresh())
            .then(() => ShowNotification(NOTIFY.SAVE_PERSON, this.props.theme))
            .catch(err => {
              console.log(err);
              ShowNotification(NOTIFY.ERROR, this.props.theme);
            });
        }
      };

      // handles deletion of existing Person
      handleDelete = item => {
        this.props.toggleConfirmModal();
        // Django's foreign key & on_delete param handles the deletion of relationships, so it's no longer needed to do this manually
        // Same with Milestones, deleting person means deleting its ID from Person & Milestone relation-table
        axios
          .delete(`/api/familytreepersons/${item.id}`, {
            headers: { Authorization: `JWT ${localStorage.getItem('token')}`}
          })
          .then(() => this.props.refresh())
          .then(() => this.props.refreshRelationships())
          .then(() => ShowNotification(NOTIFY.DELETE_PERSON, this.props.theme))
          .catch(err => {
            console.log(err);
            ShowNotification(NOTIFY.ERROR, this.props.theme);
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

      getRelativePath(mediaFile){
        return mediaFile.substring(mediaFile.indexOf('/media'))
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
              onStart={(e) => {
                e.stopPropagation();
              }}
              onDrag={this.updateVisibility}
            >
              <div
              ref={this.elementRef}
              className="personcontainer"
              >
                <div
                  id={this.props.person.id}
                  className={"person id_" + this.props.person.id + " " + (this.props.activePersons.includes(this.props.person.id)?"active":"inactive") +  " border rounded " + this.props.theme}
                  onDoubleClick={() => this.props.setActivePerson(this.props.person.id)}
                  onMouseDown={this.handleClick.bind(this)}
                  onMouseUp={this.handleClick.bind(this)}
                  onMouseMove={this.handleMovement.bind(this)}
                >
                  <img src={this.getRelativePath(this.props.person.avatar)}
                  draggable="false"
                  className = "img-thumbnail"
                  alt = "Error: not found"/>
                  <div
                    className={`name`}
                    first_name={this.props.person.first_name}
                  >
                    {this.props.person.first_name}
                  </div>
                  <div
                    className={`name`}
                    first_name={this.props.person.last_name}
                  >
                    {this.props.person.last_name}
                  </div>
                  {this.props.showButtons && !this.props.printable ? (
                  <div>
                    <button
                      onClick={() => this.toggleEditPersonModal()}
                      className={"btn " + (this.props.theme === 'dark' ? 'dark btn-outline-' : 'light btn-') + "primary btn-xl personbutton"}
                    >
                      <i className="fas fa-user-edit"></i>
                    </button>
                    <button
                      onClick={() => this.props.toggleConfirmModal("Delete Person", "Are you sure you want to delete " + this.props.person.first_name + " " + this.props.person.last_name + " with connected relationships from Familytree?", "Delete", "Cancel", () => this.handleDelete(this.props.person))}
                      className={"btn " + (this.props.theme === 'dark' ? 'dark btn-outline-' : 'light btn-') + "primary btn-xl personbutton"}
                    >
                      <i className="fas fa-user-minus"></i>
                    </button>
                  </div>
                  ): null} 
                </div>
              </div>
            </Draggable>
            {this.state.modal ? (
              <ModalPerson
                activeItem={this.props.person}
                toggle={this.toggleEditPersonModal}
                onSave={this.handleSubmit}
                refreshRelationships={this.props.refreshRelationships.bind(this)}
                toggleConfirmModal={this.props.toggleConfirmModal.bind(this)}
                theme={this.props.theme}
              />
            ) : null}
          </React.Fragment>
        );
      }
    }
    export default Person;