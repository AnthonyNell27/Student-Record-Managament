import { useEffect, useState } from 'react';
import {
  fetchUsers,
  deleteAccount
} from '../utils/api';
import AddUser from '../buttons/AddUser';
import EditUser from '../buttons/EditUser';
import { FaUsers, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { getCurrentUser } from '../utils/auth';

export default function AccountManagement() {
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteCandidate, setDeleteCandidate] = useState(null);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    loadUsers();
    const user = getCurrentUser();
    setUserRole(user?.role);
  }, []);

  const loadUsers = async () => {
    const res = await fetchUsers();
    if (res.status === 'success') {
      setUsers(res.data);
    }
  };

  const confirmDelete = async () => {
    if (!deleteCandidate) return;
    const res = await deleteAccount(deleteCandidate.id);
    if (res.status === 'success') {
      loadUsers();
      setDeleteCandidate(null);
    } else {
      alert(res.message || 'Failed to delete user.');
    }
  };

  return (
    <div className="p-3 pt-3 h-full text-gray-800 dark:text-gray-100">
      <div className="w-full bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 flex flex-col h-[645px]">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <FaUsers className="text-blue-600 text-2xl" />
            <h2 className="text-lg font-semibold">Manage User Accounts</h2>
          </div>

          {userRole === 'admin' && (
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 text-sm rounded-full hover:bg-blue-700"
            >
              <FaPlus />
              Add User
            </button>
          )}
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          <table className="min-w-[600px] w-full text-sm text-left h-full">
            <thead className="text-xs text-white uppercase bg-blue-700">
              <tr>
                <th className="px-3 py-2">Username</th>
                <th className="px-3 py-2">Role</th>
                <th className="px-3 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {users.length > 0 ? (
                users.map((user, i) => (
                  <tr
                    key={user.id}
                    className={`transition ${
                      i % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700'
                    } hover:bg-blue-50 dark:hover:bg-gray-600`}
                  >
                    <td className="px-3 py-2">{user.username}</td>
                    <td className="px-3 py-2 capitalize">{user.role}</td>
                    <td className="px-3 py-2 text-center whitespace-nowrap">
                      <button
                        onClick={() => setEditUser(user)}
                        className="text-blue-500 hover:text-blue-700 mx-1"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => setDeleteCandidate(user)}
                        className="text-red-500 hover:text-red-700 mx-1"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center py-6 text-gray-400 dark:text-gray-500">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {showAddModal && (
        <AddUser onClose={() => setShowAddModal(false)} onSaved={loadUsers} />
      )}

      {editUser && (
        <EditUser user={editUser} onClose={() => setEditUser(null)} onSaved={loadUsers} />
      )}

      {/* Delete Modal */}
      {deleteCandidate && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-3">Confirm Deletion</h3>
            <p className="text-sm mb-6">
              Are you sure you want to delete{' '}
              <strong>{deleteCandidate.username}</strong>?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteCandidate(null)}
                className="px-4 py-2 text-sm rounded-md border dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-sm rounded-md bg-red-600 text-white hover:bg-red-700"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
