import React from 'react';
import { shallow } from 'enzyme';
import App from '../App';
import LoginForm from '../components/auth/LoginForm';
import Nav from '../components/nav/Nav';
import Familytree from '../Familytree';
import SignupForm from '../components/auth/SignupForm';

describe('Initial load', () => {
  it('renders without crashing', () => {
    shallow(<SignupForm />);
  });
  
  it('doesn\'t include nav bar at page load', () => {
    const app = shallow(<SignupForm />);
    expect(app.containsMatchingElement(<Nav />)).not.toEqual(true)
  });
  
  it('doesn\'t include App at page load', () => {
    const app = shallow(<SignupForm />);
    expect(app.containsMatchingElement(<App />)).not.toEqual(true)
  });
  
  it('doesn\'t include Login Form at page load', () => {
    const app = shallow(<SignupForm />);
    expect(app.containsMatchingElement(<LoginForm />)).not.toEqual(true)
  });
  
  it('doesn\'t include Familytree at page load', () => {
    const app = shallow(<SignupForm />);
    expect(app.containsMatchingElement(<Familytree />)).not.toEqual(true)
  });
  
  it('has 2 Input Fields, Password Requirements list & 1 Button', () => {
    const app = shallow(<SignupForm />);
    var types = app.find('div.form-group').getElements().map(el => el.props.children.type )
    types = types.filter(Boolean)
    expect(types).toEqual(['input', 'input', 'ul', 'button'])
  });
});

describe('Form validation', () =>{
  it('has Input Text Field, Input Password Field & Submit Button', () => {
    const app = shallow(<SignupForm />);
    var types = app.find('div.form-group').getElements().map(el => el.props.children.props.type )
    types = types.filter(Boolean)
    expect(types).toEqual(['text', 'password', 'submit'])
  });
  
  it('has disabled Submit Button at page load', () => {
    const app = shallow(<SignupForm />);
    var disabled = app.find('div.form-group').getElements().map(el => el.props.children.props.disabled )
    disabled = disabled.filter(Boolean)
    expect(disabled).toEqual([true])
  });
  
  it('has no error subclass for password field after typing sufficient password', () => {
    const app = shallow(<SignupForm />);
    app.find('input[type="password"]').simulate('change', {target: {name: 'password', value: '$Uff1c13nt'}})
    expect(app.find('input[type="password"]').getElement().props.className.split(" ")).not.toContain('error')
  });
  
  it('has disabled Submit Button after typing insufficient password', () => {
    const app = shallow(<SignupForm />);
    app.find('input[type="password"]').simulate('change', {target: {name: 'password', value: 'A'}})
    expect(app.find('input[type="password"]').getElement().props.className.split(" ")).toContain('error')
  });
  
  it('has no error subclass for username field after typing anything in username field', () => {
    const app = shallow(<SignupForm />);
    app.find('input[name="username"]').simulate('change', {target: {name: 'username', value: 'A'}})
    expect(app.find('input[name="username"]').getElement().props.className.split(" ")).not.toContain('error')
  });
  
  it('has enabled Submit Button after providing sufficient information', () => {
    const app = shallow(<SignupForm />);
    app.find('input[name="username"]').simulate('change', {target: {name: 'username', value: 'A'}})
    app.find('input[type="password"]').simulate('change', {target: {name: 'password', value: '$Uff1c13nt'}})
    var disabled = app.find('div.form-group').getElements().map(el => el.props.children.props.disabled )
    disabled = disabled.filter(Boolean)
    expect(disabled).toEqual([])
  });
});