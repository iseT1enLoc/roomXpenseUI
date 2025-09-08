import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { fetchUserExpenses, selectMemStats } from '../../app/expenseSlice';

import { useAppDispatch, useAppSelector } from "../../app/store"; 
import { Button } from '@mui/material';

const RoomExpenditureDetails = () => {
  const expensesData = useSelector(selectMemStats);
  const [selectedYear, setSelectedYear] = useState('2025');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [warning, setWarning] = useState(''); 
  const dispatch = useAppDispatch();
  
  const { room_id } = useParams();
  

  const formatCurrency = (amount) => {
    const num = parseInt(amount, 10);
    if (isNaN(num)) return '';
    if (num >= 1_000_000) return `${num / 1_000_000} triệu đồng`;
    if (num >= 1_000) return `${num / 1_000} ngàn đồng`;
    return `${num} đồng`;
  };

  useEffect(() => {
    const token = localStorage.getItem('oauthstate');

    if (!token) {
      setError('Không có token xác thực. Vui lòng đăng nhập lại.');
      setLoading(false);
      return;
    }

    const params = {
      room_id,
      year: selectedYear,
    };
    if (selectedMonth) params.month = selectedMonth;
    if (selectedDay) params.day = selectedDay;    

    dispatch(fetchUserExpenses({params: params, token: token}))
    setLoading(false);
  }, [selectedDay, selectedMonth, selectedYear]);

  // Handler to validate input for year, month, and day
  const handleYearChange = (e) => {
    const value = e.target.value;
    if (value >= 2023) {
      setSelectedYear(value);
    }
  };

  const handleMonthChange = (e) => {
    const value = e.target.value;
    if (value >= 1 && value <= 12) {
      setSelectedMonth(value);
    }
  };

  const handleDayChange = (e) => {
    const value = e.target.value;
    if (value >= 1 && value <= 31) {
      setSelectedDay(value);
    }
  };

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-green-100 via-white to-teal-100 bg-cover flex items-center justify-center px-6 py-12">
      <div className="w-screen max-w-3xl bg-white rounded-xl shadow-xl p-8 space-y-8 relative">

        {/* Back Button */}
        <Link
          to={`/room/${room_id}`}
          className="absolute top-4 left-4 flex items-center text-green-700 hover:text-green-900"
        >
          <ArrowLeft className="mr-2" />
          <span className="font-medium">Quay lại</span>
        </Link>

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
        {warning && <p className="text-yellow-500 text-center">{warning}</p>} {/* Display warning */}

        {/* Filter Section */}
        <div className="flex justify-center space-x-4 mb-8">
          <div>
            <label htmlFor="year" className="block text-lg font-medium text-gray-700">Năm</label>
            <select
              id="year"
              value={selectedYear}
              onChange={handleYearChange}
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
              onChange={handleMonthChange}
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
              onChange={handleDayChange}
              className="w-full px-4 py-2 border rounded-lg shadow-sm"
            >
              <option value="">Chọn ngày</option>
              {[...Array(31)].map((_, i) => (
                <option key={i + 1} value={i + 1}>{i + 1}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Total Room Expense */}
        {expensesData?.room_total_expense !== undefined && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <p className="text-xl font-semibold">
              Tổng chi tiêu phòng: {formatCurrency(expensesData.room_total_expense)}
            </p>
          </motion.div>
        )}
        <Button onClick={navigation}></Button>
        {Array.isArray(expensesData?.member_stat) && expensesData.member_stat.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-semibold text-green-800 mb-4">Chi Tiêu Của Các Thành Viên</h2>
            <div className="space-y-4">
              {expensesData.member_stat.map((member, index) => (
                <Link
                  to={`/member-expense-details?member_id=${member.Member_Id}&name=${member.Member_name}`}
                  key={index}
                  className="flex justify-between items-center p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition cursor-pointer no-underline"
                >
                  <p className="text-lg font-medium text-gray-800">{member.Member_name}</p>
                  <p className="text-lg text-gray-800">{formatCurrency(member.Money)}</p>
                </Link>
              ))}
            </div>
          </motion.div>
        ) : (
          !loading && (
            <p className="text-center text-gray-600">Không có dữ liệu chi tiêu thành viên.</p>
          )
        )}
      </div>
    </div>
  );
};

export default RoomExpenditureDetails;