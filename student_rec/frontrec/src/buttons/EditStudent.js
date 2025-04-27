import { useState, useRef, useEffect } from 'react';
import { updateStudent } from '../utils/api';

export default function EditStudent({ student, onClose, onSave }) {
  const [form, setForm] = useState({ ...student });
  const [errors, setErrors] = useState({});
  const modalRef = useRef();

  useEffect(() => {
    function handleClickOutside(e) {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const validate = () => {
    const err = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      err.email = 'Invalid email address';
    }
    if (!/^\d{11}$/.test(form.mobile_number)) {
      err.mobile_number = 'Mobile number must be exactly 11 digits';
    }
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const user_id = localStorage.getItem('user_id');
    const username = localStorage.getItem('username');

    const payload = {
      ...form,
      user_id,
      username
    };

    try {
      const res = await updateStudent(form.id, payload);
      if (res.status === 'success') {
        alert('✅ Student updated successfully.');
        onSave({ ...form });
        onClose();
      } else {
        alert(res.message || 'Update failed.');
      }
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    // ⏩ (Same modal structure as before)
    // Only logic was changed.
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div
        ref={modalRef}
        className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-6 rounded-xl shadow-lg w-full max-w-lg relative"
      >
        <button
          className="absolute top-3 right-4 text-gray-500 dark:text-gray-300 hover:text-red-500 text-xl"
          onClick={onClose}
        >
          &times;
        </button>
        <h3 className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-4">Edit Student</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          {[ 'first_name', 'last_name', 'email', 'mobile_number', 'date_of_birth' ].map((name) => (
            <div key={name}>
              <label className="block text-sm font-medium mb-1">
                {name.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </label>
              <input
                type={name === 'date_of_birth' ? 'date' : 'text'}
                name={name}
                value={form[name]}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-900 dark:text-white ${
                  errors[name] ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                required
              />
              {errors[name] && <p className="text-red-500 text-sm mt-1">{errors[name]}</p>}
            </div>
          ))}
          <button type="submit" className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
