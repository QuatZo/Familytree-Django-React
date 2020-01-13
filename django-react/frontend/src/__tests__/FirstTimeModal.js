import React from 'react';
import { shallow } from 'enzyme';
import FirstTimeModal from '../components/auth/FirstTimeModal';

describe('Initial load', () => {
  it('renders without crashing', () => {
    shallow(<FirstTimeModal />);
  });
});

describe('Standard modal validation', () =>{
  it('is modal', () => {
    const app = shallow(<FirstTimeModal />);
    expect(app.exists('Modal')).toEqual(true)
  });

  it('has modal header', () => {
    const app = shallow(<FirstTimeModal />);
    expect(app.exists('ModalHeader')).toEqual(true)
  });

  it('has modal body', () => {
    const app = shallow(<FirstTimeModal />);
    expect(app.exists('ModalBody')).toEqual(true)
  });

  it('has modal footer', () => {
    const app = shallow(<FirstTimeModal />);
    expect(app.exists('ModalFooter')).toEqual(true)
  });

  it('has at least one button', () => {
    const app = shallow(<FirstTimeModal />);
    expect(app.exists('Button')).toEqual(true)
  });
});

describe('First Time text validation', () => {
  it('has at least one header', () => {
    const app = shallow(<FirstTimeModal />);
    expect(app.exists('h1.header')).toEqual(true)
  });
  it('has at least one list', () => {
    const app = shallow(<FirstTimeModal />);
    expect(app.exists('ul.first-time-list')).toEqual(true)
  });
});