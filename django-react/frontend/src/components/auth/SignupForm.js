import React from 'react';
import PropTypes from 'prop-types';
import './LoginForm.css'

class SignupForm extends React.Component {
  state = {
    username: '',
    password: ''
  };

  // handles change for any Form Field
  handle_change = e => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState(prevstate => {
      const newState = { ...prevstate };
      newState[name] = value;
      return newState;
    });
  };

  render() {
    return (
      <div className="login-dark">
        <form method="post" onSubmit={e => this.props.handle_signup(e, this.state)}>
            <h2 className="sr-only">Register Form</h2>
            <div className="illustration"><i className="far fa-user"></i></div>
            <div className="form-group">
              <input 
              className="form-control" 
              type="text" 
              name="username" 
              placeholder="Username" 
              value={this.state.username}
              onChange={this.handle_change}
              required 
              autoFocus
              />
            </div>
            <div className="form-group">
              <input 
              className="form-control" 
              type="password" 
              name="password" 
              placeholder="Password" 
              value={this.state.password}
              onChange={this.handle_change}
              required
              />
            </div>
            <div className="form-group"><button className="btn btn-primary btn-block" type="submit">Register</button></div>
          </form>
      </div>
    );
  }
}

export default SignupForm;

SignupForm.propTypes = {
  handle_signup: PropTypes.func.isRequired
};