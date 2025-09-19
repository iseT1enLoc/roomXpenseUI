import React, { useState, useEffect } from 'react'
import { Filter, ChevronDown, ChevronRight } from 'lucide-react'
import { getMemberExpenseDetailsV2 } from '../../api/expense'
import { useParams, Link } from 'react-router-dom'
import BackButton from '../../component/BackButton'
import InputDatePicker from '../../component/date-custom/inputDatePicker'
import ButtonClear from '../../component/button-action/ButtonClear'
import ButtonFind from '../../component/button-action/ButtonFind'
import { toast } from 'sonner'
import MRTCustom from '../../component/table-custom/MRTCustom'
const ExpenseTable = () => {
	const [expenses, setExpenses] = useState([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')
	const [filters, setFilters] = useState({
		start_date: null,
		end_date: null,
	})
	const [sortBy, setSortBy] = useState('used_date')
	const [sortOrder, setSortOrder] = useState('desc')
	const { room_id } = useParams()
	const [pagination,setPagination] = useState({
		pageIndex:0,
		pageSize:50
	})
	const [total,setTotal] = useState(0)
	// Format currency
	const formatCurrency = (amount) =>
		new Intl.NumberFormat('vi-VN', {
			style: 'currency',
			currency: 'VND'
		}).format(amount)

	// Format date
	const formatDate = (dateString) =>
		new Date(dateString).toLocaleDateString('vi-VN', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		})

	// Fetch expenses
	const fetchExpenses = async (customFilters = filters) => {
		setLoading(true)
		setError('')
		try {
			const token = localStorage.getItem('oauthstate')
			if (!token) throw new Error('Token không hợp lệ')
			console.log(pagination.pageIndex)
			console.log(pagination.pageSize)
			const params = {
				room_id,
				start_date: customFilters.start_date
					? customFilters.start_date.format('DD/MM/YYYY')
					: undefined,
				end_date: customFilters.end_date
					? customFilters.end_date.format('DD/MM/YYYY')
					: undefined,
				page:pagination.pageIndex,
				size:pagination.pageSize
			}

			const data = await getMemberExpenseDetailsV2(token, params)
			setTotal(data?.data?.total || 0)
			setExpenses(Array.isArray(data) ? data : data?.data.expenses || [])
		} catch (err) {
			setError(err.message || 'Đã xảy ra lỗi')
			setExpenses([])
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		console.log("Enter fetching pagination")
		fetchExpenses(filters)
	}, [room_id,pagination])

	const clearFilters = () => {
		const cleared = { start_date: null, end_date: null }
		setFilters(cleared)
		fetchExpenses(cleared)
	}

	// Sort client-side
	const sortedExpenses = [...expenses].sort((a, b) => {
		const aValue =
			sortBy === 'amount'
				? a[sortBy]
				: sortBy === 'used_date'
				? new Date(a[sortBy])
				: a[sortBy]?.toString().toLowerCase() || ''

		const bValue =
			sortBy === 'amount'
				? b[sortBy]
				: sortBy === 'used_date'
				? new Date(b[sortBy])
				: b[sortBy]?.toString().toLowerCase() || ''

		if (sortOrder === 'asc') return aValue > bValue ? 1 : -1
		return aValue < bValue ? 1 : -1
	})

	// Member summary
	const memberSummary = sortedExpenses.reduce((acc, expense) => {
		if (!acc[expense.username]) {
			acc[expense.username] = {
				id: expense.user_id,
				total: 0
			}
		}
		acc[expense.username].total += expense.amount || 0
		return acc
	}, {})

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
		{
			accessorKey: 'username',
			header: 'Người tạo',
			Cell: ({ row }) => (
				<span className="px-4 py-3 text-sm text-gray-700">
					{row.original.username}
				</span>
			)
		},
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
		<div className="min-h-screen bg-gradient-to-br from-green-100 via-white to-teal-100 bg-cover p-6">
			<div className="max-w-7xl mx-auto">
				<BackButton />
				{/* Header */}
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900 mb-2">
						Quản lý Chi phí
					</h1>
					<p className="text-gray-600">
						Theo dõi và quản lý các khoản chi tiêu của phòng
					</p>
				</div>

				{/* Filters */}
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
										fetchExpenses(filters)
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

				{/* Card */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
					{Object.entries(memberSummary).map(([username, info]) => (
						<Link
							to={`/member-expense-details?room_id=${room_id}&member_id=${info.id}&name=${username}`}
							key={info.id}
							className="flex justify-between items-center p-4 bg-white rounded-xl shadow-lg border border-gray-100 hover:bg-gray-50 transition cursor-pointer no-underline"
						>
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
									{username.charAt(0).toUpperCase()}
								</div>
								<div>
									<p className="text-sm text-gray-600">{username}</p>
									<p className="text-xl font-bold text-gray-900">
										{formatCurrency(info.total)}
									</p>
								</div>
							</div>
							<ChevronRight className="w-5 h-5 text-gray-400" />
						</Link>
					))}
				</div>
				<MRTCustom
					columns={columns}
					data={expenses}
					isLoading={loading}
					pagination={pagination}
					onPaginationChange={setPagination}
					rowCount={total}
				/>
			</div>
		</div>
	)
}

export default ExpenseTable
