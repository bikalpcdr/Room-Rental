import React from "react";
import PropTypes from "prop-types";

const FloatingTableModal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal floating-table-modal">
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="modal-content">{children}</div>
      </div>
    </div>
  );
};

FloatingTableModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default FloatingTableModal; 