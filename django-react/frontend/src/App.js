// frontend/src/App.js

    import React, { Component } from "react";
    import './App.css';
    import './components/loading/Loading.css'
    import Nav from './components/nav/Nav';
    import LoginForm from './components/auth/LoginForm';
    import SignupForm from './components/auth/SignupForm';
    import Familytree from "./Familytree";
    import axios from "axios";
    import FadeIn from "react-fade-in";
    import Lottie from "react-lottie";
    import * as stillLoadingData from "./components/loading/stillloading.json";
    import * as doneLoadingData from "./components/loading/doneloading.json";
    import { ToastContainer, toast} from 'react-toastify';
    import {NOTIFY} from './components/Enums.ts';
    import ShowNotification from './components/notification/Notification';

    
    // options for animation, when API is loading
    const defaultOptionsLoading = {
        loop: true,
        autoplay: true,
        animationData: stillLoadingData.default,
        rendererSettings: {
          preserveAspectRatio: "xMidYMid meet"
        }
      }

    // options for animation, when API has been loaded
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
          personList: [], // list of persons
          relationshipList: [], // list of relationships
          loadingPersonList: undefined, // flag, if it's still loading personList
          donePersonList: undefined, // flag, if it already loaded personList
          loadingRelationshipList: undefined, // flag, if it's still loading relationshipList
          doneRelationshipList: undefined, // flag, if it already loaded relationshipList
          displayed_form: localStorage.getItem('token') ? '' : 'login', // form to display
          logged_in: localStorage.getItem('token') ? true : false, // flag, if user is already logged in
          username: '',
          theme: localStorage.getItem('theme') ?? 'dark',
        };
      }

      loginCounter = 0; // it makes sure noone will log into 2 different accounts from one browser (probably simple flag should be enough)

      componentDidMount() {
        var theme = localStorage.getItem('theme') ?? 'dark';
        if(!localStorage.getItem('color')){
          if(theme === "dark"){ localStorage.setItem('color', '#FFAD00'); }
          else { localStorage.setItem('color', '#005200'); }
        }
        document.documentElement.style.setProperty("--main-primary-" + theme, localStorage.getItem('color'))

        if (this.state.logged_in) { // if person is logged in, dont force user to relog
          axios
            .get('http://localhost:8000/current_user/', {
              headers: { Authorization: `JWT ${localStorage.getItem('token')}`},
            })
            .then(res => {
              this.setState({ username: res.data.username }, () => ShowNotification(NOTIFY.SUCCESS_LOGIN));
            })
            .catch(() => {
              ShowNotification(NOTIFY.ERROR_TIMEOUT)
              this.handle_logout();
            })
          }
      }

      componentDidUpdate(){
        if (this.loginCounter < 1 && this.state.logged_in && !this.state.doneRelationshipList && !this.state.donePersonList){
          this.loginCounter += 1;
          
          this.fetchPersonList();
          this.fetchRelationshipList();
        }
      }

      // get list of Persons from API, while loading page
      fetchPersonList = () => {
        setTimeout(() => {
          axios
            .get("http://localhost:8000/api/familytreepersons/", {
              headers: { Authorization: `JWT ${localStorage.getItem('token')}`}
            })
            .then(res => this.setState({ personList: res.data }))
            .then(() => {
                this.setState({ loadingPersonList: true });
                setTimeout(() => {
                  this.setState({ donePersonList: true });
              }, 1000); // miliseconds AFTER Person List loading is done (1s)
            });
        }, 1800); // miliseconds AFTER Person List loading should be called (1.8s)
      }

      // get list of Relationships from API, while loading page
      fetchRelationshipList = () => {
        setTimeout(() => {
        axios
          .get("http://localhost:8000/api/familytreerelationship/", {
            headers: { Authorization: `JWT ${localStorage.getItem('token')}`}
          })
          .then(res => this.setState({ relationshipList: res.data }))
          .then(() => {
            this.setState({ loadingRelationshipList: true });
            setTimeout(() => {
                this.setState({ doneRelationshipList: true });   
            }, 1000); // miliseconds AFTER Relationship List loading is done (1s)
          });
        }, 1000); // miliseconds AFTER Person List loading should be called (1s)
      }

      // check in API, if provided credentials are correct
      handle_login = (e, data) => {
        e.preventDefault();
        axios.post('http://localhost:8000/token-auth/', data, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
          .then(res => {
            localStorage.setItem('token', res.data.token); // store user's login token
            localStorage.setItem('user_id', res.data.user.id); // store user's id
            localStorage.setItem('date_joined', res.data.user.date_joined) // store user's registration date

            this.setState({
              logged_in: true,
              displayed_form: '', // familytree page
              username: res.data.user.username,
            }, () => ShowNotification(NOTIFY.SUCCESS_LOGIN));
          })
          .catch(() => ShowNotification(NOTIFY.ERROR_LOGIN));
      };
    
      // register user to website; throws error when username already exists
      handle_signup = (e, data) => {
        e.preventDefault();
        
        axios.post('http://localhost:8000/users/', data, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
          .then(res => {
            this.setState({
              logged_in: false,
              displayed_form: 'login', // redirect to login page
              username: res.data.username
            }, () => ShowNotification(NOTIFY.SUCCESS_REGISTER));
          })
          .catch(() => ShowNotification(NOTIFY.ERROR_REGISTER));
      };
    
      // log out user from website
      handle_logout = () => {
        localStorage.removeItem('token'); // remove token from local storage
        localStorage.removeItem('user_id'); // remove user's id from local storage
        localStorage.removeItem('date_joined'); // remove registration date from local storage
        this.loginCounter = 0; // let website know that no one is logged in by using this browser
        this.setState({ // reset all variables
          logged_in: false, 
          username: '',
          personList: [],
          relationshipList: [],
          relationships: [],
          loadingPersonList: undefined,
          donePersonList: undefined,
          displayed_form: 'login', // redirect to login page
          loadingRelationshipList: undefined,
          doneRelationshipList: undefined,
        }, () => ShowNotification(NOTIFY.SUCCESS_LOGOUT));
      };
    
      // display specific form (login/signup)
      display_form = form => {
        this.setState({
          displayed_form: form
        });
      };

      changeThemeMode = () => {
        var newTheme = this.state.theme === "dark" ? "light" : "dark"
        localStorage.setItem('theme', newTheme)
        this.setState({
            theme: newTheme,
          }, () => ShowNotification(NOTIFY.CHANGE_THEME)
        );
      }
      
      // render page (nav bar + login/signup form if not logged in; else Familytree.js)
      render() {
        let form;
        switch (this.state.displayed_form) {
          case 'login':
            form = <LoginForm handle_login={this.handle_login} theme={this.state.theme}/>;
            break;
          case 'signup':
            form = <SignupForm handle_signup={this.handle_signup} theme={this.state.theme}/>;
            break;
          default:
            form = null;
        }
        
        return (
          <div className={"App-"+this.state.theme}>
            <Nav
              logged_in={this.state.logged_in}
              display_form={this.display_form}
              handle_logout={this.handle_logout}
              username={this.state.username}
              theme={this.state.theme}
              changeThemeMode={this.changeThemeMode}
              />
            
            {form}
            {this.state.logged_in ? (
              !this.state.donePersonList || !this.state.doneRelationshipList ? (
                <h3>
                  <FadeIn>
                    <div className={"loading-" + this.state.theme}>
                      <div className={"loadingPart-" + this.state.theme}>
                        <h4 className={"loadingText-" + this.state.theme}>Fetching Persons</h4>
                        <div className={"loadingAnimation-" + this.state.theme}>
                          {!this.state.loadingPersonList ? (
                              <Lottie options={defaultOptionsLoading} height={100} width={200}/>
                          ) : (
                            <Lottie options={defaultOptionsLoaded} height={100} width={200}/>
                          )}
                        </div>
                      </div>
                      <div className={"loadingPart-" + this.state.theme}>
                        <h4 className={"loadingText-" + this.state.theme}>Fetching Relationships</h4>
                        <div className={"loadingAnimation-" + this.state.theme}>
                          {!this.state.loadingRelationshipList ? (
                            <Lottie options={defaultOptionsLoading} height={100} width={200}/>
                          ) : (
                            <Lottie options={defaultOptionsLoaded} height={100} width={200}/>
                          )}
                        </div>
                      </div>
                      
                    </div>
                  </FadeIn>
                </h3>
              ) : (
                    <React.Fragment>
                      <Familytree 
                        personList = {this.state.personList}
                        relationshipList = {this.state.relationshipList}
                        changeThemeMode = {this.changeThemeMode}
                        theme = {this.state.theme}
                      />
                    </React.Fragment>
                  )
              ) : null
            }
              <ToastContainer position={toast.POSITION.TOP_LEFT}/>
          </div>
        );         
      }
    }
    export default App;