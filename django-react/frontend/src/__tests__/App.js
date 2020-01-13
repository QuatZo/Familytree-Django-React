import React from 'react';
import { shallow } from 'enzyme';
import App from '../App';
import LoginForm from '../components/auth/LoginForm';
import Nav from '../components/nav/Nav';
import Familytree from '../Familytree';
import SignupForm from '../components/auth/SignupForm';


describe('Initial load', () => {
  it('renders without crashing', () => {
    shallow(<App />);
  });
  
  it('includes nav bar at page load', () => {
    const app = shallow(<App />);
    expect(app.containsMatchingElement(<Nav />)).toEqual(true)
  });
  
  it('includes Login Form at page load', () => {
    const app = shallow(<App />);
    expect(app.containsMatchingElement(<LoginForm />)).toEqual(true)
  });
  
  it('doesn\'t include Signup Form at page load', () => {
    const app = shallow(<App />);
    expect(app.containsMatchingElement(<SignupForm />)).not.toEqual(true)
  });
  
  it('doesn\'t include Familytree at page load', () => {
    const app = shallow(<App />);
    expect(app.containsMatchingElement(<Familytree />)).not.toEqual(true)
  });
});

describe('Functionality', () => {
  it('includes Familytree after log in', () => {
    const app = shallow(<App />);
    app.setState({
      displayed_form: '',
      donePersonList: true,
      doneRelationshipList: true,
      logged_in: true,
    })
    expect(app.containsMatchingElement(<Familytree />)).toEqual(true)
  });
  
  it('includes Signup Form after click on \'Register\'', () => {
    const app = shallow(<App />);
    app.setState({
      displayed_form: 'signup',
    })
    expect(app.containsMatchingElement(<SignupForm />)).toEqual(true)
  });
});