import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const MemberExpenseDetails = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const member_id = searchParams.get('member_id');

    const member_name = searchParams.get('name');
    const navigate = useNavigate();
    const [memberExpenses, setMemberExpenses] = useState([]);
    const [selectedYear, setSelectedYear] = useState('2025');
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedDay, setSelectedDay] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    const room_id = import.meta.env.VITE_ROOM_ID;
    const baseUrl = `${import.meta.env.VITE_BACKEND_URL}/api/protected/expense/member`;

    const formatCurrency = (amount) => {
      const num = parseInt(amount, 10);
      if (isNaN(num)) return '';
      if (num >= 1_000_000) return `${num / 1_000_000} triệu đồng`;
      if (num >= 1_000) return `${num / 1_000} ngàn đồng`;
      return `${num} đồng`;
    };

    const formatDate = (dateStr) => {
      const date = new Date(dateStr);
      return date.toLocaleString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    };

    useEffect(() => {
      const fetchMemberExpense = async () => {
        const token = localStorage.getItem('oauthstate');
        if (!token) {
          setError('Token không hợp lệ.');
          setLoading(false);
          return;
        }

        const params = {
          user_id: member_id,
          room_id,
          year: selectedYear,
        };
        if (selectedMonth) params.month = selectedMonth;
        if (selectedDay) params.day = selectedDay;

        try {
          const res = await axios.get(baseUrl, {
            params,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (res.data.status === 'success') {
            setMemberExpenses(res.data.data);
          } else {
            setError('Không thể lấy dữ liệu chi tiết.');
          }
        } catch (err) {
          console.error(err);
          setError('Lỗi khi tải dữ liệu.');
        } finally {
          setLoading(false);
        }
      };

      if (member_id) {
        fetchMemberExpense();
      } else {
        setError('Không có mã thành viên.');
        setLoading(false);
      }
    }, [member_id, room_id, selectedYear, selectedMonth, selectedDay]);

    const handleBack = () => {
      navigate(-1);
    };

    return (
      <div className="w-screen h-screen bg-gradient-to-br from-green-100 via-white to-teal-100 bg-cover flex items-center justify-center px-6 py-12">
        <div className="w-screen max-w-3xl bg-white rounded-xl shadow-xl p-8 space-y-8 relative">
          {/* Back Button */}
          <button
            onClick={handleBack}
            className="absolute top-4 left-4 flex items-center text-green-700 hover:text-green-900"
          >
            <ArrowLeft className="mr-2" />
            <span className="font-medium">Quay lại</span>
          </button>

          <motion.h1
            className="text-3xl font-bold text-center text-green-800"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            {member_name}
          </motion.h1>

          {loading && <p className="text-center text-gray-500">Đang tải dữ liệu...</p>}
          {error && <p className="text-red-500 text-center">{error}</p>}

          {/* Filter Section */}
          <div className="flex justify-center space-x-4 mb-8">
            <div>
              <label htmlFor="year" className="block text-lg font-medium text-gray-700">Năm</label>
              <select
                id="year"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg shadow-sm"
              >
                <option value="2025">2025</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
              </select>
            </div>

            <div>
              <label htmlFor="month" className="block text-lg font-medium text-gray-700">Tháng</label>
              <select
                id="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg shadow-sm"
              >
                <option value="">Chọn tháng</option>
                {[...Array(12)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>Tháng {i + 1}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="day" className="block text-lg font-medium text-gray-700">Ngày</label>
              <select
                id="day"
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg shadow-sm"
              >
                <option value="">Chọn ngày</option>
                {[...Array(31)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}</option>
                ))}
              </select>
            </div>
          </div>

          {Array.isArray(memberExpenses) && memberExpenses.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              {memberExpenses.map((expense, index) => (
                <div
                  key={index}
                  className="flex flex-col space-y-2 p-4 bg-gray-50 rounded-xl shadow hover:shadow-md transition duration-200"
                >
                  <p className="text-lg font-semibold text-gray-800">{expense.title}</p>
                  <p className="text-md text-gray-600">Số tiền: <span className="font-medium text-green-600">{formatCurrency(expense.amount)}</span></p>
                  <p className="text-sm text-gray-400">Ngày tạo: {formatDate(expense.created_at)}</p>
                </div>
              ))}
            </motion.div>
          ) : (
            !loading && (
              <p className="text-center text-gray-600">Không có dữ liệu chi tiêu.</p>
            )
          )}

          <motion.div
            key="view-expense-details"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center mt-8"
          >
            <Link
              to="/room-expense-details"
              className="px-8 py-4 bg-teal-500 text-white rounded-full hover:bg-teal-600 shadow-lg transform hover:scale-105 transition duration-200 ease-in-out"
            >
              Xem chi tiết chi tiêu phòng
            </Link>
          </motion.div>
        </div>
      </div>
    );
};

export default MemberExpenseDetails;
