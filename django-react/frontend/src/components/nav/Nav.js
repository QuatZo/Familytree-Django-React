/*eslint jsx-a11y/anchor-is-valid: 0*/

import React from 'react';

// returns nav bar, depending on login state
function Nav(props) {
  const logged_out_nav = (
    <div className="nav_buttons">
      <button onClick={() => props.display_form('login')} className="btn btn-outline-success my-2 my-sm-0 nav_button">Login</button>
      <button onClick={() => props.display_form('signup')} className="btn btn-outline-info my-2 my-sm-0  nav_button">Register</button>
    </div>
  );

  const logged_in_nav = (
    <React.Fragment>
      <a className="navbar-brand" href="#"> | {props.username} | </a>
        <button onClick={props.handle_logout} className="btn btn-outline-danger my-2 my-sm-0">Logout</button>
    </React.Fragment>
  );
  return (
    <nav className="navbar sticky-top navbar-dark bg-dark" id="nav">
      <a className="navbar-brand" href="#">Familytree</a>
      {props.logged_in ? logged_in_nav : logged_out_nav}
    </nav>
      
  );
}

export default Nav;