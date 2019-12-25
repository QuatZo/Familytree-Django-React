// frontend/src/components/FirstTimeModal.js
/*eslint no-useless-computed-key: 0*/

    import React, { Component } from "react";
    
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
          <Modal isOpen={true} toggle={toggle}>
            <ModalHeader toggle={toggle}> Welcome to the Familytree website! </ModalHeader>
            <ModalBody>
              We are really proud you did create an account. Please, forgive us that there's nothing else here.<br/>
              You'll see this message everytime you log-in/refresh page for 24hrs since account registration.
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