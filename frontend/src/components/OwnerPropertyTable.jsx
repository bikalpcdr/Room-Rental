import React from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

class OwnerPropertyTable extends React.Component {
  handleView = (propertyId) => {
    if (this.props.onViewProperty) {
      this.props.onViewProperty(propertyId);
    } else {
      this.props.navigate(`/property/${propertyId}`);
    }
  };

  render() {
    const { properties, onEdit, onDelete, onUploadImages } = this.props;
    
    return (
      <div className="table-container">
        <table className="users-table">
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
                <td>{property.roomTitle || property.title}</td>
                <td>{property.propertyType}</td>
                <td>{property.address}</td>
                <td>{property.roomCount}</td>
                <td>Rs.{property.rentPrice}</td>
                <td>{property.isAvailable ? "Yes" : "No"}</td>
                <td className="amenities-cell">
                  {property.amenities?.join(", ") || "N/A"}
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="view-btn"
                      onClick={() => this.handleView(property.id || property.propertyId)}
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