import React from 'react'
import SearchIcon from '@mui/icons-material/Search'
import { Button } from '@mui/material'
export default function ButtonFind({ onClick }) {
	return (
		<Button variant="contained" color="info" onClick={onClick} size="medium">
			<SearchIcon fontSize="large" />
		</Button>
	)
}
