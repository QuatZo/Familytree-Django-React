import React from 'react';
import { shallow } from 'enzyme';
import RelationshipModal from '../components/relationship/RelationshipModal';

const EMPTY_RELATIONSHIP_DATA = {
  "title": "",
  "description": "",
  "begin_date": "",
  "end_date": "",
  "descendant": "",
  "relationships": "",
  "user_id": 2137,
  "id_1": 2137,
  "id_2": 2137,
}

describe('Initial load', () => {
  it('renders without crashing', () => {
    shallow(<RelationshipModal activeItem={EMPTY_RELATIONSHIP_DATA} />);
  });
});

describe('Standard modal validation', () =>{
  it('is modal', () => {
    const app = shallow(<RelationshipModal activeItem={EMPTY_RELATIONSHIP_DATA} />);
    expect(app.exists('Modal')).toEqual(true)
  });

  it('has modal header', () => {
    const app = shallow(<RelationshipModal activeItem={EMPTY_RELATIONSHIP_DATA} />);
    expect(app.exists('ModalHeader')).toEqual(true)
  });

  it('has modal body', () => {
    const app = shallow(<RelationshipModal activeItem={EMPTY_RELATIONSHIP_DATA} />);
    expect(app.exists('ModalBody')).toEqual(true)
  });

  it('has modal footer', () => {
    const app = shallow(<RelationshipModal activeItem={EMPTY_RELATIONSHIP_DATA} />);
    expect(app.exists('ModalFooter')).toEqual(true)
  });

  it('has at least one button', () => {
    const app = shallow(<RelationshipModal activeItem={EMPTY_RELATIONSHIP_DATA} />);
    expect(app.exists('Button')).toEqual(true)
  });
});

describe('Form validation', () =>{
  it('has 2 Input Text Field, 2 Input Date & Select Field', () => {
    const app = shallow(<RelationshipModal activeItem={EMPTY_RELATIONSHIP_DATA} />);
    expect(app.find('[name="title"]').exists()).toEqual(true)
    expect(app.find('[name="description"]').exists()).toEqual(true)
    expect(app.find('[name="begin_date"]').exists()).toEqual(true)
    expect(app.find('[name="end_date"]').exists()).toEqual(true)
    expect(app.find('[name="relationships"]').exists()).toEqual(true)
  });
  
  it('has error subclass for title & begin date if empty', () => {
    const app = shallow(<RelationshipModal activeItem={EMPTY_RELATIONSHIP_DATA} />);
    expect(app.find('[name="title"]').getElement().props.className.split(" ")).toContain('error')
    expect(app.find('[name="begin_date"]').getElement().props.className.split(" ")).toContain('error')
  });

  it('has no error subclass for title & begin_date if fulfilled with proper data', () => {
    const app = shallow(<RelationshipModal activeItem={EMPTY_RELATIONSHIP_DATA} />);

    app.find('[name="title"]').simulate('change', {target: {name: 'title', value: 'Sufficient'}})
    expect(app.find('[name="title"]').getElement().props.className.split(" ")).not.toContain('error')

    app.find('[name="begin_date"]').simulate('change', new Date("1000", "10", "10"))
    expect(app.find('[name="begin_date"]').getElement().props.className.split(" ")).not.toContain('error')
  });

  it('has error subclass for title & begin_date if fulfilled with empty data', () => {
    const app = shallow(<RelationshipModal activeItem={EMPTY_RELATIONSHIP_DATA} />);

    app.find('[name="title"]').simulate('change', {target: {name: 'title', value: ''}})
    expect(app.find('[name="title"]').getElement().props.className.split(" ")).toContain('error')

    app.find('[name="begin_date"]').simulate('change', "")

    console.log(app.state().activeItem);

    expect(app.find('[name="begin_date"]').getElement().props.className.split(" ")).toContain('error')
  });

  it('has error subclass for end_date if earlier than begin_date', () => {
    const app = shallow(<RelationshipModal activeItem={EMPTY_RELATIONSHIP_DATA} />);

    app.find('[name="begin_date"]').simulate('change', new Date("1000", "10", "10"))

    app.find('[name="end_date"]').simulate('change', new Date("1000", "10", "01"))
    expect(app.find('[name="end_date"]').getElement().props.className.split(" ")).toContain('error')
  });

  it('has error subclass for title & description if fulfilled with too long', () => {
    const app = shallow(<RelationshipModal activeItem={EMPTY_RELATIONSHIP_DATA} />);
    const len65 = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
    const len513 = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
    
    app.find('[name="title"]').simulate('change', {target: {name: 'title', value: len65}})
    expect(app.find('[name="title"]').getElement().props.className.split(" ")).toContain('error')

    app.find('[name="description"]').simulate('change', {target: {name: 'description', value: len513}})
    expect(app.find('[name="description"]').getElement().props.className.split(" ")).toContain('error')
  });
  
  it('has enabled Submit Button after providing sufficient information', () => {
    const app = shallow(<RelationshipModal activeItem={EMPTY_RELATIONSHIP_DATA} />);

    app.find('[name="title"]').simulate('change', {target: {name: 'title', value: 'Sufficient'}})
    app.find('[name="begin_date"]').simulate('change', new Date("1000", "10", "10"))
    app.find('[name="relationships"]').simulate('change', {target: {name: 'relationships', value: 'child'}})

    var disabled = app.find('Button').getElements().map(el => el.props.disabled )
    disabled = disabled.filter(Boolean)
    expect(disabled).toEqual([])
  });
});