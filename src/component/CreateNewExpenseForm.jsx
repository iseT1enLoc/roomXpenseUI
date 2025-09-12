import React, { useEffect, useState } from 'react'
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
	const [errors, setErrors] = useState({})

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
			setErrors({})
		}
	}, [open, setFormData])

	const handleChange = (e) => {
		const { name, value } = e.target
		setFormData((prev) => ({ ...prev, [name]: value }))
		setErrors((prev) => ({ ...prev, [name]: '' }))
	}

	const validateForm = () => {
		const newErrors = {}
		if (!formData.title) newErrors.title = 'Vui lòng chọn khoản chi'
		if (!formData.amount) newErrors.amount = 'Vui lòng nhập số tiền'
		else if (isNaN(formData.amount)) newErrors.amount = 'Số tiền phải là số'
		if (!formData.usedDate) newErrors.usedDate = 'Vui lòng chọn ngày'

		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
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
						if (validateForm()) {
							handleSubmit()
						}
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
							error={!!errors.title}
							helperText={errors.title}
							placeholder="-- Chọn khoản chi --"
							InputLabelProps={{ required: true }}
						/>
					</div>

					<div>
						<InputTextField
							label="Số tiền"
							name="amount"
							value={formData.amount}
							onChange={handleChange}
							error={!!errors.amount}
							helperText={errors.amount}
							placeholder="Nhập số tiền"
							InputLabelProps={{ required: true }}
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
							onChange={(newValue) => {
								setFormData((prev) => ({ ...prev, usedDate: newValue }))
								setErrors((prev) => ({ ...prev, usedDate: '' }))
							}}
							error={!!errors.usedDate}
							helperText={errors.usedDate}
							fullWidth
							InputLabelProps={{ required: true }}
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
