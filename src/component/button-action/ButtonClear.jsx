import React from 'react'
import ReplayIcon from '@mui/icons-material/Replay'
import { Button } from '@mui/material'
export default function ButtonClear({ onClick }) {
	return (
		<Button variant="outlined" color="info" onClick={onClick} size="medium">
			<ReplayIcon fontSize="large" />
		</Button>
	)
}
