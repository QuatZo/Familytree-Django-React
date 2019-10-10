// frontend/src/App.js

    import React, { Component } from "react";
	  import './App.css';
    import Person from "./Person";
    import Todo from "./Todo";

    class App extends Component {
      constructor(props) {
        super(props);
        this.state = {
        };
      }
      render() {
        return (
          <div>
            <Person />
            <Todo />
          </div>
        );
      }
    }
    export default App;