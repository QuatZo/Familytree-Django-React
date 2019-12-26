// frontend/src/components/ConfirmationModal.js
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
          header: this.props.header,
          content: this.props.content,
          confirmText: this.props.confirmText,
          cancelText: this.props.cancelText,
        };
      }
      
      render() {
        const { toggle, onConfirm } = this.props;
        return (
          <Modal isOpen={true} toggle={toggle}>
            <ModalHeader toggle={toggle}> 
              {this.state.header} 
            </ModalHeader>
            <ModalBody> 
              {this.state.content} 
            </ModalBody>
            <ModalFooter>
              <Button onClick={toggle}>
                {this.state.cancelText}
              </Button>
              <Button color="danger" onClick={() => onConfirm()}>
                {this.state.confirmText}
              </Button>
            </ModalFooter>
          </Modal>
        );
      }
    }