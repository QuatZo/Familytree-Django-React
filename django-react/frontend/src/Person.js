// frontend/src/Person.js

    import React, { Component } from "react";
    import Draggable from 'react-draggable';
    import ModalPerson from "./components/PersonModal"
    import axios from "axios";
	  //import './Person.css';
    import './Familytree.css';

    class App extends Component {
      constructor(props) {
        super(props);
        this.state = {
          person: this.props.person,
          viewCompleted: this.props.viewCompleted,
          activeItem: this.props.activeItem,
          personList: this.props.personList,
          draggedPoint: this.props.draggedPoint,
          personClassCoordinates: this.props.personClassCoordinates,
          relationships: this.props.relationships,
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
            .then(() => this.props.refresh());
          return;
        }
        axios
          .post("http://localhost:8000/api/familytreepersons/", item)
          .then(() => this.props.refresh());
      };

      toggle = () => {
        this.setState({ modal: !this.state.modal });
      };

      handleDelete = item => {
        axios
          .delete(`http://localhost:8000/api/familytreepersons/${item.id}`)
          .then(res => this.props.refresh());
      };

      render() {
        // free movement -> delete grid from handlers
        const dragHandlers = {onStart: this.onStart, onStop: this.onStop, grid: [20, 20]};
        return (
          <React.Fragment>
          <Draggable cancel="button" {...dragHandlers} key={this.state.person.id}>
          <div
            id={this.state.person.id}
            onLoad={this.props.getPersonCoordinates}
            onMouseMove={this.props.coordinates}
            onDrag={this.props.getPersonCoordinates}
            className={"person id_" + this.state.person.id + " " + (this.props.activePersons.includes(this.state.person.id)?"active":"inactive") +  " border rounded"}
            onClick={() => this.props.setActivePerson(this.state.person.id)}
          >
            <img src="https://live.staticflickr.com/7038/6944665187_b8cd703bc2.jpg" 
            draggable="false"
            className = "img-thumbnail"
            alt = "Error not found"/>
            <div
              className={`name`}
              first_name={this.state.person.first_name}
            >
              {this.state.person.first_name + ' ' + this.state.person.last_name}
            </div> 
            <div
              className={'buttons'}
            >
              <button
                onClick={() => this.editItem(this.state.person)}
                className="btn btn-secondary mr-2"
              >
                Edit{" "}
              </button>
              <button
                onClick={() => this.handleDelete(this.state.person)}
                className="btn btn-danger"
              >
                Delete{" "}
              </button>
            </div>
          </div>
          </Draggable>
          {this.state.modal ? (
            <ModalPerson
              activeItem={this.state.person}
              toggle={this.toggle}
              onSave={this.handleSubmit}
            />
          ) : null}
          </React.Fragment>
        );
      }
    }
    export default App;