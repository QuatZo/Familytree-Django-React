import React from 'react';
import { shallow } from 'enzyme';
import ConfirmationModal from '../components/ConfirmationModal';

describe('Initial load', () => {
  it('renders without crashing', () => {
    shallow(<ConfirmationModal />);
  });
});

describe('Standard modal validation', () =>{
  it('is modal', () => {
    const app = shallow(<ConfirmationModal />);
    expect(app.exists('Modal')).toEqual(true)
  });

  it('has modal header', () => {
    const app = shallow(<ConfirmationModal />);
    expect(app.exists('ModalHeader')).toEqual(true)
  });

  it('has modal body', () => {
    const app = shallow(<ConfirmationModal />);
    expect(app.exists('ModalBody')).toEqual(true)
  });

  it('has modal footer', () => {
    const app = shallow(<ConfirmationModal />);
    expect(app.exists('ModalFooter')).toEqual(true)
  });

  it('has at least one button', () => {
    const app = shallow(<ConfirmationModal />);
    expect(app.exists('Button')).toEqual(true)
  });
});

describe('Confirm validation', () => {
  it('has custom header', () => {
    const HEADER = "Test Header"
    const app = shallow(<ConfirmationModal header={HEADER}/>);
    expect(app.find('ModalHeader').getElement().props.children).toEqual(HEADER);
  });

  it('has custom content', () => {
    const BODY = "Test Body"
    const app = shallow(<ConfirmationModal content={BODY}/>);
    expect(app.find('ModalBody').getElement().props.children).toEqual(BODY);
  });

  it('has 2 buttons', () => {
    const app = shallow(<ConfirmationModal />);
    expect(app.find('Button')).toHaveLength(2);
  });

  it('has custom text for buttons', () => {
    const TEXT = ["Test Confirm", "Test Cancel"]
    const app = shallow(<ConfirmationModal cancelText={TEXT[0]} confirmText={TEXT[1]} />);
    const actualText = app.find('Button').getElements().map(el => el.props.children)
    expect(actualText).toEqual(TEXT);
  });
});