import React, { useEffect } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Button from '@mui/material/Button'
import InputTextField from './input-action/inputTextField'
import InputDropdown from './input-action/inputDropdown'
import InputDatePicker from './date-custom/inputDatePicker'
export default function ExpenseModal({
	open,
	onClose,
	formData,
	setFormData,
	handleSubmit,
	expenseOptions,
	formatCurrency,
	formatDate
}) {
	const initialFormData = {
		title: '',
		amount: '',
		usedDate: null,
		notes: ''
	}

	// Reset khi modal đóng
	useEffect(() => {
		if (!open) {
			setFormData(initialFormData)
		}
	}, [open, setFormData])

	const handleChange = (e) => {
		const { name, value } = e.target
		setFormData((prev) => ({ ...prev, [name]: value }))
	}

	return (
		<Dialog
			open={open}
			onClose={onClose}
			maxWidth="sm"
			fullWidth
			PaperProps={{
				sx: {
					borderRadius: 3,
					p: 2
				}
			}}
			BackdropProps={{
				sx: {
					background: 'rgba(255, 255, 255, 0.2)', // ✅ greenish transparent overlay
					backdropFilter: 'blur(3px)' // optional blur effect
				}
			}}
		>
			<DialogTitle className="text-green-800 text-center">
				Thêm khoản chi
			</DialogTitle>
			<DialogContent dividers sx={{ maxHeight: '70vh', overflowY: 'auto' }}>
				{/* Form content goes here */}
				<form
					onSubmit={(e) => {
						e.preventDefault()
						handleSubmit()
					}}
					className="space-y-4"
				>
					<div>
						<InputDropdown
							label="Tên khoản chi"
							name="title"
							value={formData.title}
							onChange={handleChange}
							options={expenseOptions}
							required
							placeholder="-- Chọn khoản chi --"
						/>
					</div>

					<div>
						<InputTextField
							label="Số tiền"
							name="amount"
							value={formData.amount}
							onChange={handleChange}
							required
							placeholder="Nhập số tiền"
						/>
						{formData.amount && !isNaN(formData.amount) && (
							<p className="text-gray-600 mt-1">
								{formatCurrency(formData.amount)}
							</p>
						)}
					</div>

					<div>
						<InputDatePicker
							label="Tháng chi tiêu"
							value={formData.usedDate}
							views={['month', 'year', 'day']}
							openTo="day"
							onChange={(newValue) =>
								setFormData((prev) => ({ ...prev, usedDate: newValue }))
							}
							required
							fullWidth
						/>
						{formData.usedDate && (
							<p className="text-gray-600 mt-1">
								Ngày chọn: {formatDate(formData.usedDate)}
							</p>
						)}
					</div>

					<div>
						<InputTextField
							label="Ghi Chú"
							name="notes"
							value={formData.notes}
							onChange={handleChange}
							multiline
							rows="3"
							className="w-full px-4 py-2 border rounded-lg"
							placeholder="Ghi chú thêm (nếu có)"
						/>
					</div>

					<div className="flex justify-end mt-4 gap-3">
						<Button onClick={onClose} color="info" variant="outlined">
							Hủy
						</Button>
						<Button type="submit" color="info" variant="contained">
							Thêm khoản chi
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	)
}
