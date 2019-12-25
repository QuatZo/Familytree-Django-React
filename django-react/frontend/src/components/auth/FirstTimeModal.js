// frontend/src/components/FirstTimeModal.js
/*eslint no-useless-computed-key: 0*/

    import React, { Component } from "react";
    import './FirstTime.css';
    
    import {
      Button,
      Modal,
      ModalHeader,
      ModalBody,
      ModalFooter,
    } from "reactstrap";

    export default class CustomModal extends Component {
      constructor(props) {
        super(props);
        this.state = {
          activeItem: this.props.activeItem,
          touched: {
            first_name: false,
            last_name: false,
          },
        };
      }
      
      render() {
        const { toggle, onSave } = this.props;
        return (
          <Modal isOpen={true} toggle={toggle} size="lg">
            <ModalHeader toggle={toggle}> Welcome to the Familytree website! </ModalHeader>
            <ModalBody className="first-time-body">
              We are really proud you did create an account. You'll see this message everytime you log-in/refresh page for 24hrs since account registration. Please, let us introduce our website.<br/><br/>
              <h1 className="header">Student Project</h1>
              You need to know that this is a student project and we <b>DO NOT</b> carry responsibility for <b>ANY data leaks</b>. This project is not meant to be used in Production. <br/><br/>
              <h1 className="header">Main functionality</h1>
              In this app, you can create your own Familytree with proper relations between certain people. Background serves as a board, which means you can move every person in whatever direction you want. Additionally, every person has its own Timeline, where you can see previously added Relationships AND Milestones (that's how we call every 'big event' in your life, i.e. move to other city, promotion). To every relationship/milestone, you can add image/movie. In addition, every person has its own avatar (you can call it profile photo).<br/><br/>
              <h1 className="header">Buttons</h1>
              At the bottom of this page, you can see few buttons. Now we'll try to explain what every single button does.
              <ul className="first-time-list">
                <li><b>Download (white)</b> - downloads actually existing familytree to the PDF format</li>
                <li><b>Delete (red, X)</b> - deletes your whole familytree. Of course it asks before doing this</li>
                <li><b>Reset (yellow, undo)</b> - resets the position of every person to the initial ones</li>
                <li><b>Save (blue, floppy drive)</b> - saves actual coordinates of every person and makes it the initial values</li>
                <li><b>Add (green, plus)</b> - opens the "Add Person" modal, that's where you can add new people to the familytree</li>
              </ul>
              Each person has their own individual buttons.
              <ul className="first-time-list">
                <li><b>Edit (blue, person with pencil)</b> - opens the "Edit Person" modal, where you can edit info about specific human-being, see Timeline, add new Milestones to the Timeline and edit/delete relationships/milestones</li>
                <li><b>Delete (dark, person with minus)</b> - deletes person with its connections (relations)</li>
              </ul><br/>
              <h1 className="header">Connection between two people</h1>
              In order to add any connection between two chosen people, you need to double-click them. If it's a 2-level relation (i.e. child), then you need to double-click on Parent first, then on Child. If any person is already 'active' (double-clicked, chosen), then it has border in different color than 'inactive' person.
            </ModalBody>
            <ModalFooter>
              <Button color="success" onClick={() => onSave()}>
                I understand
              </Button>
            </ModalFooter>
          </Modal>
        );
      }
    }