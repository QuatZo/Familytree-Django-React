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
      <div className="container">
        <div className="row">
          <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
            <div className="card card-signin my-5">
              <div className="card-body">
                <h5 className="card-title text-center">Welcome back!</h5>
                <form className="form-signin" onSubmit={e => this.props.handle_login(e, this.state)}>
                  <div className="form-label-group">
                    <input 
                    className="form-control" 
                    type="text"
                    id="username"
                    name="username"
                    value={this.state.username}
                    onChange={this.handle_change}
                    required 
                    autoFocus
                    />
                    <label htmlFor="username">Your login</label>
                  </div>

                  <div className="form-label-group">
                    <input className="form-control" 
                    type="password"
                    name="password"
                    id="password"
                    value={this.state.password}
                    onChange={this.handle_change}
                    required
                    />
                    <label htmlFor="password">Your password</label>
                  </div>
                  <button className="btn btn-lg btn-primary btn-block text-uppercase" type="submit">Sign in</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default LoginForm;

LoginForm.propTypes = {
  handle_login: PropTypes.func.isRequired
};