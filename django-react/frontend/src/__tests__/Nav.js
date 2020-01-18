import React from 'react';
import { shallow } from 'enzyme';
import App from '../App';
import LoginForm from '../components/auth/LoginForm';
import Nav from '../components/nav/Nav';
import Familytree from '../Familytree';
import SignupForm from '../components/auth/SignupForm';

describe('Initial load', () => {
  it('renders without crashing', () => {
    shallow(<Nav />);
  });
  
  it('doesn\'t include Login Form at page load', () => {
    const app = shallow(<Nav />);
    expect(app.containsMatchingElement(<LoginForm />)).not.toEqual(true)
  });
  
  it('doesn\'t include App at page load', () => {
    const app = shallow(<Nav />);
    expect(app.containsMatchingElement(<App />)).not.toEqual(true)
  });
  
  it('doesn\'t include Signup Form at page load', () => {
    const app = shallow(<Nav />);
    expect(app.containsMatchingElement(<SignupForm />)).not.toEqual(true)
  });
  
  it('doesn\'t include Familytree at page load', () => {
    const app = shallow(<Nav />);
    expect(app.containsMatchingElement(<Familytree />)).not.toEqual(true)
  });
});

describe('Buttons according to state', () => {
  it('has 3 Buttons at page load', () => {
    const app = shallow(<Nav  logged_in={false}/>);
    var types = app.find('div.nav_buttons').getElement().props.children.map(el => el.type === 'button' ? el.type : undefined)
    types = types.filter(Boolean)
    expect(types).toEqual(['button', 'button', 'button'])
  });
  
  it('has 3 Buttons after login', () => {
    const app = shallow(<Nav logged_in={true}/>);
    var types = app.find('div.nav_buttons').getElement().props.children.map(el => el.type === 'button' ? el.type : undefined)
    types = types.filter(Boolean)
    expect(types).toEqual(['button', 'button', 'button'])
  });
});