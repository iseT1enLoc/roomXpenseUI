import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { fetchCurrentUser } from '../../api/user'
import { addExpense } from '../../api/expense'
import Button from '@mui/material/Button'
import BackButton from '../../component/BackButton'
import ExpenseModal from '../../component/CreateNewExpenseForm'
import { toast } from 'sonner'
import SendInvitationModal from '../invitations/invitationForm'
const expenseOptions = [
	'Thùng nước',
	'Tiền điện',
	'Nước rửa chén',
	'Chai Vim',
	'Khác'
]

const SuccessPage = () => {
	const { room_id, room_name } = useParams()
	const location = useLocation()
	const navigate = useNavigate()
	const [formData, setFormData] = useState({
		title: '',
		amount: '',
		number: 1,
		notes: '',
		usedDate: new Date()
	})
	const [currentUser, setCurrentUser] = useState(null)
	const [error, setError] = useState('')
	const [successMessage, setSuccessMessage] = useState('')
	const [showForm, setShowForm] = useState(false)
	const [openInvite, setOpenInvite] = useState(false)
	useEffect(() => {
		const getUser = async () => {
			const queryParams = new URLSearchParams(location.search)
			const urlToken = queryParams.get('token')
			const storedToken = localStorage.getItem('oauthstate')

			if (urlToken && !storedToken) {
				localStorage.setItem('oauthstate', urlToken)
				navigate(location.pathname, { replace: true })
				return
			}

			const tokenToUse = storedToken || urlToken
			if (!tokenToUse) {
				navigate('/', { replace: true })
				return
			}

			try {
				const userData = await fetchCurrentUser(tokenToUse)
				setCurrentUser(userData)
			} catch (err) {
				if (err.message === 'Unauthorized') {
					navigate('/', { replace: true })
				} else {
					setError(err.message)
				}
			}
		}

		getUser()
	}, [location, navigate])

	const formatCurrency = (amount) => {
		const num = parseInt(amount, 10)
		if (isNaN(num)) return ''
		if (num >= 1_000_000) return `${num / 1_000_000} triệu đồng`
		if (num >= 1_000) return `${num / 1_000} ngàn đồng`
		return `${num} đồng`
	}

	const handleChange = (e) => {
		const { name, value } = e.target
		setFormData((prev) => ({ ...prev, [name]: value }))
	}

	const formatDate = (date) => {
		if (!date) return ''
		const d = new Date(date)
		const year = d.getFullYear()
		const month = String(d.getMonth() + 1).padStart(2, '0')
		const day = String(d.getDate()).padStart(2, '0')
		return `${day}-${month}-${year}`
	}
	const handleSubmit = async () => {
		const token = localStorage.getItem('oauthstate')

		try {
			console.log(formData.usedDate)
			await addExpense({
				token,
				room_id,
				title: formData.title,
				amount: formData.amount,
				notes: formData.notes,
				used_date: formData.usedDate ? formData.usedDate.toISOString() : null,
				quantity: formData.number
			})
			toast.success('Thêm khoản chi thành công!')
			setSuccessMessage('Thêm khoản chi thành công!')
			setError('')
			setFormData({
				title: '',
				amount: '',
				number: 1,
				notes: '',
				usedDate: new Date()
			})

			setTimeout(() => {
				setSuccessMessage('')
				setShowForm(false)
			}, 200)
		} catch (err) {
			toast.error(err.message || 'Lỗi khi thêm khoản chi. Vui lòng thử lại.')
			setError(err.message || 'Lỗi khi thêm khoản chi. Vui lòng thử lại.')
		}
	}

	return (
		<div className="w-screen h-screen bg-gradient-to-br from-green-100 via-white to-teal-100 flex items-center justify-center">
			<div className="w-full max-w-3xl bg-white rounded-xl shadow-xl p-8 mx-4 space-y-8">
				<BackButton />
				<motion.h1
					className="text-3xl font-bold text-center text-green-800"
					initial={{ opacity: 0, scale: 0.8 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.8 }}
				>
					Tiền phòng {room_name}
				</motion.h1>
				{currentUser && (
					<div className="text-center text-lg">
						<p className="text-gray-700 font-medium">
							Xin chào, {currentUser.data.name}
						</p>
						<p className="text-gray-600">Email: {currentUser.data.email}</p>
					</div>
				)}

				{error && <p className="text-red-500 text-center">{error}</p>}
				{successMessage && (
					<p className="text-green-600 text-center">{successMessage}</p>
				)}
				<div className="text-center mt-6">
					<Button
						variant="contained"
						color="primary"
						size="large"
						onClick={() => setShowForm(true)}
					>
						Thêm khoản chi tiêu
					</Button>
				</div>
				<ExpenseModal
					open={showForm}
					onClose={() => setShowForm(false)}
					formData={formData}
					setFormData={setFormData}
					handleSubmit={handleSubmit}
					expenseOptions={expenseOptions}
					formatCurrency={formatCurrency}
					formatDate={formatDate}
				/>
				{!showForm && (
					<div className="flex flex-col sm:flex-row justify-center items-center gap-3 mt-8">
						<Button
							variant="contained"
							onClick={() => navigate(`/room-expense-details/${room_id}`)}
							color="primary"
						>
							Xem chi tiết chi tiêu
						</Button>

						{currentUser && currentUser.data.name === 'Loc Nguyen' && (
							<Button
								variant="contained"
								onClick={() => navigate(`/send-report/${room_id}`)}
								color="primary"
							>
								Gửi email report
							</Button>
						)}
						<Button
							onClick={() => setOpenInvite(true)}
							variant="contained"
							color="primary"
						>
							Mời thành viên
						</Button>
						<SendInvitationModal
							roomId={room_id}
							open={openInvite}
							onClose={() => setOpenInvite(false)}
						/>
					</div>
				)}
			</div>
			{/* <Toaster position="top-right" /> */}
		</div>
	)
}

export default SuccessPage
