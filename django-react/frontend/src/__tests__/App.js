import React from 'react';
import { shallow } from 'enzyme';
import App from '../App';
import LoginForm from '../components/auth/LoginForm';
import Nav from '../components/nav/Nav';
import Familytree from '../Familytree';

it('renders without crashing', () => {
  shallow(<App />);
});

it('includes nav bar', () => {
  const app = shallow(<App />);
  expect(app.containsMatchingElement(<Nav />)).toEqual(true)
});

it('includes Login Form', () => {
  const app = shallow(<App />);
  expect(app.containsMatchingElement(<LoginForm />)).toEqual(true)
});

it('doesn\'t include Familytree', () => {
  const app = shallow(<App />);
  expect(app.containsMatchingElement(<Familytree />)).not.toEqual(true)
});