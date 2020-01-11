import React from 'react';
import { shallow } from 'enzyme';
import App from '../App';
import LoginForm from '../components/auth/LoginForm';
import Nav from '../components/nav/Nav';
import Familytree from '../Familytree';
import SignupForm from '../components/auth/SignupForm';
import Person from '../components/person/Person';
import Relationship from '../components/relationship/Relationship';

it('renders without crashing', () => {
  shallow(<Familytree personList={[]} relationshipList={[]}/>);
});

it('doesn\'t include nav bar at page load', () => {
  const app = shallow(<Familytree personList={[]} relationshipList={[]} />);
  expect(app.containsMatchingElement(<Nav />)).not.toEqual(true)
});

it('doesn\'t include Login Form at page load', () => {
  const app = shallow(<Familytree personList={[]} relationshipList={[]}/>);
  expect(app.containsMatchingElement(<LoginForm />)).not.toEqual(true)
});

it('doesn\'t include Signup Form at page load', () => {
  const app = shallow(<Familytree personList={[]} relationshipList={[]}/>);
  expect(app.containsMatchingElement(<SignupForm />)).not.toEqual(true)
});

it('doesn\'t include App at page load', () => {
  const app = shallow(<Familytree personList={[]} relationshipList={[]}/>);
  expect(app.containsMatchingElement(<App />)).not.toEqual(true)
});

it('doesn\'t include Person on newly created account at page load', () => {
  const app = shallow(<Familytree personList={[]} relationshipList={[]}/>);
  expect(app.containsMatchingElement(<Person />)).not.toEqual(true)
});

it('doesn\'t include Relationship on newly created account at page load', () => {
  const app = shallow(<Familytree personList={[]} relationshipList={[]}/>);
  expect(app.containsMatchingElement(<Relationship />)).not.toEqual(true)
});

it('has 5 Buttons', () => {
  const app = shallow(<Familytree personList={[]} relationshipList={[]}/>);
  var download = app.find('div.download-buttons').getElements().map(el => el.props.children.type)
  var operating = app.find('div.operating-buttons').getElements().map(gr => gr.props.children.map(el => el.type))
  var types = download.concat(operating[0])
  types = types.filter(Boolean)
  expect(types).toEqual(['button', 'button', 'button', 'button', 'button'])
});