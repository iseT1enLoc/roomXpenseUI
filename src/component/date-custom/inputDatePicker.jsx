import './calenderOverride.css'
import React, { useState } from 'react'
import dayjs from 'dayjs'
import 'dayjs/locale/vi'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { CalendarMonth } from '@mui/icons-material'

dayjs.locale('vi')

export default function InputDatePicker({
	label = 'Chọn ngày',
	value: controlledValue,
	onChange,
	format = 'DD/MM/YYYY',
	views = ['day', 'month', 'year'],
	defaultValue = null,
	size = 'small',
	fullWidth = true,
	required = false,
	minDate,
	maxDate,
	disablePast = false,
	disableFuture = false,
	textFieldProps = {},
	openTo = 'day'
}) {
	const [internalValue, setInternalValue] = useState(
		defaultValue ? dayjs(defaultValue) : null
	)

	const value =
		controlledValue !== undefined
			? controlledValue
				? dayjs(controlledValue) // 🔑 ép controlledValue thành dayjs nếu có
				: null
			: internalValue

	const handleChange = (newValue) => {
		const parsed = newValue ? dayjs(newValue) : null // 🔑 luôn đảm bảo dayjs
		if (controlledValue === undefined) {
			setInternalValue(parsed)
		}
		onChange?.(parsed)
	}

	const handleClear = () => {
		if (controlledValue === undefined) {
			setInternalValue(null)
		}
		onChange?.(null)
	}

	return (
		<LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="vi">
			<DatePicker
				label={label}
				value={value}
				onChange={handleChange}
				format={format}
				views={views}
				maxDate={maxDate ? dayjs(maxDate) : undefined}
				minDate={minDate ? dayjs(minDate) : undefined}
				disablePast={disablePast}
				disableFuture={disableFuture}
				openTo={openTo}
				slots={{
					openPickerIcon: CalendarMonth
				}}
				slotProps={{
					textField: {
						size,
						fullWidth,
						required,
						...textFieldProps,
						sx: {
							'& .MuiOutlinedInput-root': {
								borderRadius: '8px'
							}
						}
					},
					field: {
						clearable: true,
						onClear: handleClear
					}
				}}
			/>
		</LocalizationProvider>
	)
}
