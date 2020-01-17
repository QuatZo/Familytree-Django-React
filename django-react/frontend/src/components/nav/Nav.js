/*eslint jsx-a11y/anchor-is-valid: 0*/

import React, {useState} from 'react';
import './Nav.css'
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

// returns nav bar, depending on login state & theme
function Nav(props) {

  const [dropdownOpen, setOpen] = useState(false);

  const toggle = () => setOpen(!dropdownOpen);

  const colors_dark = [
    "#FFD14D",
    "#FFAD00",
    "#CF6679",
    "#BB86FC",
    "#B8FF61",
    "#637FFF",
    "#63FFF9",
    "#00FFAE",
  ]

  const colors_light = [
    "#804000",
    "#6B4900",
    "#723C47",
    "#005200",
    "#1F1F1F",
    "#5F389C",
    "#A30000",
    "#0013E9",
  ];

  function change(color=localStorage.getItem('color')){
    var colorIndex, secondColor;

    if(props.theme === "dark"){
      colorIndex = colors_dark.findIndex(clr => clr === color);
      secondColor = colors_dark[(colorIndex + 1) % colors_dark.length]
    }
    else{
      colorIndex = colors_light.findIndex(clr => clr === color);
      secondColor = colors_light[(colorIndex + 1) % colors_light.length]
    }

    document.documentElement.style.setProperty("--main-primary-" + props.theme, color)
    document.documentElement.style.setProperty("--main-secondary-" + props.theme, secondColor)
  }

  const color_picker = (
    <ButtonDropdown isOpen={dropdownOpen} toggle={toggle} className={"color-picker " + props.theme}>
      <DropdownToggle>
        <i className="fas fa-brush" />
      </DropdownToggle>
      <DropdownMenu>
        {props.theme === "dark" ? 
          (
            colors_dark.map(color => 
              <DropdownItem 
                key={color} 
                hidden={color === localStorage.getItem('color') ? true : false} 
                style={{backgroundColor: color}} 
                onClick={() => localStorage.setItem('color', color)} 
                onMouseEnter={() => change(color)}
                onMouseLeave={() => change()}
              />
            )
          ) : (
            colors_light.map(color => 
              <DropdownItem 
                key={color} 
                hidden={color === localStorage.getItem('color') ? true : false} 
                style={{backgroundColor: color}} 
                onClick={() => localStorage.setItem('color', color)}
                onMouseEnter={() => change(color)}
                onMouseLeave={() => change()}
              />
            )
          )
        }
      </DropdownMenu>
    </ButtonDropdown>
  );

  const logged_out_nav = (
    <div className="nav_buttons">
      {color_picker}
      <button onClick={props.changeThemeMode} className={"btn my-2 my-sm-0 nav_button " + props.theme}><i className={props.theme === "dark" ? "fas fa-sun" : "fa fa-moon"} /></button>
      <button onClick={() => props.display_form('signup')} className={"btn my-2 my-sm-0 nav_button " + props.theme}><i className="fas fa-user-plus"></i></button>
      <button onClick={() => props.display_form('login')} className={"btn my-2 my-sm-0 nav_button " + props.theme}><i className="fas fa-sign-in-alt"></i></button>
    </div>
  );

  const logged_in_nav = (

    <div className="nav_buttons">
      <button onClick={() => "#"} className={"btn my-2 my-sm-0 nav_button " + props.theme}><span className="username">{props.username}&nbsp;</span> <i className="far fa-user"></i></button>
      {color_picker}
      <button onClick={props.changeThemeMode} className={"btn my-2 my-sm-0 nav_button " + props.theme}><i className={props.theme === "dark" ? "fas fa-sun" : "fa fa-moon"} /></button>
      <button onClick={() => props.handle_logout('logout')} className={"btn my-2 my-sm-0 nav_button " + props.theme}><i className="fas fa-sign-out-alt"></i></button>
    </div>
  );


  return (
    <nav className={"navbar sticky-top navbar-" + props.theme} id="nav">
      <div className={"logo " + props.theme}>
        <div className="logo-img" />
        <a id="name" className="navbar-brand" href="#">Familytree</a>
      </div>
      {props.logged_in ? logged_in_nav : logged_out_nav}
    </nav>
      
  );

}

export default Nav;