// frontend/src/App.js

    import React, { Component } from "react";
    import './App.css';
    import Nav from './components/Nav';
    import LoginForm from './components/LoginForm';
    import SignupForm from './components/SignupForm';
    import Familytree from "./Familytree";
    import Todo from "./Todo";
    import axios from "axios";
    import FadeIn from "react-fade-in";
    import Lottie from "react-lottie";
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
          doneRelationshipList: undefined,
          displayed_form: localStorage.getItem('token') ? '' : 'login',
          logged_in: localStorage.getItem('token') ? true : false,
          username: ''
        };
      }

      loginCounter = 0;

      componentDidMount() {
        if (this.state.logged_in) {
          axios
            .get('http://localhost:8000/current_user/', {headers: { Authorization: `JWT ${localStorage.getItem('token')}`}})
            .then(res => {
              this.setState({ username: res.data.username });
            })
          }
      }

      componentDidUpdate(){
        if (this.loginCounter < 1 && this.state.logged_in && !this.state.doneRelationshipList && !this.state.donePersonList){
          this.loginCounter += 1;
          setTimeout(() => {
            axios
              .get("http://localhost:8000/api/familytreepersons/", {headers: { Authorization: `JWT ${localStorage.getItem('token')}`}})
              .then(res => this.setState({ personList: res.data }))
              .then(() => {
                  this.setState({ loadingPersonList: true });
                  setTimeout(() => {
                    this.fetchRelationshipList();
                  }, 1000);
              });
          }, 1200);
        }
      }

      fetchRelationshipList = () => {
        this.setState({ donePersonList: true });
        setTimeout(() => {
        axios
          .get("http://localhost:8000/api/familytreerelationship/", {headers: { Authorization: `JWT ${localStorage.getItem('token')}`}})
          .then(res => this.setState({ relationshipList: res.data }))
          .then(() => {
            this.setState({ loadingRelationshipList: true });
            setTimeout(() => {
                this.setState({ doneRelationshipList: true });   
            }, 1000);
          });
        }, 1200);
      }

      handle_login = (e, data) => {
        e.preventDefault();
        const options = {
          url: 'http://localhost:8000/token-auth/',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          data: data
        };
        axios(options)
          .then(res => {
            // we store the user's ID under res.data.user.id
            localStorage.setItem('token', res.data.token);
            this.setState({
              logged_in: true,
              displayed_form: '',
              username: res.data.user.username
            });
          });
      };
    
      handle_signup = (e, data) => {
        e.preventDefault();
        const options = {
          url: 'http://localhost:8000/users/',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          data: data
        };
        axios(options)
          .then(res => {
            localStorage.setItem('token', res.data.token);
            this.setState({
              logged_in: true,
              displayed_form: '',
              username: res.data.username
            });
          });
      };
    
      handle_logout = () => {
        localStorage.removeItem('token');
        this.loginCounter = 0;
        this.setState({ 
          logged_in: false, 
          username: '',
          personList: [],
          relationshipList: [],
          relationships: [],
          loadingPersonList: undefined,
          donePersonList: undefined,
          loadingRelationshipList: undefined,
          doneRelationshipList: undefined,
        });
      };
    
      display_form = form => {
        this.setState({
          displayed_form: form
        });
      };

      refreshPersonList = () => {
        axios
          .get("http://localhost:8000/api/familytreepersons/", {headers: { Authorization: `JWT ${localStorage.getItem('token')}`}})
          .then(res => this.setState({ personList: res.data }))
          .catch(err => console.log(err));
      };

      refreshRelationshipList = () => {
        axios
        .get("http://localhost:8000/api/familytreerelationship/", {headers: { Authorization: `JWT ${localStorage.getItem('token')}`}})
          .then(res => this.setState({ relationshipList: res.data }))
          .catch(err => console.log(err));
      };

      render() {
        let form;
        switch (this.state.displayed_form) {
          case 'login':
            form = <LoginForm handle_login={this.handle_login} />;
            break;
          case 'signup':
            form = <SignupForm handle_signup={this.handle_signup} />;
            break;
          default:
            form = null;
        }
        return (
          <div className="App">
            <Nav
              logged_in={this.state.logged_in}
              display_form={this.display_form}
              handle_logout={this.handle_logout}
              username={this.state.username}
            />
            {form}
            {this.state.logged_in
              ? !this.state.donePersonList ? (
                <h3>
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
                </h3>
              ) : !this.state.doneRelationshipList ? (
                <h3>
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
                </h3>
              ): (
                <React.Fragment>
                  <Familytree 
                  personList = {this.state.personList}
                  relationshipList = {this.state.relationshipList}
                  />
                  {//<Todo />
                  }
                </React.Fragment>
              )      
              : 'Please, log in.'}
          </div>
        );
      }
    }
    export default App;