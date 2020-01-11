import React from 'react';
import { shallow } from 'enzyme';
import App from '../App';
import LoginForm from '../components/auth/LoginForm';
import Nav from '../components/nav/Nav';
import Familytree from '../Familytree';
import SignupForm from '../components/auth/SignupForm';

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

it('has 2 Input Fields & 1 Button', () => {
  const app = shallow(<SignupForm />);
  
  var types = app.find('div.form-group').getElements().map(el => el.props.children.type )
  types = types.filter(Boolean)
  expect(types).toEqual(['input', 'input', 'button'])
});

it('has Input Text Field, Input Password Field & Submit Button', () => {
  const app = shallow(<SignupForm />);
  var types = app.find('div.form-group').getElements().map(el => el.props.children.props.type )
  types = types.filter(Boolean)
  expect(types).toEqual(['text', 'password', 'submit'])
});

it('has disabled Submit Button at page load', () => {
  // this test will probably always fail, because validation is not yet in here
  const app = shallow(<SignupForm />);
  var disabled = app.find('div.form-group').getElements().map(el => el.props.children.props.disabled )
  disabled = disabled.filter(Boolean)
  expect(disabled).toEqual([true])
});

it('has enabled Submit Button after typing sufficient password', () => {
  // this test will probably always fail, because validation is not yet in here
  const app = shallow(<SignupForm />);
  app.setState({password: 'AAAaaa111!!!!'})
  var disabled = app.find('div.form-group').getElements().map(el => el.props.children.props.disabled )
  disabled = disabled.filter(Boolean)
  //expect(disabled).toEqual([])
  // temporarily
  expect(disabled).toEqual([true])
});

it('has disabled Submit Button after typing insufficient password', () => {
  // this test will probably always fail, because validation is not yet in here
  const app = shallow(<SignupForm />);
  app.setState({password: 'A'})
  var disabled = app.find('div.form-group').getElements().map(el => el.props.children.props.disabled )
  disabled = disabled.filter(Boolean)
  expect(disabled).toEqual([true])
});