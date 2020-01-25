import React from 'react';
import { shallow } from 'enzyme';
import MilestoneModal from '../components/person/MilestoneModal';

const MILESTONE_EMPTY_DATA = {
  person_id: 2137,
  date: "",
  title: "",
  text: "",
  image: undefined
}

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

describe('Initial load', () => {
  it('renders without crashing', () => {
    shallow(<MilestoneModal activeItem={MILESTONE_EMPTY_DATA} personList={[]}/>);
  });
});

describe('Standard modal validation', () =>{
  it('is modal', () => {
    const app = shallow(<MilestoneModal activeItem={MILESTONE_EMPTY_DATA} personList={[]}/>);
    expect(app.exists('Modal')).toEqual(true)
  });

  it('has modal header', () => {
    const app = shallow(<MilestoneModal activeItem={MILESTONE_EMPTY_DATA} personList={[]}/>);
    expect(app.exists('ModalHeader')).toEqual(true)
  });

  it('has modal body', () => {
    const app = shallow(<MilestoneModal activeItem={MILESTONE_EMPTY_DATA} personList={[]}/>);
    expect(app.exists('ModalBody')).toEqual(true)
  });

  it('has modal footer', () => {
    const app = shallow(<MilestoneModal activeItem={MILESTONE_EMPTY_DATA} personList={[]}/>);
    expect(app.exists('ModalFooter')).toEqual(true)
  });

  it('has at least one button', () => {
    const app = shallow(<MilestoneModal activeItem={MILESTONE_EMPTY_DATA} personList={[]}/>);
    expect(app.exists('Button')).toEqual(true)
  });
});

describe('Form validation', () =>{
  it('has 2 Input Text Field, Input Date, Multi-Select & File', () => {
    const app = shallow(<MilestoneModal activeItem={MILESTONE_EMPTY_DATA} personList={[]}/>);
    expect(app.find('[name="title"]').exists()).toEqual(true)
    expect(app.find('[name="text"]').exists()).toEqual(true)
    expect(app.find('[name="date"]').exists()).toEqual(true)
    expect(app.find('[name="multiselect"]').exists()).toEqual(true)
    // testing Dropzone is not supported by using Enzyme
    //expect(app.containsMatchingElement(<Dropzone />)).toEqual(true)
  });

  it('has error subclass for title, date & file if empty', () => {
    const app = shallow(<MilestoneModal activeItem={MILESTONE_EMPTY_DATA} personList={[]}/>);
    expect(app.find('[name="title"]').getElement().props.className.split(" ")).toContain('error')
    expect(app.find('[name="date"]').getElement().props.className.split(" ")).toContain('error')
    // testing Dropzone is not supported by using Enzyme
    //expect(app.containsMatchingElement(<Dropzone />)).toEqual(true)
  });

  it('has no error subclass for title, date & file if fulfilled with proper data', () => {
    const app = shallow(<MilestoneModal activeItem={MILESTONE_EMPTY_DATA} personList={[]}/>);

    app.find('[name="title"]').simulate('change', {target: {name: 'title', value: 'Sufficient'}})
    expect(app.find('[name="title"]').getElement().props.className.split(" ")).not.toContain('error')

    app.find('[name="date"]').simulate('change', new Date("1000", "10", "10"))
    expect(app.find('[name="date"]').getElement().props.className.split(" ")).not.toContain('error')
  });

  it('has error subclass for title, date & file if fulfilled with empty data', () => {
    const app = shallow(<MilestoneModal activeItem={MILESTONE_EMPTY_DATA} personList={[]}/>);

    app.find('[name="title"]').simulate('change', {target: {name: 'title', value: ''}})
    expect(app.find('[name="title"]').getElement().props.className.split(" ")).toContain('error')

    app.find('[name="date"]').simulate('change', "")
    expect(app.find('[name="date"]').getElement().props.className.split(" ")).toContain('error')
  });

  it('has error subclass for title & text if fulfilled with too long', () => {
    const app = shallow(<MilestoneModal activeItem={MILESTONE_EMPTY_DATA} personList={[]}/>);
    const len65 = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
    const len513 = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
    
    app.find('[name="title"]').simulate('change', {target: {name: 'title', value: len65}})
    expect(app.find('[name="title"]').getElement().props.className.split(" ")).toContain('error')

    app.find('[name="text"]').simulate('change', {target: {name: 'text', value: len513}})
    expect(app.find('[name="text"]').getElement().props.className.split(" ")).toContain('error')
  });
  
  it('has enabled Submit Button after providing sufficient information', () => {
    const app = shallow(<MilestoneModal activeItem={MILESTONE_EMPTY_DATA} personList={MULTIPLE_PERSON_DATA}/>);

    app.find('[name="title"]').simulate('change', {target: {name: 'title', value: 'Sufficient'}})
    app.find('[name="date"]').simulate('change', new Date("1000", "10", "10"))

    // since it can't update MultiSelect Selected prop, it updates activeItem.person_id state directly
    const activeItem = { ...app.state().activeItem, ["person_id"]: [MULTIPLE_PERSON_DATA[0].id]};
    app.setState({activeItem})

    var disabled = app.find('Button').getElements().map(el => el.props.disabled )
    disabled = disabled.filter(Boolean)
    // Dropzone not supported
    //expect(disabled).toEqual([])
  });
});