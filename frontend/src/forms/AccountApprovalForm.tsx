import React, { useState } from "react";

interface User {
  id: string;
  username: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: string;
  status: string;
}

interface AccountApprovalFormProps {
  user: User;
  onApprove: (userId: string) => void;
  onReject: (userId: string) => void;
  loading?: boolean;
}

const AccountApprovalForm: React.FC<AccountApprovalFormProps> = ({ 
  user, 
  onApprove, 
  onReject, 
  loading = false 
}) => {
  const [reason, setReason] = useState("");

  const handleApprove = () => {
    onApprove(user.id);
  };

  const handleReject = () => {
    if (!reason.trim()) {
      alert("Please provide a reason for rejection.");
      return;
    }
    onReject(user.id);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Account Approval</h3>
      
      <div className="space-y-4 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <p className="text-gray-900">{user.username}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <p className="text-gray-900">{user.fullName}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <p className="text-gray-900">{user.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <p className="text-gray-900">{user.phoneNumber}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
              user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' :
              user.role === 'OWNER' ? 'bg-blue-100 text-blue-800' :
              'bg-green-100 text-green-800'
            }`}>
              {user.role}
            </span>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Current Status</label>
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
              user.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
              user.status === 'INACTIVE' ? 'bg-red-100 text-red-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {user.status}
            </span>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Rejection Reason (if rejecting)
        </label>
        <textarea
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Enter reason for rejection..."
        />
      </div>

      <div className="flex justify-end space-x-4">
        <button
          onClick={handleApprove}
          disabled={loading}
          className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Approve Account'}
        </button>
        <button
          onClick={handleReject}
          disabled={loading}
          className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Reject Account'}
        </button>
      </div>
    </div>
  );
};

export default AccountApprovalForm;
