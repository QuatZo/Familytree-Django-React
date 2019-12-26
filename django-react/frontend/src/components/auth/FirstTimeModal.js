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
              In order to add any connection between two chosen people, you need to double-click them. If it's a 2-level relation (i.e. child), then you need to double-click on Parent first, then on Child. If any person is already 'active' (double-clicked, chosen), then it has border in different color than 'inactive' person. Worth mentioning: <b>Every pair can have more than one connection between them, but only the newest one (or the one still ongoin) will be visible for user.</b><br/><br/>
              <h1 className="header">Timeline</h1>
              As previously mentioned, our project has a timeline functionality. Because we wanted to make it useful, every person has its own timeline. In order to open it, you just need to click the <b>Edit button (blue, person with pencil)</b> located at the bottom of Person's card. Our timeline can store 2 different types of posts:
              <ul className="first-time-list">
                <li><b>Milestone</b> - from the <b>Edit Person</b> window, you can Add, Edit & Delete Milestone. If you want to add post of this type, you just need to click on green button named "Add Milestone". In order to edit this, you need to be sure that Delete Mode is disabled (the only one visible toggle button), then go to specific Milestone and click the big "Edit Milestone" button. It is worth mentioning that for this type of timeline post, it's required to add your own file. This file needs to be a media type, which means Video or Image. Plus, there <b>always</b> needs to be at least one person connected with specific milestone. After adding at least 2 people, you'll see additional message after description, which says with who you spent this time.</li>
                <li><b>Relationship</b> - you can only edit or delete relationship, you can't add it here. In order to add relationship, go back to <b>Connection between two people</b> part. Relationship doesn't have any media, it has only a default image we set. Because of that loss, we decided to add few more things that are not in <b>Milestones</b>
                  <ul className="first-time-list">
                    <li><b>End Date</b> - if your relation with someone has changed, you don't need to edit its type. You can add new relation with new type, and then edit the old one and set End date.</li>
                    <li><b>Type</b> - every relation in Timeline has its own relation type written under description, which helps to recognize relation even when you can't recognize relation from title & description</li>
                    <li><b>Together with</b> - in this line, under description and previously mentioned options, you'll see first & last name of person who is with you in specific relation.</li>
                  </ul>
                </li>
              </ul>
              <br />
              <h1 className="header">Final Speech</h1>
              We tried to describe as many not-so-common functionalities as possible. If you find something hard to understand, please feel free to contact us <b>(if only it was in production, there would be an e-mail address)</b>. It is really early stage of the project, so if you find some bugs or you'll see error you can't understand and/or resolve, please, let us know. We are unable to test everything, unfortunately.
              <br /><br />
              <b>CAUTION: </b> We want to remind you that it's a student's project, so it's not meant to be in production. Any data leaks, bugs & shortcomings are possible and we are really sorry for them to occur.
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