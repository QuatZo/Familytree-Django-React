import React from 'react';
import { shallow } from 'enzyme';
import App from '../App';
import LoginForm from '../components/auth/LoginForm';
import Nav from '../components/nav/Nav';
import Familytree from '../Familytree';
import SignupForm from '../components/auth/SignupForm';

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

it('has 2 Buttons at page load', () => {
  const app = shallow(<Nav />);
  var types = app.find('div.nav_buttons').getElement().props.children.map(el => el.type)
  types = types.filter(Boolean)
  expect(types).toEqual(['button', 'button'])
});

it('has 1 Button & Username after login', () => {
  const app = shallow(<Nav />);
  const USERNAME = 'QuatZo'
  app.setProps({
    logged_in: true,
    username: USERNAME
  })
  expect(app.find('button').getElement().type).toEqual('button')
  expect(app.find('a.navbar-brand').get(1).props.children).toEqual([' | ', USERNAME, ' | '])
});