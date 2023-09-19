import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function CreditFailModal({ open, onClose }) {
  const [show, setShow] = useState(open);

  // Use a useEffect to sync the show state with the open prop
  React.useEffect(() => {
    setShow(open);
  }, [open]);

  const handleClose = () => {
    setShow(false);
    onClose(); // Call the onClose callback provided by the parent component
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Credit has not been updated</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Please check the database whether credit has been updated or not. Update it manually if needed.
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default CreditFailModal;
