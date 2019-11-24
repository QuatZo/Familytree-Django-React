import React from 'react';
import PropTypes from 'prop-types';
import './LoginForm.css'

class LoginForm extends React.Component {
  state = {
    username: '',
    password: ''
  };

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
      <div class="login-dark">
        <form method="post" onSubmit={e => this.props.handle_login(e, this.state)}>
            <h2 class="sr-only">Login Form</h2>
            <div class="illustration"><i class="far fa-user"></i></div>
            <div class="form-group">
              <input 
              class="form-control" 
              type="text" 
              name="username" 
              placeholder="Username" 
              value={this.state.username}
              onChange={this.handle_change}
              required 
              autoFocus
              />
            </div>
            <div class="form-group">
              <input 
              class="form-control" 
              type="password" 
              name="password" 
              placeholder="Password" 
              value={this.state.password}
              onChange={this.handle_change}
              required
              />
            </div>
            <div class="form-group"><button class="btn btn-primary btn-block" type="submit">Log In</button></div>
          </form>
      </div>
    );
  }
}

export default LoginForm;

LoginForm.propTypes = {
  handle_login: PropTypes.func.isRequired
};