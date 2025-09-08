import React, { useState, useEffect } from 'react';
import { Filter, ChevronDown } from 'lucide-react';
import { getMemberExpenseDetails } from '../api/expense';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
const ExpenseTable = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigation = useNavigate();
  const [filters, setFilters] = useState({
    day: '',
    month: '',
    year: '',
    search: ''
  });
  const [sortBy, setSortBy] = useState('used_date');
  const [sortOrder, setSortOrder] = useState('desc');

  // Format currency
  const formatCurrency = (amount) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

  // Format date
  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

  // Fetch expenses from API
  const fetchExpenses = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('oauthstate');
      if (!token) throw new Error('Token không hợp lệ');

      const data = await getMemberExpenseDetails(token, {
        year: filters.year,
        month: filters.month,
        day: filters.day,
        search: filters.search
      });

      setExpenses(Array.isArray(data) ? data : data?.data || []);
    } catch (err) {
      setError(err.message || 'Đã xảy ra lỗi');
      setExpenses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [filters]);

  const handleFilterChange = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }));
  const clearFilters = () => setFilters({ day: '', month: '', year: '', search: '' });

  const handleSort = (column) => {
    if (sortBy === column) setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const monthNames = [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
  ];

  // Extract unique years, months, days from current expenses
  const filterOptions = {
    years: [...new Set(expenses.map(e => new Date(e.used_date).getFullYear()))].sort((a, b) => b - a),
    months: [...new Set(expenses.map(e => new Date(e.used_date).getMonth() + 1))].sort((a, b) => a - b),
    days: [...new Set(expenses.map(e => new Date(e.used_date).getDate()))].sort((a, b) => a - b)
  };

  // Sort client-side
  const sortedExpenses = [...expenses].sort((a, b) => {
    const aValue =
      sortBy === 'amount' ? a[sortBy] :
      sortBy === 'used_date' ? new Date(a[sortBy]) :
      a[sortBy]?.toString().toLowerCase() || '';

    const bValue =
      sortBy === 'amount' ? b[sortBy] :
      sortBy === 'used_date' ? new Date(b[sortBy]) :
      b[sortBy]?.toString().toLowerCase() || '';

    if (sortOrder === 'asc') return aValue > bValue ? 1 : -1;
    return aValue < bValue ? 1 : -1;
  });


    // Member summary with id
    const memberSummary = sortedExpenses.reduce((acc, expense) => {
    if (!acc[expense.username]) {
        acc[expense.username] = {
        id: expense.user_id,  // assuming your expense object has `user_id`
        total: 0
        };
    }
    acc[expense.username].total += expense.amount || 0;
    return acc;
    }, {});


  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-white to-teal-100 bg-cover p-6">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigation(-1)}
          className="absolute top-4 left-4 flex items-center text-green-700 hover:text-green-900"
        >
          <ArrowLeft className="mr-2" />
          <span className="font-medium">Quay lại</span>
        </button>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý Chi phí</h1>
          <p className="text-gray-600">Theo dõi và quản lý các khoản chi tiêu của phòng</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-semibold text-gray-900">Bộ lọc</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Year */}
            <div className="relative">
              <select
                value={filters.year}
                onChange={(e) => handleFilterChange('year', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none bg-white transition-all duration-200"
              >
                <option value="">Tất cả năm</option>
                {filterOptions.years.map(year => <option key={year} value={year}>{year}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>
            {/* Month */}
            <div className="relative">
              <select
                value={filters.month}
                onChange={(e) => handleFilterChange('month', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none bg-white transition-all duration-200"
              >
                <option value="">Tất cả tháng</option>
                {filterOptions.months.map(month => <option key={month} value={month}>{monthNames[month - 1]}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>
            {/* Day */}
            <div className="relative">
              <select
                value={filters.day}
                onChange={(e) => handleFilterChange('day', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none bg-white transition-all duration-200"
              >
                <option value="">Tất cả ngày</option>
                {filterOptions.days.map(day => <option key={day} value={day}>Ngày {day}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>
            {/* Clear */}
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg border border-gray-300 transition-all duration-200"
            >
              Xóa bộ lọc
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {Object.entries(memberSummary).map(([username, info]) => (
            <Link
            to={`/member-expense-details?member_id=${info.id}&name=${username}`}
            key={info.id}
            className="flex justify-between items-center p-4 bg-white rounded-xl shadow-lg border border-gray-100 hover:bg-gray-50 transition cursor-pointer no-underline"
            >
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                {username.charAt(0).toUpperCase()}
                </div>
                <div>
                <p className="text-sm text-gray-600">{username}</p>
                <p className="text-xl font-bold text-gray-900">{formatCurrency(info.total)}</p>
                </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
            </Link>
        ))}
        </div>


        {/* Table */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full table-auto border-collapse">
                <thead className="bg-gray-100 border-b border-gray-200">
                    <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider cursor-pointer">
                        Tiêu đề
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider cursor-pointer">
                        Người tạo
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 uppercase tracking-wider cursor-pointer">
                        Số lượng
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700 uppercase tracking-wider cursor-pointer">
                        Số tiền
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                        Ghi chú
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-gray-700 uppercase tracking-wider cursor-pointer">
                        Ngày dùng khoản chi tiêu này
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider cursor-pointer">
                        Ngày tạo
                    </th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                    <tr>
                        <td colSpan="6" className="text-center py-6 text-gray-500">
                        Loading...
                        </td>
                    </tr>
                    ) : error ? (
                    <tr>
                        <td colSpan="6" className="text-center py-6 text-red-600">
                        {error}
                        </td>
                    </tr>
                    ) : sortedExpenses.length === 0 ? (
                    <tr>
                        <td colSpan="6" className="text-center py-6 text-gray-500">
                        Không có dữ liệu
                        </td>
                    </tr>
                    ) : (
                    sortedExpenses.map((expense, index) => (
                        <tr
                        key={expense.id}
                        className={`${
                            index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                        } hover:bg-indigo-50 transition-colors duration-200`}
                        >
                        <td className="px-4 py-3 text-sm text-gray-700">{expense.title}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{expense.username}</td>
                        <td className="px-4 py-3 text-center text-sm text-gray-700">{expense.quantity}</td>
                        <td className="px-4 py-3 text-right text-sm font-medium text-gray-900">
                            {formatCurrency(expense.amount)}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">{expense.notes}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{formatDate(expense.used_date)}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{formatDate(expense.created_at)}</td>
                        </tr>
                    ))
                    )}
                </tbody>
                </table>
            </div>
            </div>
      </div>
    </div>
  );
};

export default ExpenseTable;
