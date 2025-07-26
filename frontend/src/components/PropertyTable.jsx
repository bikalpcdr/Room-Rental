import React from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

class PropertiesTable extends React.Component {
  handleView = (propertyId) => {
    this.props.navigate(`/property/${propertyId}`);
  };

  render() {
    const { properties, onDelete } = this.props;
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
              <th>Owner</th>
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
                <td>{property.ownerName || 'N/A'}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="view-btn"
                      onClick={() => this.handleView(property.id || property.propertyId)}
                    >
                      View
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => onDelete(property.id || property.propertyId)}
                    >
                      Delete
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

PropertiesTable.propTypes = {
  properties: PropTypes.array.isRequired,
  onDelete: PropTypes.func.isRequired,
  navigate: PropTypes.func.isRequired,
};

// Functional wrapper to inject navigate
const PropertiesTableWithNavigate = (props) => {
  const navigate = useNavigate();
  return <PropertiesTable {...props} navigate={navigate} />;
};

export default PropertiesTableWithNavigate; 