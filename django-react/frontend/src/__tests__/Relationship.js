import React from 'react';
import { shallow } from 'enzyme';
import App from '../App';
import LoginForm from '../components/auth/LoginForm';
import Nav from '../components/nav/Nav';
import Familytree from '../Familytree';
import SignupForm from '../components/auth/SignupForm';
import Person from '../components/person/Person'
import Relationship from '../components/relationship/Relationship';

const RELATIONSHIP_DATA = {
  "id": 2137,
  "color": "#abcdef",
  "title": "[Test] Relationship data",
  "description": "Relationship test data, this is the description so it needs to be long, right?",
  "begin_date": "2020-01-11",
  "end_date": "2020-01-11",
  "descendant": true,
  "relationships": "stepdaughter",
  "user_id": 2137,
  "id_1": 2137,
  "id_2": 2137,
}

const PERSON_SIZE = {
  width: 150, 
  height: 150,
}

const PERSON_COORDINATES = [
  {
    id: 2137, 
    screen: {
      x: 2137, 
      y: 2137,
    },
  },
  {
    id: 2137, 
    screen: {
      x: 2137, 
      y: 2137,
    },
  },
]

describe('Initial load', () => {
  it('renders without crashing', () => {
    shallow(<Relationship relationship={RELATIONSHIP_DATA} personClassCoordinates={PERSON_COORDINATES} personSize={PERSON_SIZE}/>);
  });
  
  it('doesn\'t include nav bar at page load', () => {
    const app = shallow(<Relationship relationship={RELATIONSHIP_DATA} personClassCoordinates={PERSON_COORDINATES} personSize={PERSON_SIZE}/>);
    expect(app.containsMatchingElement(<Nav />)).not.toEqual(true)
  });
  
  it('doesn\'t include Login Form at page load', () => {
    const app = shallow(<Relationship relationship={RELATIONSHIP_DATA} personClassCoordinates={PERSON_COORDINATES} personSize={PERSON_SIZE}/>);
    expect(app.containsMatchingElement(<LoginForm />)).not.toEqual(true)
  });
  
  it('doesn\'t include Signup Form at page load', () => {
    const app = shallow(<Relationship relationship={RELATIONSHIP_DATA} personClassCoordinates={PERSON_COORDINATES} personSize={PERSON_SIZE}/>);
    expect(app.containsMatchingElement(<SignupForm />)).not.toEqual(true)
  });
  
  it('doesn\'t include Familytree at page load', () => {
    const app = shallow(<Relationship relationship={RELATIONSHIP_DATA} personClassCoordinates={PERSON_COORDINATES} personSize={PERSON_SIZE}/>);
    expect(app.containsMatchingElement(<Familytree />)).not.toEqual(true)
  });
  
  it('doesn\'t include App at page load', () => {
    const app = shallow(<Relationship relationship={RELATIONSHIP_DATA} personClassCoordinates={PERSON_COORDINATES} personSize={PERSON_SIZE}/>);
    expect(app.containsMatchingElement(<App />)).not.toEqual(true)
  });
  
  it('doesn\'t include Person at page load', () => {
    const app = shallow(<Relationship relationship={RELATIONSHIP_DATA} personClassCoordinates={PERSON_COORDINATES} personSize={PERSON_SIZE}/>);
    expect(app.containsMatchingElement(<Person />)).not.toEqual(true)
  });  
});