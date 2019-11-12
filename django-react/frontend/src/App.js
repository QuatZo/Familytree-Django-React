// frontend/src/App.js

    import React, { Component } from "react";
	  import './App.css';
    import Familytree from "./Familytree";
    import Todo from "./Todo";
    import axios from "axios";
    import FadeIn from "react-fade-in";
    import Lottie from "react-lottie";
    import ReactLoading from "react-loading";
    import "bootstrap/dist/css/bootstrap.css";
    import * as legoData from "./legoloading.json";
    import * as doneData from "./doneloading.json";
    
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: legoData.default,
        rendererSettings: {
        preserveAspectRatio: "xMidYMid slice"
        }
        }
    
    const defaultOptions2 = {
        loop: false,
        autoplay: true,
        animationData: doneData.default,
        rendererSettings: {
        preserveAspectRatio: "xMidYMid slice"
        }
        };
    
    class App extends Component {
      constructor(props) {
        super(props);
        this.state = {
          personList: [],
          relationshipList: [],
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
        axios
          .get("http://localhost:8000/api/familytreerelationship/")
          .then(res => this.setState({ relationshipList: res.data }))
            .then(() => {
              this.setState({ loadingRelationshipList: true });
              setTimeout(() => {
                  this.setState({ doneRelationshipList: true });   
              }, 1000);
            });

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
            <div>
              {!this.state.donePersonList ? (
                <FadeIn>
                  <div className="d-flex justify-content-center align-items-center">
                    <h1 className='error' style={{color: 'white'}}>fetching pizza</h1>
                    {!this.state.loadingPersonList ? (
                      <Lottie options={defaultOptions} height={120} width={120} />
                    ) : (
                      <Lottie options={defaultOptions2} height={120} width={120} />
                    )}
                  </div>
                </FadeIn>
              ) : !this.state.doneRelationshipList ? (
                <FadeIn>
                  <div className="d-flex justify-content-center align-items-center">
                    <h1 className='error' style={{color: 'white'}}>Jable</h1>
                    {!this.state.loadingRelationshipList ? (
                      <Lottie options={defaultOptions} height={120} width={120} />
                    ) : (
                      <Lottie options={defaultOptions2} height={120} width={120} />
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
            
            
          </div>
        );
      }
    }
    export default App;