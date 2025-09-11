import React from 'react'
import { TextField } from '@mui/material'

export default function InputTextField({
	label,
	value,
	onChange,
	onKeyDown,
	placeholder,
	multiline = false,
	rows,
	...rest
}) {
	return (
		<TextField
			label={label}
			value={value}
			onChange={onChange}
			onKeyDown={onKeyDown}
			placeholder={placeholder}
			fullWidth
			multiline={multiline}
			rows={rows}
			variant="outlined"
			sx={{
				'& .MuiOutlinedInput-root': {
					borderRadius: '8px'
				}
			}}
			{...rest} // cho phép truyền thêm props như disabled, type...
		/>
	)
}
