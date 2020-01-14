import React from 'react';
import { shallow } from 'enzyme';
import App from '../App';
import LoginForm from '../components/auth/LoginForm';
import Nav from '../components/nav/Nav';
import Familytree from '../Familytree';
import SignupForm from '../components/auth/SignupForm';

describe('Initial load', () => {
  it('renders without crashing', () => {
    shallow(<LoginForm />);
  });
  
  it('doesn\'t include nav bar at page load', () => {
    const app = shallow(<LoginForm />);
    expect(app.containsMatchingElement(<Nav />)).not.toEqual(true)
  });
  
  it('doesn\'t include App at page load', () => {
    const app = shallow(<LoginForm />);
    expect(app.containsMatchingElement(<App />)).not.toEqual(true)
  });
  
  it('doesn\'t include Signup Form at page load', () => {
    const app = shallow(<LoginForm />);
    expect(app.containsMatchingElement(<SignupForm />)).not.toEqual(true)
  });
  
  it('doesn\'t include Familytree at page load', () => {
    const app = shallow(<LoginForm />);
    expect(app.containsMatchingElement(<Familytree />)).not.toEqual(true)
  });
  
  it('has 2 Input Fields & 1 Button', () => {
    const app = shallow(<LoginForm />);
    var types = app.find('div.form-group').getElements().map(el => el.props.children.type )
    types = types.filter(Boolean)
    expect(types).toEqual(['input', 'input', 'button'])
  });
  
  it('has Input Text Field, Input Password Field & Submit Button', () => {
    const app = shallow(<LoginForm />);
    var types = app.find('div.form-group').getElements().map(el => el.props.children.props.type )
    types = types.filter(Boolean)
    expect(types).toEqual(['text', 'password', 'submit'])
  });
});