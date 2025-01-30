// components/Modal.js
import React from 'react';
import '../style/modal.css';

const Modal = ({ isOpen, onClose, title, message }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>{title}</h2>
                <p>{message}</p>
                <button className="close-btn" onClick={onClose}>
                    Fechar
                </button>
            </div>
        </div>
    );
};

export default Modal;
