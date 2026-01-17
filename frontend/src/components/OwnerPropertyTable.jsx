import React from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import "../style/OwnerPropertyTable.css";

class OwnerPropertyTable extends React.Component {
  handleView = (property) => {
    if (this.props.onViewProperty) {
      this.props.onViewProperty(property);
    } else {
      this.props.navigate(`/property/${property.id || property.propertyId}`);
    }
  };

  render() {
    const { properties, onEdit, onDelete, onUploadImages } = this.props;
    
    return (
      <div className="table-container">
  <table className="table users-table table-striped table-hover">
    <thead>
      <tr>
        <th>S.N</th>
        <th>Title</th>
        <th>Type</th>
        <th>Address</th>
        <th>Rooms</th>
        <th>Rent</th>
        <th>Available</th>
        <th>Amenities</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {properties.map((property, index) => (
        <tr key={property.id || property.propertyId}>
          <td>{index + 1}</td>
          <td>{property.title}</td>
          <td>{property.propertyType}</td>
          <td>{property.address}</td>
          <td>{property.roomCount}</td>
          <td>Rs.{property.rentPrice}</td>
          <td>{property.isAvailable ? "Yes" : "No"}</td>
          <td className="amenities-cell">
            {property.amenities?.join(", ") || "N/A"}
          </td>
          <td>
            <div className="action-buttons mt-0">
              <button
                className="view-btn"
                onClick={() => this.handleView(property)}
              >
                View
              </button>
              <button
                className="edit-btn"
                onClick={() => onEdit(property)}
              >
                Edit
              </button>
              <button
                className="delete-btn"
                onClick={() => onDelete(property.id || property.propertyId)}
              >
                Delete
              </button>
              <button
                className="upload-images-btn"
                onClick={() => onUploadImages(property.id || property.propertyId)}
              >
                Upload Images
              </button>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

    );
  }
}

OwnerPropertyTable.propTypes = {
  properties: PropTypes.array.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onUploadImages: PropTypes.func.isRequired,
  navigate: PropTypes.func.isRequired,
  onViewProperty: PropTypes.func,
};

// Wrapper to inject navigate
const OwnerPropertyTableWithNavigate = (props) => {
  const navigate = useNavigate();
  return <OwnerPropertyTable {...props} navigate={navigate} />;
};

export default OwnerPropertyTableWithNavigate; 