import React from 'react'

import { Button, CircularProgress } from '@mui/material'

interface Props {
	onClick?: () => void
	loading?: boolean
	title?: string
	sx?: any
}

export default function ButtonAdd({
	onClick,
	loading,
	title = 'Thêm mới',
	sx
}: Props) {
	return (
		<Button
			variant="contained"
			startIcon={
				loading ? <CircularProgress size={20} color="inherit" /> : null
			}
			onClick={onClick}
			disabled={loading}
			color="info"
			sx={sx}
		>
			{title}
		</Button>
	)
}
