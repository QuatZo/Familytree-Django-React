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
    import { ToastContainer} from 'react-toastify';
    import NOTIFY from './Enums.ts';
    import ShowNotification from './components/Notification';
    import CustomModal from "./components/PersonModal";
    
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
          username: '',
          backgroundColor: '#262626'
        };
      }

      loginCounter = 0;

      

      componentDidMount() {
        if (this.state.logged_in) {
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
          setTimeout(() => {
            axios
              .get("http://localhost:8000/api/familytreepersons/", {
                headers: { Authorization: `JWT ${localStorage.getItem('token')}`}
              })
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
          .get("http://localhost:8000/api/familytreerelationship/", {
            headers: { Authorization: `JWT ${localStorage.getItem('token')}`}
          })
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
            localStorage.setItem('user_id', res.data.user.id);
            this.setState({
              logged_in: true,
              displayed_form: '',
              username: res.data.user.username,
            }, () => ShowNotification(NOTIFY.SUCCESS_LOGIN));
          })
          .catch(() => ShowNotification(NOTIFY.ERROR_LOGIN));
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
            this.setState({
              logged_in: false,
              displayed_form: 'login',
              username: res.data.username
            }, () => ShowNotification(NOTIFY.SUCCESS_REGISTER));
          })
          .catch(() => ShowNotification(NOTIFY.ERROR_LOGIN));
      };
    
      handle_logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user_id');
        this.loginCounter = 0;
        this.setState({ 
          logged_in: false, 
          username: '',
          personList: [],
          relationshipList: [],
          relationships: [],
          loadingPersonList: undefined,
          donePersonList: undefined,
          displayed_form: 'login',
          loadingRelationshipList: undefined,
          doneRelationshipList: undefined,
        }, () => ShowNotification(NOTIFY.SUCCESS_LOGOUT));
      };
    
      display_form = form => {
        this.setState({
          displayed_form: form
        });
      };

      refreshPersonList = () => {
        axios
          .get("http://localhost:8000/api/familytreepersons/", {
            headers: { Authorization: `JWT ${localStorage.getItem('token')}`}
          })
          .then(res => this.setState({ personList: res.data }))
          .then(() => console.log(this.state.user_id))
          .catch(err => ShowNotification(NOTIFY.ERROR));
      };

      refreshRelationshipList = () => {
        axios
        .get("http://localhost:8000/api/familytreerelationship/", {
          headers: { Authorization: `JWT ${localStorage.getItem('token')}`}
        })
          .then(res => this.setState({ relationshipList: res.data }))
          .catch(err => ShowNotification(NOTIFY.ERROR));
      };

      render() {
        var them ="bg-dark";
        let form;
        switch (this.state.displayed_form) {
          case 'login':
            form = <LoginForm handle_login={this.handle_login} theme={this.state.theme}/>;
            break;
          case 'signup':
            form = <SignupForm handle_signup={this.handle_signup} theme={this.state.theme} />;
            break;
          default:
            form = null;
        }
        let modal;
        modal = <CustomModal theme={this.state.theme}/>;
        
        const toggleBackgroundColorHandler = () => {
          const body = document.querySelector('body');
          const navigation = document.querySelector('nav');
          const formElement = document.querySelector('form');
          const changeColorButton = document.querySelector('#changeColorButton');
          
const currentColor = this.state.backgroundColor;
          let newColor;
         // #343a40
          if (currentColor === '#262626') {
            newColor = '#cbd1d1';
            them ="bg-light text-dark";
            navigation.classList.remove('bg-dark');
            navigation.classList.remove('navbar-dark');
            navigation.classList.add('bg-light');
            navigation.classList.add('navbar-light');
            /*button.classList.add('btn-danger');
            button.classList.remove('btn-outline-danger');
            if(formElement){
              formElement.classList.add('bg-light');
              formElement.classList.remove('bg-dark');
            }*/
            changeColorButton.classList.add('btn-outline-dark');
            changeColorButton.classList.remove('btn-outline-light');
          } else {
            newColor = '#262626';
            them ="bg-dark";
            navigation.classList.add('bg-dark');
            navigation.classList.add('navbar-dark');
            navigation.classList.remove('bg-light');
            navigation.classList.remove('navbar-light');
            /*button.classList.remove('btn-danger');
            button.classList.add('btn-outline-danger');
           if(formElement){
              formElement.classList.remove('bg-light')
              formElement.classList.add('bg-dark');
            }*/
            changeColorButton.classList.remove('btn-outline-dark');
            changeColorButton.classList.add('btn-outline-light');
          }
          body.style.backgroundColor = newColor;
          this.setState({
            ...this.state,
            backgroundColor: newColor,
            theme: them
          });
        }

        return (

          <div className="App">
            <Nav
              logged_in={this.state.logged_in}
              display_form={this.display_form}
              handle_logout={this.handle_logout}
              username={this.state.username}
            >
          <button id="changeColorButton" className="btn btn-outline-light btn-xl change-color-button nav_button" onClick={toggleBackgroundColorHandler}>
            {this.state.backgroundColor === '#262626' ? "Light theme" : "Dark theme"}
          </button>
            </Nav>

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
              <ToastContainer />
          </div>
        );
      }
    }
    export default App;