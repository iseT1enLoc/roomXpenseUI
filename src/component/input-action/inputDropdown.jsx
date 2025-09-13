import React from 'react'
import { TextField, MenuItem } from '@mui/material'

export default function InputDropdown({
	label,
	name,
	value,
	onChange,
	options = [],
	required = false,
	placeholder = '-- Chọn --',
	className = '',
	fullWidth = true,
	size = 'medium',
	variant = 'outlined',
	...rest
}) {
	return (
		<TextField
			select
			label={label}
			name={name}
			value={value}
			onChange={onChange}
			required={required}
			fullWidth={fullWidth}
			size={size}
			variant={variant}
			className={className}
			sx={{
				'& .MuiOutlinedInput-root': {
					borderRadius: '8px'
				}
			}}
			{...rest}
		>
			<MenuItem value="">{placeholder}</MenuItem>
			{options.map((option, idx) => {
				// option có thể là string hoặc object { label, value }
				const optValue = typeof option === 'string' ? option : option.value
				const optLabel = typeof option === 'string' ? option : option.label
				return (
					<MenuItem key={idx} value={optValue}>
						{optLabel}
					</MenuItem>
				)
			})}
		</TextField>
	)
}
