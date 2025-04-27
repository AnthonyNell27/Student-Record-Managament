import { useEffect, useState } from 'react';
import { fetchStudents, deleteStudent } from '../utils/api';
import { FaUserGraduate, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import EditStudent from '../buttons/EditStudent';
import AddStudent from '../buttons/AddStudent';
import ExportStudent from '../buttons/ExportStudent';
import { getCurrentUser } from '../utils/auth';

export default function StudentList() {
  const [students, setStudents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [query, setQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [editingStudent, setEditingStudent] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteCandidate, setDeleteCandidate] = useState(null);
  const [userRole, setUserRole] = useState('');
  const perPage = 10;

  useEffect(() => {
    loadStudents();
    const currentUser = getCurrentUser();
    setUserRole(currentUser?.role);
  }, []);

  const loadStudents = () => {
    fetchStudents().then((res) => {
      if (res.status === 'success') {
        const reversed = [...res.data].reverse();
        setStudents(reversed);
        setFiltered(reversed);
      }
    });
  };

  useEffect(() => {
    const q = query.toLowerCase();
    const filtered = students.filter(
      (s) =>
        s.first_name.toLowerCase().includes(q) ||
        s.last_name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q)
    );
    setFiltered(filtered);
    setCurrentPage(1);
  }, [query, students]);

  const confirmDelete = async () => {
    if (!deleteCandidate) return;
    const res = await deleteStudent(deleteCandidate.id);
    if (res.status === 'success') {
      const updated = students.filter((s) => s.id !== deleteCandidate.id);
      setStudents(updated);
      setFiltered(updated);
      setDeleteCandidate(null);
    }
  };

  const start = (currentPage - 1) * perPage;
  const current = filtered.slice(start, start + perPage);
  const totalPages = Math.ceil(filtered.length / perPage);

  return (
    <div className="p-3 pt-3 h-full text-gray-800 dark:text-gray-100">
      <div className="w-full bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 flex flex-col h-[645px]">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <FaUserGraduate className="text-blue-600 text-2xl" />
            <h2 className="text-lg font-semibold">Student List</h2>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-start sm:items-center w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search name or email..."
              className="w-full sm:w-72 px-4 py-2 text-sm rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <div className="flex gap-2">
              {userRole === 'admin' && (
                <button
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 text-sm rounded-full hover:bg-blue-700"
                >
                  <FaPlus />
                </button>
              )}
              <ExportStudent />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          <table className="min-w-[1000px] w-full text-sm text-left h-full">
            <thead className="text-xs text-white uppercase bg-blue-700">
              <tr>
                <th className="px-2 py-2">First Name</th>
                <th className="px-2 py-2">Last Name</th>
                <th className="px-2 py-2">Email</th>
                <th className="px-2 py-2">Mobile</th>
                <th className="px-2 py-2">Date of Birth</th>
                <th className="px-2 py-2">Registered At</th>
                <th className="px-2 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {current.map((s, i) => (
                <tr
                  key={s.id}
                  className={`transition ${
                    i % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700'
                  } hover:bg-blue-50 dark:hover:bg-gray-600`}
                >
                  <td className="px-2 py-2">{s.first_name}</td>
                  <td className="px-2 py-2">{s.last_name}</td>
                  <td className="px-2 py-2">{s.email}</td>
                  <td className="px-2 py-2">{s.mobile_number}</td>
                  <td className="px-2 py-2">{s.date_of_birth}</td>
                  <td className="px-2 py-2">{new Date(s.created_at).toLocaleString()}</td>
                  <td className="px-2 py-2 text-center">
                    {userRole === 'admin' && (
                      <>
                        <button
                          onClick={() => setEditingStudent(s)}
                          className="text-blue-500 hover:text-blue-700 mx-1"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => setDeleteCandidate(s)}
                          className="text-red-500 hover:text-red-700 mx-1"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
              {current.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-6 text-gray-400 dark:text-gray-500">
                    No students found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="pt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm text-gray-600 dark:text-gray-300 gap-3">
          <p>
            Showing {start + 1}-{Math.min(start + perPage, filtered.length)} of{' '}
            {filtered.length}
          </p>
          <div className="flex gap-1">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50"
            >
              Prev
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded ${
                  currentPage === i + 1
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {userRole === 'admin' && editingStudent && (
        <EditStudent
          student={editingStudent}
          onClose={() => setEditingStudent(null)}
          onSave={(updated) => {
            const updatedList = students.map((s) =>
              s.id === updated.id ? { ...s, ...updated } : s
            );
            setStudents(updatedList);
            setFiltered(updatedList);
            setEditingStudent(null);
          }}
        />
      )}

      {userRole === 'admin' && showAddModal && (
        <AddStudent
          onClose={() => setShowAddModal(false)}
          onSave={() => {
            setShowAddModal(false);
            loadStudents();
          }}
        />
      )}

      {userRole === 'admin' && deleteCandidate && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-3">Confirm Deletion</h3>
            <p className="text-sm mb-6">
              Are you sure you want to delete{' '}
              <strong>
                {deleteCandidate.first_name} {deleteCandidate.last_name}
              </strong>
              ?
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
