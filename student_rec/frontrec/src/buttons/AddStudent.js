import { useState, useRef, useEffect } from 'react';
import { createStudent } from '../utils/api';

export default function AddStudent({ onClose, onSave }) {
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    mobile_number: '',
    date_of_birth: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    if (!form.first_name.trim()) err.first_name = 'First name is required';
    if (!form.last_name.trim()) err.last_name = 'Last name is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) err.email = 'Invalid email';
    if (!/^\d{11}$/.test(form.mobile_number)) err.mobile_number = 'Must be 11 digits';
    if (!form.date_of_birth) err.date_of_birth = 'Date of birth is required';
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

    setIsSubmitting(true);

    try {
      const res = await createStudent(form);
      console.log('🟢 createStudent response:', res);

      if (!res || typeof res !== 'object') {
        alert('❌ Server did not respond correctly.');
        return;
      }

      if (res.status === 'success') {
        alert('✅ Student added!');
        onSave();
        onClose();
      } else {
        alert(`❌ ${res.message || 'Unknown error occurred.'}`);
      }
    } catch (err) {
      alert('Error: ' + err.message);
      console.error('🚨 Fetch error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div
        ref={modalRef}
        className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-6 rounded-xl shadow-lg w-full max-w-lg relative"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-500 dark:text-gray-300 hover:text-red-500 text-xl"
        >
          &times;
        </button>

        <h3 className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-4">
          Register New Student
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: 'First Name', name: 'first_name', type: 'text' },
            { label: 'Last Name', name: 'last_name', type: 'text' },
            { label: 'Email', name: 'email', type: 'email' },
            { label: 'Mobile Number', name: 'mobile_number', type: 'text', maxLength: 11 },
            { label: 'Date of Birth', name: 'date_of_birth', type: 'date' },
          ].map(({ label, name, type, maxLength }) => (
            <div key={name}>
              <label className="block text-sm font-medium mb-1">{label}</label>
              <input
                type={type}
                name={name}
                value={form[name]}
                onChange={handleChange}
                maxLength={maxLength}
                disabled={isSubmitting}
                className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-900 dark:text-white ${
                  errors[name] ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                required
              />
              {errors[name] && (
                <p className="text-red-500 text-sm mt-1">{errors[name]}</p>
              )}
            </div>
          ))}

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'Saving...' : 'Save Student'}
          </button>
        </form>
      </div>
    </div>
  );
}
