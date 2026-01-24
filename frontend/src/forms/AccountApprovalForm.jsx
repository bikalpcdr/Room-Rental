import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {toast} from 'react-toastify';
import '../style/AccountApprovalForm.css';
import { approvePendingRegistration } from "../api";

const AccountApprovalForm = ({approvals, loading, onRefresh}) => {
    const [processingId, setProcessingId] = useState(null);

    const handleApprove = async (userId, fullName) => {
        if (!window.confirm(`Are you sure you want to approve ${fullName}'s account?`)) {
            return;
        }

        try {
            setProcessingId(userId);

            await approvePendingRegistration(userId);

            toast.success(`${fullName}'s account has been approved successfully!`);
            onRefresh();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to approve account');
            console.error('Approval error:', error);
        } finally {
            setProcessingId(null);
        }
    };

    const handleReject = async (userId, fullName) => {
        if (!window.confirm(`Are you sure you want to reject ${fullName}'s account? This action cannot be undone.`)) {
            return;
        }

        try {
            setProcessingId(userId);
            // TODO: Replace with your actual API call
            // await rejectAccount(userId);

            toast.success(`${fullName}'s account has been rejected.`);
            onRefresh();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to reject account');
            console.error('Rejection error:', error);
        } finally {
            setProcessingId(null);
        }
    };

    if (loading) {
        return (
            <div className="approval-loading">
                <div className="spinner-border text-primary mb-3" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p>Loading pending approvals...</p>
            </div>
        );
    }

    if (!approvals || approvals.length === 0) {
        return (
            <div className="approval-empty">
                <div className="approval-empty-icon">✓</div>
                <h3>No Pending Approvals</h3>
                <p>All accounts have been reviewed. Great job!</p>
            </div>
        );
    }

    return (
        <div className="approval-form-container">
            <div className="approval-header">
                <p className="approval-count">
                    {approvals.length} account{approvals.length !== 1 ? 's' : ''} pending approval
                </p>
                <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={onRefresh}
                    disabled={processingId !== null}
                >
                    🔄 Refresh
                </button>
            </div>

            <div className="table-responsive">
                <table className="table table-hover approval-table">
                    <thead>
                    <tr>
                        <th>User</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th className="text-center">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {approvals.map((user) => (
                        <tr key={user.userId}>
                            <td>
                                <div className="user-cell">
                                    <div className="user-avatar-small">
                                        {user.profilePictureUrl ? (
                                            <img src={user.profilePictureUrl} alt={user.fullName}/>
                                        ) : (
                                            <div className="avatar-placeholder-small">
                                                {user.fullName.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                    </div>
                                    <span className="user-fullname">{user.fullName}</span>
                                </div>
                            </td>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>{user.phoneNumber}</td>
                            <td>
                                    <span className={`role-badge role-${user.role.toLowerCase()}`}>
                                        {user.role}
                                    </span>
                            </td>
                            <td>
                                    <span className="status-badge status-pending">
                                        {user.accountStatus}
                                    </span>
                            </td>
                            <td>
                                <div className="action-buttons">
                                    <button
                                        className="btn btn-sm btn-success"
                                        onClick={() => handleApprove(user.userId, user.fullName)}
                                        disabled={processingId !== null}
                                        title="Approve"
                                    >
                                        {processingId === user.userId ? (
                                            <span className="spinner-border spinner-border-sm"></span>
                                        ) : (
                                            '✓'
                                        )}
                                    </button>
                                    <button
                                        className="btn btn-sm btn-danger"
                                        onClick={() => handleReject(user.userId, user.fullName)}
                                        disabled={processingId !== null}
                                        title="Reject"
                                    >
                                        {processingId === user.userId ? (
                                            <span className="spinner-border spinner-border-sm"></span>
                                        ) : (
                                            '✗'
                                        )}
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

AccountApprovalForm.propTypes = {
    approvals: PropTypes.arrayOf(
        PropTypes.shape({
            userId: PropTypes.number.isRequired,
            username: PropTypes.string.isRequired,
            email: PropTypes.string.isRequired,
            fullName: PropTypes.string.isRequired,
            phoneNumber: PropTypes.string.isRequired,
            role: PropTypes.string.isRequired,
            isActive: PropTypes.bool,
            profilePictureUrl: PropTypes.string,
            accountStatus: PropTypes.string.isRequired,
        })
    ).isRequired,
    loading: PropTypes.bool.isRequired,
    onRefresh: PropTypes.func.isRequired,
};

export default AccountApprovalForm;