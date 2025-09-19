import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Calendar, DollarSign, Clock, Search, Filter } from 'lucide-react';
import { getMemberExpenseDetails, getOneMemberExpense } from '../../api/expense';
import LoadingComponent from '../../component/LoadingIcon';
import MRTCustom from '../../component/table-custom/MRTCustom';
import InputDatePicker from '../../component/date-custom/inputDatePicker'
import ButtonClear from '../../component/button-action/ButtonClear'
import ButtonFind from '../../component/button-action/ButtonFind'
import { toast } from 'sonner'

const MemberExpenseDetails = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const user_id = searchParams.get('member_id');
  const member_name = searchParams.get('name');
  const room_id = searchParams.get("room_id")
  
  const navigate = useNavigate();

  const [memberExpenses, setMemberExpenses] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [total,setTotal] = useState(0);
  const baseUrl = `${import.meta.env.VITE_BACKEND_URL}/api/protected/expense/member`;

	const formatCurrency = (amount) =>
		new Intl.NumberFormat('vi-VN', {
			style: 'currency',
			currency: 'VND'
		}).format(amount)
    
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
  const [filters, setFilters] = useState({
    start_date: null,
    end_date: null,
  })
  const [expenses,setExpense] = useState([])

  // Filter expenses based on search term
  const filteredExpenses = memberExpenses.filter(expense =>
    expense.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate total amount
  const totalAmount = expenses.reduce((sum, expense) => sum + parseInt(expense.amount || 0, 10), 0);
  const [pagination,setPagination] = useState({
    pageIndex:0,
    pageSize:20
  })
 

  const fetchMemberExpense = async (customFilters = filters) => {
      const token = localStorage.getItem('oauthstate');
      if (!token) {
        setError('Token không hợp lệ.');
        setLoading(false);
        return;
      }
			const params = {
				room_id,
        user_id,
				start_date: customFilters.start_date
					? customFilters.start_date.format('DD/MM/YYYY')
					: undefined,
				end_date: customFilters.end_date
					? customFilters.end_date.format('DD/MM/YYYY')
					: undefined,
				page:pagination.pageIndex,
				size:pagination.pageSize
			}
      try {
        const res = await getOneMemberExpense(token,params)
        if (res.status === 'success') {
          // setMemberExpenses(res.data.data);
          setExpense(Array.isArray(res) ? res : res?.data.expenses || [])
          setTotal(res.data.total)
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
  const clearFilters = () => {
		const cleared = { start_date: null, end_date: null }
		setFilters(cleared)
    fetchMemberExpense(cleared);
	}
  useEffect(() => {
    if (user_id) {
      fetchMemberExpense(filters);
    } else {
      setError('Không có mã thành viên.');
      setLoading(false);
    }
  }, [user_id, room_id,pagination]);

  const handleBack = () => {
    navigate(-1);
  };
	const columns = [
		{
			accessorKey: 'title',
			header: 'Tiêu đề',
			Cell: ({ row }) => (
				<span className="px-4 py-3 text-sm text-gray-700 ">
					{row.original.title}
				</span>
			)
		},
		// {
		// 	accessorKey: 'username',
		// 	header: 'Người tạo',
		// 	Cell: ({ row }) => (
		// 		<span className="px-4 py-3 text-sm text-gray-700">
		// 			{row.original.username}
		// 		</span>
		// 	)
		// },
		{
			accessorKey: 'amount',
			header: 'Số tiền',
			Cell: ({ row }) => (
				<span className="px-4 py-3 text-right text-base font-bold text-gray-900">
					{formatCurrency(row.original.amount)}
				</span>
			)
		},
		{
			accessorKey: 'notes',
			header: 'Ghi chú',
			Cell: ({ row }) => (
				<span className="px-4 py-3 text-sm text-gray-700">
					{row.original.notes}
				</span>
			)
		},
		{
			accessorKey: 'used_date',
			header: 'Ngày dùng',
			Cell: ({ row }) => (
				<span className="px-4 py-3 text-sm text-gray-700">
					{formatDate(row.original.used_date)}
				</span>
			)
		},
		{
			accessorKey: 'created_at',
			header: 'Ngày tạo',
			Cell: ({ row }) => (
				<span className="px-4 py-3 text-sm text-gray-700">
					{formatDate(row.original.created_at)}
				</span>
			)
		}
	]
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-teal-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBack}
                className="flex items-center text-green-700 hover:text-green-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                <span className="font-medium">Quay lại</span>
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-green-800">
                  {member_name}
                </h1>
              </div>
            </div>
            
            <div className="hidden md:flex items-center bg-green-50 rounded-lg px-4 py-2">
              <DollarSign className="w-5 h-5 text-green-600 mr-2" />
              <div className="text-right">
                <p className="text-xs text-gray-600">Tổng chi tiêu</p>
                <p className="text-lg font-bold text-green-700">{formatCurrency(totalAmount)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="md:hidden mb-4 bg-green-50 rounded-lg p-4">
          <div className="flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-green-600 mr-2" />
            <div className="text-center">
              <p className="text-sm text-gray-600">Tổng chi tiêu</p>
              {/* <p className="text-xl font-bold text-green-700">{formatCurrency(totalAmount)}</p> */}
            </div>
          </div>
        </div>

        {/* <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"> */}
            {/* <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Tìm kiếm chi tiêu..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div> */}

            {/* <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Filter className="w-4 h-4 mr-2" />
                Bộ lọc
              </button>

              <div className="hidden lg:flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500"
                  >
                    <option value="2025">2025</option>
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                  </select>
                </div>

                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Tất cả tháng</option>
                  {[...Array(12)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>Tháng {i + 1}</option>
                  ))}
                </select>

                <select
                  value={selectedDay}
                  onChange={(e) => setSelectedDay(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Tất cả ngày</option>
                  {[...Array(31)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>Ngày {i + 1}</option>
                  ))}
                </select>
              </div>
            </div> */}
          {/* </div> */}
          {/* {showFilters && (
            <div className="lg:hidden mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Năm</label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="2025">2025</option>
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Tháng</label>
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="">Tất cả</option>
                    {[...Array(12)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>Tháng {i + 1}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Ngày</label>
                  <select
                    value={selectedDay}
                    onChange={(e) => setSelectedDay(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="">Tất cả</option>
                    {[...Array(31)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>Ngày {i + 1}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )} */}
        {/* </div> */}

        {/* Loading and Error States */}
        {loading && (
          <LoadingComponent message={"Đang tải dữ liệu..."}/>
        )}
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700 text-center">{error}</p>
          </div>
        )}

				<div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-6">
					<div className="flex items-center gap-2 mb-4">
						<Filter className="w-5 h-5 text-indigo-600" />
						<h2 className="text-lg font-semibold text-gray-900">Bộ lọc</h2>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						{/* Start Date */}
						<InputDatePicker
							label="Từ ngày"
							value={filters.start_date}
							views={['month', 'year', 'day']}
							openTo="day"
							onChange={(date) =>
								setFilters((prev) => ({ ...prev, start_date: date }))
							}
						/>
						{/* End Date */}
						<InputDatePicker
							label="Đến ngày"
							value={filters.end_date}
							views={['month', 'year', 'day']}
							openTo="day"
							onChange={(date) =>
								setFilters((prev) => ({ ...prev, end_date: date }))
							}
							minDate={filters.start_date}
							disabled={!filters.start_date}
						/>
						<div className="flex gap-4 mt-1">
							<div>
								<ButtonFind
									onClick={() => {
										if (!filters.start_date) {
											toast.error('Vui lòng chọn "Từ ngày" trước khi tìm kiếm!')
											return
										}
										fetchMemberExpense(filters);
										toast.success('Tìm kiếm thành công')
									}}
									className="w-full md:w-auto px-3 py-1.5 text-sm"
								/>
							</div>
							<div>
								<ButtonClear
									onClick={clearFilters}
									className="w-full md:w-auto px-3 py-1.5 text-sm"
								/>
							</div>
						</div>
					</div>
				</div>
        <MRTCustom
          columns={columns}
          data={expenses}
          isLoading={loading}
          pagination={pagination}
          onPaginationChange={setPagination}
          rowCount={total}
        />


        {/* Expense List */}
        {/* {!loading && !error && (
          <>
            {filteredExpenses.length > 0 ? (
              <> */}
                {/* Results Count */}
                {/* <div className="mb-4">
                  <p className="text-sm text-gray-600">
                    Hiển thị {filteredExpenses.length} kết quả
                    {searchTerm && ` cho "${searchTerm}"`}
                  </p>
                </div> */}
                
                {/* Desktop Table View */}
                {/* <div className="hidden md:block bg-white rounded-xl shadow-sm border overflow-hidden mb-6">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Chi tiêu
                        </th>
                        <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Số tiền
                        </th>
                        <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ngày tạo
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredExpenses.map((expense, index) => (
                        <tr key={index} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">
                              {expense.title}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <span className="text-lg font-semibold text-green-600">
                              {formatCurrency(expense.amount)}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right text-sm text-gray-500">
                            {formatDate(expense.created_at)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div> */}

                {/* <div className="md:hidden space-y-3 mb-6">
                  {filteredExpenses.map((expense, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-lg shadow-sm border p-4"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-gray-900 truncate">
                            {expense.title}
                          </h3>
                          <div className="mt-2 flex items-center text-xs text-gray-500">
                            <Clock className="w-3 h-3 mr-1" />
                            {formatDate(expense.created_at)}
                          </div>
                        </div>
                        <div className="ml-4 flex-shrink-0 text-right">
                          <span className="text-lg font-semibold text-green-600">
                            {formatCurrency(expense.amount)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <DollarSign className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm ? 'Không tìm thấy kết quả' : 'Không có dữ liệu chi tiêu'}
                </h3>
                <p className="text-gray-500">
                  {searchTerm 
                    ? `Không có kết quả nào khớp với "${searchTerm}"`
                    : 'Chưa có dữ liệu chi tiêu trong thời gian được chọn.'
                  }
                </p>
              </div>
            )}
          </>
        )} */}
      </div>
    </div>
  );
};

export default MemberExpenseDetails;