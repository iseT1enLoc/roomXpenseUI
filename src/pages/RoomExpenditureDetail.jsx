import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const RoomExpenditureDetails = () => {
  const [expensesData, setExpensesData] = useState(null);
  const [selectedYear, setSelectedYear] = useState('2025');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const room_id = import.meta.env.VITE_ROOM_ID
  const baseUrl = `${import.meta.env.VITE_BACKEND_URL}/api/protected/expense/calc`;

  const formatCurrency = (amount) => {
    const num = parseInt(amount, 10);
    if (isNaN(num)) return '';
    if (num >= 1_000_000) return `${num / 1_000_000} triệu đồng`;
    if (num >= 1_000) return `${num / 1_000} ngàn đồng`;
    return `${num} đồng`;
  };

  useEffect(() => {
    const fetchExpenses = async () => {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('token');
  
      if (!token) {
        setError('Không có token xác thực. Vui lòng đăng nhập lại.');
        setLoading(false);
        return;
      }
  
      // Build the params object dynamically
      const params = {
        room_id,
        year: selectedYear,
      };
  
      // Only add month if it's not empty
      if (selectedMonth) {
        params.month = selectedMonth;
      }
  
      // Only add day if it's not empty
      if (selectedDay) {
        params.day = selectedDay;
      }
  
      try {
        const response = await axios.get(baseUrl, {
          params,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (response.data.status === 'success') {
          setExpensesData(response.data.data);
        } else {
          setError('Không thể lấy dữ liệu chi tiêu phòng.');
        }
      } catch (err) {
        console.error(err);
        setError('Lỗi khi tải dữ liệu chi tiêu.');
      } finally {
        setLoading(false);
      }
    };
  
    fetchExpenses();
  }, [selectedYear, selectedMonth, selectedDay]);
  
  return (
    <div className="w-screen h-screen bg-gradient-to-br from-green-100 via-white to-teal-100 bg-cover flex items-center justify-center px-6 py-12">
      <div className="w-screen max-w-3xl bg-white rounded-xl shadow-xl p-8 space-y-8 relative">

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
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
          Chi Tiêu Phòng 703
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

        {/* Expenses Data */}
        {expensesData && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-8"
            >
              <p className="text-xl font-semibold">Tổng chi tiêu phòng: {formatCurrency(expensesData.room_total_expense)}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-semibold text-green-800 mb-4">Chi Tiêu Của Các Thành Viên</h2>
              <div className="space-y-4">
                {expensesData.member_stat.map((member, index) => (
                  <div key={index} className="flex justify-between items-center p-4 bg-gray-100 rounded-lg">
                    <p className="text-lg font-medium">{member.Member_name}</p>
                    <p className="text-lg">{formatCurrency(member.Money)}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};

export default RoomExpenditureDetails;
