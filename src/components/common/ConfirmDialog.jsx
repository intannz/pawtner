import React from 'react';
import Modal from './Modal';
import Button from './Button';

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Ya, Lanjutkan', cancelText = 'Batal', isDestructive = false }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <p className="mb-6 text-gray-600">{message}</p>
      <div className="flex justify-end gap-3">
        <Button variant="ghost" onClick={onClose}>
          {cancelText}
        </Button>
        <Button 
          variant={isDestructive ? 'primary' : 'secondary'} 
          className={isDestructive ? 'bg-red-600 hover:bg-red-700' : ''}
          onClick={() => {
            onConfirm();
            onClose();
          }}
        >
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;