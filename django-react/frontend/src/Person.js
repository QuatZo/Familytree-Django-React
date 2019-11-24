// frontend/src/Person.js

    import React, { Component } from "react";
    import Draggable from 'react-draggable';
    import ModalPerson from "./components/PersonModal"
    import axios from "axios";
	  import './Person.css';

    class App extends Component {
      constructor(props) {
        super(props);
        this.state = {
          dragging: false,
         };
      }

      editItem = item => {
        this.setState({ activeItem: item, modal: !this.state.modal });
      };

      handleSubmit = item => {
        this.toggle();
        if (item.id) {
          axios
            .put(`http://localhost:8000/api/familytreepersons/${item.id}/`, item)
            .then(() => this.props.refresh())
            .then(() => this.props.notifySave())
            .catch(err => {
              console.log(err);
              this.props.notifyError();
            });
          return;
        }
        axios
          .post("http://localhost:8000/api/familytreepersons/", item)
          .then(() => this.props.refresh())
          .then(() => this.props.notifySave())
          .catch(err => {
            console.log(err);
            this.props.notifyError();
          });
      };

      toggle = () => {
        this.setState({ modal: !this.state.modal });
      };

      handleDelete = item => {
        this.props.deleteRelationships(item.id)
        axios
          .delete(`http://localhost:8000/api/familytreepersons/${item.id}`)
          .then(() => this.props.refresh())
          .then(() => this.props.notifyDelete())
          .catch(err => {
            console.log(err);
            this.props.notifyError();
          });
      };


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
                  <img src="https://live.staticflickr.com/7038/6944665187_b8cd703bc2.jpg" 
                  draggable="false"
                  className = "img-thumbnail"
                  alt = "Error not found"/>
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
              />
            ) : null}
          </React.Fragment>
        );
      }
    }
    export default App;