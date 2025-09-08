import React, { useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { addExpense } from '../../api/expense'; // Import your API function for creating an expense

const AddPaymentForm = ({ onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    notes: ''
  });

  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const room_id = "5621d051-2916-4520-bc81-5b40279e9a23"; // Hardcoded room_id, can be dynamic

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const formatCurrency = (amount) => {
    if (isNaN(amount)) return '';
    const num = parseInt(amount, 10);
    const million = num / 1000000;
    const thousand = (num % 1000000) / 1000;
    if (num >= 1000000) return `${million} triệu đồng`;
    if (num >= 1000) return `${thousand} ngàn đồng`;
    return `${num} đồng`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('oauthstate');

    try {
      await addExpense({
        token,
        room_id,
        title: formData.title,
        amount: formData.amount,
        notes: formData.notes,
        quantity: formData.number,
      });

      setSuccessMessage('Thêm khoản chi thành công!');
      setError('');
      setFormData({ title: '', amount: '', number: 1, notes: '' });

      setTimeout(() => {
        setSuccessMessage('');
        setShowForm(false);
      }, 200);

    } catch (err) {
      setError(err.message || 'Lỗi khi thêm khoản chi. Vui lòng thử lại.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-gradient-to-br from-green-200 via-green-100 to-white shadow-xl rounded-lg">
      <div className="flex items-center space-x-4 mb-6">
        <button onClick={onCancel} className="text-gray-600 hover:text-gray-800">
          <FaArrowLeft size={28} />
        </button>
        <h1 className="text-4xl font-semibold text-center text-green-700">Tiền phòng 703</h1>
      </div>

      {/* Error and Success Messages */}
      {error && <div className="text-red-500 mb-4 text-center text-lg">{error}</div>}
      {successMessage && <div className="text-green-600 mb-4 text-center text-lg">{successMessage}</div>}

      <form onSubmit={handleSubmit}>
        <div className="space-y-8">
          {/* Title Input */}
          <div className="flex flex-col">
            <label htmlFor="title" className="text-xl text-green-700 mb-2">Tên khoản chi</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="px-6 py-5 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white shadow-lg transition duration-300 ease-in-out text-lg"
            />
          </div>

          {/* Amount Input */}
          <div className="flex flex-col">
            <label htmlFor="amount" className="text-xl text-green-700 mb-2">Số tiền</label>
            <input
              type="text"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
              className={`px-6 py-5 rounded-lg text-gray-900 focus:outline-none focus:ring-2 ${isNaN(formData.amount) && formData.amount ? 'focus:ring-red-500' : 'focus:ring-green-500'} bg-white shadow-lg transition duration-300 ease-in-out text-lg`}
            />
            {formData.amount && !isNaN(formData.amount) && (
              <small className="text-gray-600 font-semibold text-lg text-center mt-2">{formData.amount} VND</small>
            )}
            {formData.amount && !isNaN(formData.amount) && (
              <small className="text-gray-800 font-semibold text-lg text-center mt-2">{formatCurrency(formData.amount)}</small>
            )}
            {isNaN(formData.amount) && formData.amount && (
              <small className="text-red-500 text-center mt-2">Input không hợp lệ</small>
            )}
          </div>

          {/* Notes Input */}
          <div className="flex flex-col">
            <label htmlFor="notes" className="text-xl text-green-700 mb-2">Ghi chú</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="4"
              placeholder="Ghi chú thêm (nếu có)"
              className="px-6 py-5 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white shadow-lg transition duration-300 ease-in-out text-lg"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center mt-8">
            <button
              type="submit"
              className="px-10 py-6 bg-green-600 text-black hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-500 transform hover:scale-105 transition duration-200 text-xl"
            >
              Thêm khoản chi
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddPaymentForm;
