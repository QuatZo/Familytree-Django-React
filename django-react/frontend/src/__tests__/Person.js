import React from 'react';
import { shallow } from 'enzyme';
import App from '../App';
import LoginForm from '../components/auth/LoginForm';
import Nav from '../components/nav/Nav';
import Familytree from '../Familytree';
import SignupForm from '../components/auth/SignupForm';
import Person from '../components/person/Person'
import Relationship from '../components/relationship/Relationship';

const PERSON_DATA = {
  "id": 2137,
  "first_name": "Quat",
  "last_name": "Zo",
  "birth_date": "1000-01-01",
  "birth_place": "Earth",
  "avatar": "http://localhost:8000/media/avatars/somesha256encryptedname.png",
  "status_choices": "living",
  "sex_choices": "other",
  "x": 0.2,
  "y": 0.7,
  "user_id": 2137,
}

describe('Initial load', () => {
  it('renders without crashing', () => {
    shallow(<Person person={PERSON_DATA} activePersons={[]}/>);
  });
  
  it('doesn\'t include nav bar at page load', () => {
    const app = shallow(<Person person={PERSON_DATA} activePersons={[]}/>);
    expect(app.containsMatchingElement(<Nav />)).not.toEqual(true)
  });
  
  it('doesn\'t include Login Form at page load', () => {
    const app = shallow(<Person person={PERSON_DATA} activePersons={[]}/>);
    expect(app.containsMatchingElement(<LoginForm />)).not.toEqual(true)
  });
  
  it('doesn\'t include Signup Form at page load', () => {
    const app = shallow(<Person person={PERSON_DATA} activePersons={[]}/>);
    expect(app.containsMatchingElement(<SignupForm />)).not.toEqual(true)
  });
  
  it('doesn\'t include Familytree at page load', () => {
    const app = shallow(<Person person={PERSON_DATA} activePersons={[]}/>);
    expect(app.containsMatchingElement(<Familytree />)).not.toEqual(true)
  });
  
  it('doesn\'t include App at page load', () => {
    const app = shallow(<Person person={PERSON_DATA} activePersons={[]}/>);
    expect(app.containsMatchingElement(<App />)).not.toEqual(true)
  });
  
  it('doesn\'t include Relationship at page load', () => {
    const app = shallow(<Person person={PERSON_DATA} activePersons={[]}/>);
    expect(app.containsMatchingElement(<Relationship />)).not.toEqual(true)
  });
});

describe('Child components', () => {
  it('has image', () => {
    const app = shallow(<Person person={PERSON_DATA} activePersons={[]}/>);
    expect(app.find('img').getElements()).toHaveLength(1)
  });
  
  it('has proper image', () => {
    const app = shallow(<Person person={PERSON_DATA} activePersons={[]}/>);
    expect(app.find('img').getElement().props.src).toEqual(PERSON_DATA.avatar)
  });
  
  it('has 2 Buttons', () => {
    const app = shallow(<Person person={PERSON_DATA} activePersons={[]}/>);
    expect(app.find('button').getElements()).toHaveLength(2)
  });
  
  it('has proper first & last name', () => {
    const app = shallow(<Person person={PERSON_DATA} activePersons={[]}/>);
    expect(app.find('div.name').getElement().props.children).toEqual(PERSON_DATA.first_name + ' ' + PERSON_DATA.last_name)
  });
});