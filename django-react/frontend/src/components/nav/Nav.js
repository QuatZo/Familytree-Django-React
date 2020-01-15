/*eslint jsx-a11y/anchor-is-valid: 0*/

import React from 'react';
import './Nav.css'

// returns nav bar, depending on login state & theme
function Nav(props) {
  const logged_out_nav = (
    <div className="nav_buttons">
      <button onClick={props.changeThemeMode} className={"btn my-2 my-sm-0 nav_button " + props.theme}><i className={props.theme === "dark" ? "fas fa-sun" : "fa fa-moon"} /></button>
      <button onClick={() => props.display_form('signup')} className={"btn my-2 my-sm-0 nav_button " + props.theme}><i className="fas fa-user-plus"></i></button>
      <button onClick={() => props.display_form('login')} className={"btn my-2 my-sm-0 nav_button " + props.theme}><i className="fas fa-sign-in-alt"></i></button>
    </div>
  );

  const logged_in_nav = (

    <div className="nav_buttons">
      <button onClick={() => "#"} className={"btn my-2 my-sm-0 nav_button " + props.theme}><span className="username">{props.username}&nbsp;</span> <i className="far fa-user"></i></button>
      <button onClick={props.changeThemeMode} className={"btn my-2 my-sm-0 nav_button " + props.theme}><i className={props.theme === "dark" ? "fas fa-sun" : "fa fa-moon"} /></button>
      <button onClick={() => props.handle_logout('logout')} className={"btn my-2 my-sm-0 nav_button " + props.theme}><i className="fas fa-sign-out-alt"></i></button>
    </div>
  );


  return (
  
    <nav className={"navbar sticky-top navbar-" + props.theme} id="nav">
      <a className="navbar-brand" href="#">Familytree</a>
      {props.logged_in ? logged_in_nav : logged_out_nav}
    </nav>
      
  );

}

export default Nav;