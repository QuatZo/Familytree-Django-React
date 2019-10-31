// frontend/src/App.js

    import React, { Component } from "react";
	  import './App.css';
    import Familytree from "./Familytree";
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
            <Familytree />
            <Todo />
          </div>
        );
      }
    }
    export default App;