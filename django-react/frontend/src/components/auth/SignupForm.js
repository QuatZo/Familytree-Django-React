import React from 'react';
import PropTypes from 'prop-types';
import './LoginForm.css'

class SignupForm extends React.Component {
  state = {
    username: "username",
    password: "Password",
    touched: {
      username: false,
      password: false,
    },
  };

  // handles change for any Form Field
  handle_change = e => {
    let { name, value } = e.target;
    if (name === "username")
      value = value.toLowerCase()
    this.setState({ [name]: value });
  };

  // error handling, validates given form fields
  validate(username, password){
    return{
      username: username.trim().length === 0,
      password: password.trim().length === 0 || !(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){8,}$/.test(password)),
      password_number_false: password.trim().length === 0 || !(/^(?=.*\d)$/.test(password)),
      password_number_true: password.trim().length  === 0 || (/^(?=.*\d)$/.test(password)),
    }
  }

  // error handling
  handleBlur = (field) => (evt) => {
    this.setState({
      touched: { ...this.state.touched, [field]: true },
    });
  }

  render() {
    const errors = this.validate(this.state.username, this.state.password);
    const isEnabled = !Object.keys(errors).some(x => errors[x]); // button is disabled as long as error exists
    return (
      <div class="login-dark">
        <form method="post" onSubmit={e => this.props.handle_signup(e, this.state)}>
            <h2 class="sr-only">Register Form</h2>
            <div class="illustration"><i class="far fa-user"></i></div>
            <div class="form-group">
              <input 
              className={"form-control" + (errors.username?" error":"")}
              type="text" 
              name="username" 
              placeholder="Username" 
              onBlur={this.handleBlur('username')}
              value={this.state.username}
              onChange={this.handle_change}
              required 
              autoFocus
              />
            </div>
            <div class="form-group">
              <input 
              className={"form-control" + (errors.password || errors.password_number_false || errors.password_number_true)?" error":""}
              type="password" 
              name="password" 
              placeholder="Password"
              onBlur={this.handleBlur('password')}
              value={this.state.password}
              onChange={this.handle_change}
              required
              />
              {errors.password_number_false?(<small className='errortext'>1 number (0-9)</small>):null}
              {errors.password_number_true?(<small className='errortext_true'>1 number (0-9)</small>):null}
            </div>
            <div class="form-group password-req">
              <ul>
                Password must contain:
                <li> 1 number (0-9) </li>
                <li> 1 uppercase letters </li>
                <li> 1 lowercase letters </li>
                <li> 1 non-alpha numeric number </li>
                <li> at least 8 characters with no space </li>
              </ul>
            </div>
            <div class="form-group"><button disabled={!isEnabled} class="btn btn-primary btn-block" type="submit">Register</button></div>
          </form>
      </div>
    );
  }
}

export default SignupForm;

SignupForm.propTypes = {
  handle_signup: PropTypes.func.isRequired
};