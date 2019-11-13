// frontend/src/App.js

    import React, { Component } from "react";
	  import './App.css';
    import Familytree from "./Familytree";
    import Todo from "./Todo";
    import axios from "axios";
    import FadeIn from "react-fade-in";
    import Lottie from "react-lottie";
    import "bootstrap/dist/css/bootstrap.css";
    import * as stillLoadingData from "./stillloading.json";
    import * as doneLoadingData from "./doneloading.json";
    
    const defaultOptionsLoading = {
        loop: true,
        autoplay: true,
        animationData: stillLoadingData.default,
        rendererSettings: {
          preserveAspectRatio: "xMidYMid meet"
        }
      }
    
    const defaultOptionsLoaded = {
        loop: false,
        autoplay: true,
        animationData: doneLoadingData.default,
        rendererSettings: {
          preserveAspectRatio: "xMidYMid meet"
        }
      };
    
    class App extends Component {
      constructor(props) {
        super(props);
        this.state = {
          personList: [],
          relationshipList: [],
          relationships: [],
          loadingPersonList: undefined,
          donePersonList: undefined,
          loadingRelationshipList: undefined,
          doneRelationshipList: undefined
        };
      }

      componentDidMount() {
        setTimeout(() => {
          axios
          .get("http://localhost:8000/api/familytreepersons/")
          .then(res => this.setState({ personList: res.data }))
          .then(() => {
              this.setState({ loadingPersonList: true });
              setTimeout(() => {
                this.fetchRelationshipList();
              }, 1000);
          });
         }, 1200);
      }

      fetchRelationshipList = () => {
        this.setState({ donePersonList: true });
        setTimeout(() => {
        axios
          .get("http://localhost:8000/api/familytreerelationship/")
          .then(res => this.setState({ relationshipList: res.data }))
          .then(() => {
            this.setState({ loadingRelationshipList: true });
            setTimeout(() => {
                this.setState({ doneRelationshipList: true });   
            }, 1000);
          });
        }, 1200);
      }

      refreshPersonList = () => {
        axios
          .get("http://localhost:8000/api/familytreepersons/")
          .then(res => this.setState({ personList: res.data }))
          .catch(err => console.log(err));
      };

      refreshRelationshipList = () => {
        axios
          .get("http://localhost:8000/api/familytreerelationship/")
          .then(res => this.setState({ relationshipList: res.data }))
          .catch(err => console.log(err));
      };

      render() {
        return (
          <div>
              {!this.state.donePersonList ? (
                <FadeIn>
                  <div className="loading">
                    <h1 className="display-3">Fetching Persons</h1>
                    {!this.state.loadingPersonList ? (
                        <Lottie options={defaultOptionsLoading}/>
                    ) : (
                      <Lottie options={defaultOptionsLoaded}/>
                    )}
                  </div>
                </FadeIn>
              ) : !this.state.doneRelationshipList ? (
                <FadeIn>
                  <div className="loading">
                    <h1 className="display-3">Fetching Relationships</h1>
                    {!this.state.loadingRelationshipList ? (
                      <Lottie options={defaultOptionsLoading}/>
                    ) : (
                      <Lottie options={defaultOptionsLoaded}/>
                    )}
                  </div>
                </FadeIn>
              ): (
                <React.Fragment>
                  <Familytree 
                  personList = {this.state.personList}
                  relationshipList = {this.state.relationshipList}
                  />
                  <Todo />
                </React.Fragment>
              )}            
          </div>
        );
      }
    }
    export default App;