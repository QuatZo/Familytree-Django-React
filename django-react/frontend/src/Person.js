// frontend/src/Person.js

    import React, { Component } from "react";
    import Modal from "./components/PersonModal";
    import axios from "axios";
    import Draggable from 'react-draggable';
    import './Person.css';
    
    const Choices = [
      {value: 'living', label: 'Living'},
      {value: 'deceased', label: 'Deceased'},
      {value: 'unknown', label: 'Unknown'}
    ]

    class Person extends Component {    
      constructor(props) {
        super(props);
        this.state = {
          viewCompleted: false,
          activeItem: {
            first_name: "",
            last_name: "",
            birth_date: Date.now(),
            status_choices:  Choices.values[0],
          },
          personList: [],
          activePersons: []
        };
      }          
      componentDidMount() {
        this.refreshList();
      }
      refreshList = () => {
        axios
          .get("http://localhost:8000/api/familytreepersons/")
          .then(res => this.setState({ personList: res.data }))
          .catch(err => console.log(err));
      };
      setActive(id) {
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
          this.setState({activePersons: array});
      }
      renderItems = () => {
        const newItems = this.state.personList;
        // swobodne poruszanie -> usuń grida z handlerów 
        const dragHandlers = {onStart: this.onStart, onStop: this.onStop, grid: [20, 20]};
        return newItems.map(item => (
          <Draggable {...dragHandlers}>
          <div
            className={"person id_" + item.id + " " + (this.state.activePersons.includes(item.id)?"active":"inactive") +  " border rounded"}
            onClick={() => this.setActive(item.id)}
          >
            <img src="https://live.staticflickr.com/7038/6944665187_b8cd703bc2.jpg" 
            className = "img-thumbnail"
            alt = "Error not found"/>
            <div
              className={`name`}
              last_name={item.first_name}
            >
              {item.first_name + ' ' + item.last_name }
            </div> 
            <div
              className={'buttons'}
            >
              <button
                onClick={() => this.editItem(item)}
                className="btn btn-secondary mr-2"
              >
                {" "}
                Edit{" "}
              </button>
              <button
                onClick={() => this.handleDelete(item)}
                className="btn btn-danger"
              >
                Delete{" "}
              </button>
            </div>
          </div>
          </Draggable>
        ));
      };
      toggle = () => {
        this.setState({ modal: !this.state.modal });
      };
      handleSubmit = item => {
        this.toggle();
        if (item.id) {
          axios
            .put(`http://localhost:8000/api/familytreepersons/${item.id}/`, item)
            .then(res => this.refreshList());
          return;
        }
        axios
          .post("http://localhost:8000/api/familytreepersons/", item)
          .then(res => this.refreshList());
      };
      handleDelete = item => {
        axios
          .delete(`http://localhost:8000/api/familytreepersons/${item.id}`)
          .then(res => this.refreshList());
      };
      createItem = () => {
        const item = { first_name: "", last_name: "", birth_date: Date().now, status_choices: Choices.values[0]};
        this.setState({ activeItem: item, modal: !this.state.modal });
      };
      editItem = item => {
        this.setState({ activeItem: item, modal: !this.state.modal });
      };
      render() {
        return (
          <React.Fragment>
            <button onClick={this.createItem} className="btn btn-primary">
              Create Person
            </button>
            <div className="contentPerson">
              {this.renderItems()}
              {this.state.modal ? (
                <Modal
                  activeItem={this.state.activeItem}
                  toggle={this.toggle}
                  onSave={this.handleSubmit}
                />
              ) : null}
            </div>
          </React.Fragment>
        );
      }
    }
    export default Person;