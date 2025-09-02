import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import {
  fetchRoomExpenditure,
  clearRoomExpenditure,
  clearRoomExpenditureError,
  selectRoomExpenditure,
  selectRoomExpenditureLoading,
  selectRoomExpenditureError,
} from '../app/expenseSlice';

const RoomExpenditureDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { room_id } = useParams();

  const expensesData = useSelector(selectRoomExpenditure);
  const loading = useSelector(selectRoomExpenditureLoading);
  const error = useSelector(selectRoomExpenditureError);

  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  const [warning, setWarning] = useState('');

  const token = localStorage.getItem('oauthstate');

  // Format currency
  const formatCurrency = (amount) => {
    const num = parseInt(amount, 10);
    if (isNaN(num)) return '';
    if (num >= 1_000_000) return `${num / 1_000_000} triệu đồng`;
    if (num >= 1_000) return `${num / 1_000} ngàn đồng`;
    return `${num} đồng`;
  };

  // Fetch room expenditure whenever filters change
  useEffect(() => {
    if (!token) {
      navigate('/', { replace: true });
      return;
    }

    dispatch(fetchRoomExpenditure({
      room_id,
      year: selectedYear,
      month: selectedMonth || undefined,
      day: selectedDay || undefined,
      token,
    }));
  }, [room_id, selectedYear, selectedMonth, selectedDay, dispatch, navigate, token]);

  // Clear on unmount
  useEffect(() => {
    return () => {
      dispatch(clearRoomExpenditure());
    };
  }, [dispatch]);

  const handleRefresh = () => {
    if (token) {
      dispatch(clearRoomExpenditureError());
      dispatch(fetchRoomExpenditure({
        room_id,
        year: selectedYear,
        month: selectedMonth || undefined,
        day: selectedDay || undefined,
        token,
      }));
    }
  };

  const getDaysInMonth = () => {
    if (!selectedMonth) return 31;
    return new Date(selectedYear, selectedMonth, 0).getDate();
  };

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-green-100 via-white to-teal-100 flex items-center justify-center px-6 py-12">
      <div className="w-screen max-w-4xl bg-white rounded-xl shadow-xl p-8 space-y-8 relative">

        {/* Back button */}
        <Link to={`/room/${room_id}`} className="absolute top-4 left-4 flex items-center text-green-700 hover:text-green-900 transition-colors">
          <ArrowLeft className="mr-2" size={20} />
          <span className="font-medium">Quay lại</span>
        </Link>

        {/* Refresh button */}
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="absolute top-4 right-4 flex items-center text-green-700 hover:text-green-900 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`mr-2 ${loading ? 'animate-spin' : ''}`} size={20} />
          <span className="font-medium">Làm mới</span>
        </button>

        {/* Header */}
        <motion.h1
          className="text-3xl font-bold text-center text-green-800 mt-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          Chi Tiêu Phòng {room_id}
        </motion.h1>

        {/* Warning */}
        {warning && <motion.div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-lg text-center">{warning}</motion.div>}

        {/* Error */}
        {error && (
          <motion.div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center">
            <p>{error}</p>
            <button onClick={handleRefresh} className="mt-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors">Thử lại</button>
          </motion.div>
        )}

        {/* Filters */}
        <div className="bg-gray-50 rounded-lg p-6 flex flex-wrap justify-center gap-4">
          <div className="flex flex-col">
            <label htmlFor="year" className="text-sm font-medium mb-1">Năm</label>
            <select id="year" value={selectedYear} onChange={e => setSelectedYear(e.target.value)}>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label htmlFor="month" className="text-sm font-medium mb-1">Tháng</label>
            <select id="month" value={selectedMonth} onChange={e => { setSelectedMonth(e.target.value); setSelectedDay(''); }}>
              <option value="">Tất cả tháng</option>
              {[...Array(12)].map((_, i) => <option key={i+1} value={i+1}>Tháng {i+1}</option>)}
            </select>
          </div>
          <div className="flex flex-col">
            <label htmlFor="day" className="text-sm font-medium mb-1">Ngày</label>
            <select id="day" value={selectedDay} onChange={e => setSelectedDay(e.target.value)} disabled={!selectedMonth}>
              <option value="">Tất cả ngày</option>
              {[...Array(getDaysInMonth())].map((_, i) => <option key={i+1} value={i+1}>{i+1}</option>)}
            </select>
          </div>
        </div>

        {/* Loading */}
        {loading && <div className="text-center py-12 text-gray-600">Đang tải dữ liệu...</div>}

        {/* Data */}
        {!loading && expensesData && (
          <div className="space-y-6">
            {expensesData.room_total_expense !== undefined && (
              <div className="bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl p-6 text-center">
                <h2 className="text-lg font-medium mb-2">Tổng chi tiêu phòng</h2>
                <p className="text-3xl font-bold">{formatCurrency(expensesData.room_total_expense)}</p>
              </div>
            )}

            {Array.isArray(expensesData.member_stat) && expensesData.member_stat.length > 0 ? (
              <div className="grid gap-4">
                {expensesData.member_stat.map((member) => (
                  <Link
                    key={member.Member_Id}
                    to={`/member-expense-details?member_id=${member.Member_Id}&name=${encodeURIComponent(member.Member_name)}`}
                    className="flex justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100"
                  >
                    <span>{member.Member_name}</span>
                    <span>{formatCurrency(member.Money)}</span>
                  </Link>
                ))}
              </div>
            ) : (
              !loading && <div className="text-center py-12 text-gray-600">Chưa có chi tiêu nào.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomExpenditureDetails;
