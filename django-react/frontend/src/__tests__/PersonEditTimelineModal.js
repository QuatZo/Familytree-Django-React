import React from 'react';
import { shallow } from 'enzyme';
import PersonEditTimelineModal from '../components/person/PersonEditTimelineModal';
import Timeline from 'react-image-timeline'

const PERSON_DATA = { 
  user_id: 2137, 
  first_name: "Quat", 
  last_name: "Zo", 
  birth_date: "1000-01-01", 
  status_choices: 'living', 
  sex_choices: 'male', 
  birth_place: "Earth", 
  avatar: "media/avatars/someTestAvatar.png"
}

const TIMELINE_DATA = {
  date: "1000-01-01",
  text: "Test Text for Timeline Data",
  title: "[Test] Timeline Data",
  buttonText: "Edit Something",
  imageUrl: "/media/milestones/default.jpg",
  extras: {
    together_with: "[Test] Together With - Names",
  },
  onClick: null,
}

describe('Initial load', () => {
  it('renders without crashing', () => {
    shallow(<PersonEditTimelineModal activeItem={PERSON_DATA} />);
  });
});

describe('Standard modal validation', () =>{
  it('is modal', () => {
    const app = shallow(<PersonEditTimelineModal activeItem={PERSON_DATA} />);
    expect(app.exists('Modal')).toEqual(true)
  });

  it('has modal header', () => {
    const app = shallow(<PersonEditTimelineModal activeItem={PERSON_DATA} />);
    expect(app.exists('ModalHeader')).toEqual(true)
  });

  it('has no modal body if empty timeline data', () => {
    const app = shallow(<PersonEditTimelineModal activeItem={PERSON_DATA} />);
    expect(app.exists('ModalBody')).not.toEqual(true)
  });

  it('has modal body if at least one data in timeline', () => {
    const app = shallow(<PersonEditTimelineModal activeItem={PERSON_DATA} />);
    app.setState({timelineData: TIMELINE_DATA})
    expect(app.exists('ModalBody')).toEqual(true)
  });

  it('has modal footer', () => {
    const app = shallow(<PersonEditTimelineModal activeItem={PERSON_DATA} />);
    expect(app.exists('ModalFooter')).toEqual(true)
  });

  it('has at least one button', () => {
    const app = shallow(<PersonEditTimelineModal activeItem={PERSON_DATA} />);
    expect(app.exists('Button')).toEqual(true)
  });

  it('has timeline component if at least one timeline data', () => {
    const app = shallow(<PersonEditTimelineModal activeItem={PERSON_DATA} />);
    app.setState({timelineData: TIMELINE_DATA})
    expect(app.containsMatchingElement(<Timeline />)).toEqual(true)
  });
});

describe('Form validation', () =>{
  it('has 3 Input Text Field, Input Date, 2 Select Field & File Field', () => {
    const app = shallow(<PersonEditTimelineModal activeItem={PERSON_DATA} />);
    expect(app.find('[type="text"]')).toHaveLength(3)
    expect(app.find('[type="select"]')).toHaveLength(2)
    expect(app.find('[name="birth_date"]').exists()).toEqual(true)
    expect(app.find('[type="file"]')).toHaveLength(1)
  });
  
  it('has no error subclass for first name, last name & file on load', () => {
    const app = shallow(<PersonEditTimelineModal activeItem={PERSON_DATA} />);
    expect(app.find('[name="first_name"]').getElement().props.className.split(" ")).not.toContain('error')
    expect(app.find('[name="first_name"]').getElement().props.className.split(" ")).not.toContain('error')
    expect(app.find('[type="file"]').getElement().props.className.split(" ")).not.toContain('error')
  });

  it('has no error subclass for first name & last name if fulfilled with proper data', () => {
    const app = shallow(<PersonEditTimelineModal activeItem={PERSON_DATA} />);

    app.find('[name="first_name"]').simulate('change', {target: {name: 'first_name', value: 'Sufficient'}})
    expect(app.find('[name="first_name"]').getElement().props.className.split(" ")).not.toContain('error')

    app.find('[name="last_name"]').simulate('change', {target: {name: 'last_name', value: 'Sufficient'}})
    expect(app.find('[name="last_name"]').getElement().props.className.split(" ")).not.toContain('error')
  });

  it('has error subclass for first name & last name if fulfilled with empty data', () => {
    const app = shallow(<PersonEditTimelineModal activeItem={PERSON_DATA} />);

    app.find('[name="first_name"]').simulate('change', {target: {name: 'first_name', value: ''}})
    expect(app.find('[name="first_name"]').getElement().props.className.split(" ")).toContain('error')

    app.find('[name="last_name"]').simulate('change', {target: {name: 'last_name', value: ''}})
    expect(app.find('[name="last_name"]').getElement().props.className.split(" ")).toContain('error')
  });

  it('has error subclass for first name, last name & birth place if fulfilled with too long', () => {
    const app = shallow(<PersonEditTimelineModal activeItem={PERSON_DATA} />);
    const len65 = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
    
    app.find('[name="first_name"]').simulate('change', {target: {name: 'first_name', value: len65}})
    expect(app.find('[name="first_name"]').getElement().props.className.split(" ")).toContain('error')

    app.find('[name="last_name"]').simulate('change', {target: {name: 'last_name', value: len65}})
    expect(app.find('[name="last_name"]').getElement().props.className.split(" ")).toContain('error')

    app.find('[name="birth_place"]').simulate('change', {target: {name: 'birth_place', value: len65}})
    expect(app.find('[name="birth_place"]').getElement().props.className.split(" ")).toContain('error')
  });
  
  it('has enabled Submit Button after providing sufficient information', () => {
    const app = shallow(<PersonEditTimelineModal activeItem={PERSON_DATA} />);

    app.find('[name="first_name"]').simulate('change', {target: {name: 'first_name', value: 'Sufficient'}})
    app.find('[name="last_name"]').simulate('change', {target: {name: 'last_name', value: 'Sufficient'}})

    var disabled = app.find('Button').getElements().map(el => el.props.disabled )
    disabled = disabled.filter(Boolean)
    expect(disabled).toEqual([])
  }); 
});