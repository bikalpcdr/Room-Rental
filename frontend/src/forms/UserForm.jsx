import React, { useCallback } from "react";
import PropTypes from "prop-types";

function UserForm({ formData, setFormData, onSubmit, onCancel, isEdit }) {
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, [setFormData]);

  return (
    <form onSubmit={onSubmit} autoComplete="off">
      <div className="form-group">
        <label htmlFor="user-username">Username:</label>
        <input
          id="user-username"
          name="username"
          type="text"
          value={formData.username}
          onChange={handleChange}
          required
          disabled={isEdit}
        />
      </div>
      {!isEdit && (
        <div className="form-group">
          <label htmlFor="user-email">Email:</label>
          <input
            id="user-email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
      )}
      {!isEdit && (
        <div className="form-group">
          <label htmlFor="user-password">Password:</label>
          <input
            id="user-password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
      )}
      <div className="form-group">
        <label htmlFor="user-fullName">Full Name:</label>
        <input
          id="user-fullName"
          name="fullName"
          type="text"
          value={formData.fullName}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="user-phoneNumber">Phone Number:</label>
        <input
          id="user-phoneNumber"
          name="phoneNumber"
          type="text"
          value={formData.phoneNumber}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="user-role">Role:</label>
        <select
          id="user-role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          required
        >
          <option value="RENTER">Renter</option>
          <option value="OWNER">Owner</option>
          <option value="ADMIN">Admin</option>
        </select>
      </div>
      <div className="modal-actions">
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit">{isEdit ? "Update User" : "Create User"}</button>
      </div>
    </form>
  );
}

UserForm.propTypes = {
  formData: PropTypes.object.isRequired,
  setFormData: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  isEdit: PropTypes.bool,
};

export default UserForm; 