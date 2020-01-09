/*eslint jsx-a11y/anchor-is-valid: 0*/

import React from 'react';
import PropTypes from 'prop-types';

// returns nav bar, depending on login state
function Nav(props) {
  const logged_out_nav = (
    <div className="nav_buttons">
      <button onClick={props.changeThemeMode} className="btn btn-outline-secondary my-2 my-sm-0 nav_button">{(props.theme === "dark" ? "Light" : "Dark") + " Theme"}</button>
      <button onClick={() => props.display_form('login')} className="btn btn-outline-success my-2 my-sm-0 nav_button">Login</button>
      <button onClick={() => props.display_form('signup')} className="btn btn-outline-info my-2 my-sm-0  nav_button">Register</button>
    </div>
  );

  const logged_in_nav = (

    <div className="nav_buttons">
      <button onClick={() => "#"} className="btn btn-secondary my-2 my-sm-0 disabled nav_button">User: {props.username}</button>
      <button onClick={props.changeThemeMode} className="btn btn-outline-secondary my-2 my-sm-0 nav_button">{(props.theme === "dark" ? "Light" : "Dark") + " Theme"}</button>
      <button onClick={() => props.handle_logout('logout')} className="btn btn-outline-danger my-2 my-sm-0 nav_button">Logout</button>
    </div>
  );


  return (
  
    <nav className={"navbar sticky-top navbar-"+props.theme+" bg-"+props.theme} id="nav">
      <a className="navbar-brand" href="#">Familytree</a>
      {props.logged_in ? logged_in_nav : logged_out_nav}
    </nav>
      
  );

}

export default Nav;

Nav.propTypes = {
  logged_in: PropTypes.bool.isRequired,
  display_form: PropTypes.func.isRequired,
  handle_logout: PropTypes.func.isRequired,
  theme: PropTypes.string.isRequired,
  changeThemeMode: PropTypes.func.isRequired
};