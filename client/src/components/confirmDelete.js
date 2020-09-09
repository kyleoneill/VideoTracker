import React, {useState} from 'react';
import {
    Modal,
    Button
} from 'react-bootstrap';

const ModalConfirmDelete = ({objectType, objectName, onConfirm}) => {
    const [show, setShow] = useState(false);
  
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
  
    return (
      <>
        <span className="remove" onClick={handleShow}>&#x02A2F;</span>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Delete {objectType}</Modal.Title>
          </Modal.Header>
            <Modal.Body>Are you sure you want to delete <b>{objectName}</b>?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="danger" onClick={onConfirm}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }

  export default ModalConfirmDelete