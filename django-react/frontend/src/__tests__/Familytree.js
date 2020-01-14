import React from 'react';
import { shallow } from 'enzyme';
import App from '../App';
import LoginForm from '../components/auth/LoginForm';
import Nav from '../components/nav/Nav';
import Familytree from '../Familytree';
import SignupForm from '../components/auth/SignupForm';
import Person from '../components/person/Person';
import Relationship from '../components/relationship/Relationship';

const PERSON_DATA = [
  {
    "id": 2137,
    "first_name": "Quat",
    "last_name": "Zo",
    "birth_date": "1000-01-01",
    "birth_place": "Earth",
    "avatar": "/media/avatars/somesha256filename.png",
    "status_choices": "living",
    "sex_choices": "other",
    "x": 0.2,
    "y": 0.7,
    "user_id": 2137,
  },
]

const MULTIPLE_PERSON_DATA = [
  {
    "id": 2137,
    "first_name": "Quat",
    "last_name": "Zo",
    "birth_date": "1000-01-01",
    "birth_place": "Earth",
    "avatar": "/media/avatars/somesha256filename.png",
    "status_choices": "living",
    "sex_choices": "other",
    "x": 0.2,
    "y": 0.7,
    "user_id": 2137,
  },
  {
    "id": 21372137,
    "first_name": "Zo",
    "last_name": "Quat",
    "birth_date": "2000-02-02",
    "birth_place": "Mars",
    "avatar": "/media/avatars/anothersha256filename.png",
    "status_choices": "deceased",
    "sex_choices": "male",
    "x": 0.5,
    "y": 0.1,
    "user_id": 2137,
  },
]

const RELATIONSHIP_DATA = [
  {
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
  },
]

const MULTIPLE_RELATIONSHIP_DATA = [
  {
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
  },
  {
    "id": 21372137,
    "color": "#fedcba",
    "title": "[Test#2] Relationship data",
    "description": "Another relationship test data, this is the description so it needs to be long, right?",
    "begin_date": "1021-01-11",
    "end_date": "1021-01-11",
    "descendant": false,
    "relationships": "stepdaughter",
    "user_id": 2137,
    "id_1": 21372137,
    "id_2": 21372137,
  },
]

const DOUBLED_RELATIONSHIP_DATA = [
  {
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
  },
  {
    "id": 21372137,
    "color": "#fedcba",
    "title": "[Test#2] Relationship data",
    "description": "Another relationship test data, this is the description so it needs to be long, right?",
    "begin_date": "1021-01-11",
    "end_date": "1021-01-11",
    "descendant": false,
    "relationships": "stepdaughter",
    "user_id": 2137,
    "id_1": 2137,
    "id_2": 2137,
  },
]

describe('Initial load', () => {
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
  
  it('has 6 Buttons', () => {
    const app = shallow(<Familytree personList={[]} relationshipList={[]}/>);
    var download = app.find('div.download-buttons').getElements().map(el => el.props.children.type)
    var operating = app.find('div.operating-buttons').getElements().map(gr => gr.props.children.map(el => el.type))
    var types = download.concat(operating[0])
    types = types.filter(Boolean)
    expect(types).toEqual(['button', 'button', 'button', 'button', 'button', 'button'])
  });
});

describe('Rendering child components', () => {
  it('renders with one person without crashing', () => {
    shallow(<Familytree personList={PERSON_DATA} relationshipList={[]}/>);
  });
  
  it('includes Person at page load if exists in API', () => {
    const app = shallow(<Familytree personList={PERSON_DATA} relationshipList={[]}/>);
    expect(app.containsMatchingElement(<Person />)).toEqual(true)
  });
  
  it('includes multiple Persons at page load if exists in API', () => {
    const app = shallow(<Familytree personList={MULTIPLE_PERSON_DATA} relationshipList={[]}/>);
    expect(app.find('Person').getElements()).toHaveLength(MULTIPLE_PERSON_DATA.length)
  });
  
  it('renders with one relationship without crashing', () => {
    shallow(<Familytree personList={[]} relationshipList={RELATIONSHIP_DATA}/>);
  });
  
  it('includes reationship at page load if exists in API', () => {
    const app = shallow(<Familytree personList={[]} relationshipList={RELATIONSHIP_DATA}/>);
    expect(app.containsMatchingElement(<Relationship />)).toEqual(true)
  });
  
  it('includes multiple Relationships at page load if exists in API', () => {
    const app = shallow(<Familytree personList={[]} relationshipList={MULTIPLE_RELATIONSHIP_DATA}/>);
    expect(app.find('Relationship').getElements()).toHaveLength(MULTIPLE_RELATIONSHIP_DATA.length)
  });
  
  it('includes one if double Relationships at page load if exists in API', () => {
    // by id_1, id_2
    const app = shallow(<Familytree personList={[]} relationshipList={DOUBLED_RELATIONSHIP_DATA}/>);
    expect(app.find('Relationship').getElements()).toHaveLength(1)
  });
  
  it('renders multiple persons & relationship without crashing', () => {
    shallow(<Familytree personList={MULTIPLE_PERSON_DATA} relationshipList={RELATIONSHIP_DATA}/>);
  });
  
  it('includes multiple persons & relationships at page load if exists in API', () => {
    const app = shallow(<Familytree personList={MULTIPLE_PERSON_DATA} relationshipList={MULTIPLE_RELATIONSHIP_DATA}/>);
    expect(app.find('Person').getElements()).toHaveLength(MULTIPLE_PERSON_DATA.length)
    expect(app.find('Relationship').getElements()).toHaveLength(MULTIPLE_RELATIONSHIP_DATA.length)
  });
});