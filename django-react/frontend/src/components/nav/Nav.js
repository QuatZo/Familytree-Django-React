/*eslint jsx-a11y/anchor-is-valid: 0*/
/*eslint array-callback-return: 0*/

import React, {useState} from 'react';
import './Nav.css'
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { NOTIFY } from '../Enums.ts'
import ShowNotification from '../notification/Notification'

// returns nav bar, depending on login state & theme
function Nav(props) {

  const [dropdownOpen, setOpen] = useState(false);

  const toggle = () => setOpen(!dropdownOpen);

  const colors_dark = [
    // [ primary, hover ]
    ["#FFD14D", "#FEBA04"],
    ["#FFAD00", "#B97E00"],
    ["#CF6679", "#B75463"],
    ["#BB86FC", "#994AF1"],
    ["#B8FF61", "#9BF900"],
    ["#637FFF", "#0045EF"],
    ["#63FFF9", "#00F7F7"],
    ["#00FFAE", "#00F586"],
  ]

  const colors_light = [
    // [ primary, hover ]
    ["#804000", "#95BA23"],
    ["#6B4900", "#755305"],
    ["#723C47", "#834852"],
    ["#005200", "#29811F"],
    ["#1F1F1F", "#393939"],
    ["#5F389C", "#7C59AF"],
    ["#A30000", "#BF1C16"],
    ["#0013E9", "#361DF1"],
  ];

  function getColors(color){
    var colorIndex, colorHover, secondColor, secondColorHover;

    if(props.theme === "dark"){
      colorIndex = colors_dark.findIndex(clr => clr[0] === color);
      secondColor = colors_dark[(colorIndex + 5) % colors_dark.length][0]
      secondColorHover = colors_dark[(colorIndex + 5) % colors_dark.length][1]
      colorHover = colors_dark[colorIndex][1]
    }
    else{
      colorIndex = colors_light.findIndex(clr => clr[0] === color);
      secondColor = colors_light[(colorIndex + colors_light.length - 1) % colors_light.length][0]
      secondColorHover = colors_light[(colorIndex + colors_light.length - 1) % colors_light.length][1]
      colorHover = colors_light[colorIndex][1]
    }

    return { colorHover, secondColor, secondColorHover }
  }

  function changeColor(color){
    const { colorHover, secondColor, secondColorHover } = getColors(color)
    const cssStyles = [
      ['--main-primary-' + props.theme, color],
      ['--main-primary-hover-' + props.theme, colorHover],
      ['--main-secondary-' + props.theme, secondColor],
      ['--main-secondary-hover-' + props.theme, secondColorHover],
    ];

    cssStyles.map(item => {
      localStorage.setItem(item[0], item[1])
    })

    ShowNotification(NOTIFY.CHANGE_COLOR, props.theme);
  } 

  function previewColor(color = undefined){
    color = color ?? localStorage.getItem("--main-primary-" + props.theme);
    const { colorHover, secondColor, secondColorHover } = getColors(color)

    document.documentElement.style.setProperty("--main-primary-" + props.theme, color)
    document.documentElement.style.setProperty("--main-primary-hover-" + props.theme, colorHover)
    document.documentElement.style.setProperty("--main-secondary-" + props.theme, secondColor)
    document.documentElement.style.setProperty("--main-secondary-hover-" + props.theme, secondColorHover)
  }

  const color_picker = (
    <ButtonDropdown isOpen={dropdownOpen} toggle={toggle} className={"color-picker " + props.theme}>
      <DropdownToggle>
        <i className="fas fa-brush" />
      </DropdownToggle>
      <DropdownMenu onMouseLeave={() => previewColor()}>
        {props.theme === "dark" ? 
          (
            colors_dark.map(color => 
              <DropdownItem 
                key={color[0]} 
                hidden={color[0] === localStorage.getItem('--main-primary-dark') ? true : false} 
                style={{backgroundColor: color[0]}} 
                onClick={() => changeColor(color[0])} 
                onMouseEnter={() => previewColor(color[0])}
              />
            )
          ) : (
            colors_light.map(color => 
              <DropdownItem 
                key={color[0]} 
                hidden={color[0] === localStorage.getItem('--main-primary-light') ? true : false} 
                style={{backgroundColor: color[0]}} 
                onClick={() => changeColor(color[0])}
                onMouseEnter={() => previewColor(color[0])}
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
      <button onClick={props.changeShowButtons} className={"btn my-2 my-sm-0 nav_button " + props.theme}><i className={props.showButtons ? "fas fa-eye-slash" : "fa fa-eye"} /></button>
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