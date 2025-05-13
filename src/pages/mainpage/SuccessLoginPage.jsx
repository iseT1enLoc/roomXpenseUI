import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { form } from 'framer-motion/client';

const expenseOptions = [
  'Thùng nước',
  'Tiền điện',
  'Nước rửa chén',
  'Chai Vim',
  'Khác',
];

const SuccessPage = () => {
  const { room_id } = useParams(); // NEW
  const location = useLocation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ title: '', amount: '', number: 1, notes: '' });
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showForm, setShowForm] = useState(false);

  console.log("URL:", window.location.href);
  console.log("Search Params:", window.location.search);
  console.log("Token:", new URLSearchParams(window.location.search).get("token"));
  console.log("userme url",`${import.meta.env.VITE_BACKEND_URL}/api/protected/user/me`);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const urlToken = queryParams.get('token');
    const storedToken = localStorage.getItem('oauthstate');
  
    if (urlToken && !storedToken) {
      localStorage.setItem('oauthstate', urlToken);
      navigate(location.pathname, { replace: true });
    }
  
    const tokenToUse = storedToken || urlToken;
    if (!tokenToUse) {
      navigate('/', { replace: true });
      return;
    }
  
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/protected/user/me`, {
        headers: { Authorization: `Bearer ${tokenToUse}` },
      })
      .then((res) => {
        setCurrentUser(res.data);
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          localStorage.removeItem('oauthstate'); // Optional: clear invalid token
          navigate('/', { replace: true });
        } else {
          setError('Lỗi lấy thông tin người dùng.');
        }
      });
  }, [location, navigate]);
    const handleSendReport = () => {
      if (!inputRoomId.trim()) {
        alert("Please enter a Room ID.");
        return;
      }
      navigate(`/send-report/${inputRoomId}`);
    };
  const formatCurrency = (amount) => {
    const num = parseInt(amount, 10);
    if (isNaN(num)) return '';
    if (num >= 1_000_000) return `${num / 1_000_000} triệu đồng`;
    if (num >= 1_000) return `${num / 1_000} ngàn đồng`;
    return `${num} đồng`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || formData.amount<0 || isNaN(formData.amount)||formData.number<0) {
      setError('Vui lòng điền đầy đủ và hợp lệ các trường.');
      return;
    }

    const token = localStorage.getItem('oauthstate');
    if (!token) {
      setError('Không có token xác thực.');
      return;
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/protected/expense`,
        {
          room_id,
          title: formData.title,
          amount: parseFloat(formData.amount),
          notes: formData.notes,
          quantity: parseInt(formData.number) || 1,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSuccessMessage('Thêm khoản chi thành công!');
      setError('');
      setFormData({ title: '', amount: '', number: 1, notes: '' });

      setTimeout(() => {
        setSuccessMessage('');
        setShowForm(false);
      }, 200);
    } catch (err) {
      console.error(err);
      setError('Lỗi khi thêm khoản chi. Vui lòng thử lại.');
    }
  };

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-green-100 via-white to-teal-100 flex items-center justify-center">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-xl p-8 mx-4 space-y-8">
        <motion.h1
          className="text-3xl font-bold text-center text-green-800"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          Tiền phòng 703
        </motion.h1>

        {currentUser && (
          <div className="text-center text-lg">
            <p className="text-gray-700 font-medium">Xin chào, {currentUser.data.name}</p>
            <p className="text-gray-600">Email: {currentUser.data.email}</p>
          </div>
        )}

        {error && <p className="text-red-500 text-center">{error}</p>}
        {successMessage && <p className="text-green-600 text-center">{successMessage}</p>}

        <AnimatePresence mode="wait">
          {!showForm ? (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <motion.button
                onClick={() => setShowForm(true)}
                className="px-8 py-4 bg-blue-500 text-black rounded-full hover:bg-blue-600 shadow-lg hover:shadow-xl focus:outline-none transform hover:scale-105 transition duration-200 ease-in-out"
              >
                Thêm khoản chi tiêu tháng này
              </motion.button>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">Tên khoản chi</label>
                <select
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-5 py-3 border rounded-lg shadow-sm text-lg"
                >
                  <option value="">-- Chọn khoản chi --</option>
                  {expenseOptions.map((option, idx) => (
                    <option key={idx} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">Số tiền</label>
                <input
                  type="text"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                  className="w-full px-5 py-3 border rounded-lg shadow-sm text-lg"
                />
                {formData.amount && !isNaN(formData.amount) && (
                  <p className="text-center text-gray-600 mt-1">{formatCurrency(formData.amount)}</p>
                )}
              </div>

              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">Số lượng</label>
                <input
                  type="number"
                  name="number"
                  min="1"
                  value={formData.number}
                  onChange={handleChange}
                  required
                  className="w-full px-5 py-3 border rounded-lg shadow-sm text-lg"
                />
              </div>

              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">Ghi chú</label>
                <textarea
                  name="notes"
                  rows="3"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Ghi chú thêm (nếu có)"
                  className="w-full px-5 py-3 border rounded-lg shadow-sm text-lg"
                ></textarea>
              </div>

              <div className="flex justify-between items-center mt-6">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="text-gray-600 hover:text-gray-900 font-medium"
                >
                  ← Quay lại
                </button>

                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-black font-bold py-3 px-8 rounded-full transition transform hover:scale-105"
                >
                  Thêm khoản chi
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Organized Buttons */}
        <div className="flex flex-col md:flex-row md:justify-center items-center gap-4 mt-6">
          <Link
            to={`/room-expense-details/${room_id}`}
            className="px-6 py-3 bg-white text-black rounded-full hover:bg-teal-600 shadow-md transition transform hover:scale-105"
          >
            Xem chi tiết chi tiêu
          </Link>
          {currentUser && currentUser.data.name === 'Loc Nguyen' && (
          <Link
            to={`/send-report/${room_id}`}
            className="px-6 py-3 bg-white text-black rounded-full hover:bg-purple-600 shadow-md transition transform hover:scale-105"
          >
            Gửi email report
          </Link>
        )}

          <button
            onClick={() => navigate('/rooms')}
            className="px-6 py-3 bg-gray-500 text-black rounded-full hover:bg-gray-600 shadow-md transition transform hover:scale-105"
          >
            Quay lại danh sách phòng
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
