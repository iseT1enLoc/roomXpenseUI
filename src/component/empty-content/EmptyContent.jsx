import React from 'react'
import { styled, alpha } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import LayersClearIcon from '@mui/icons-material/LayersClear'
const RootStyle = styled('div')(({ theme }) => ({
	flexGrow: 1,
	minHeight: '100%',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	padding: theme.spacing(5, 2),
	backgroundColor: alpha(theme.palette.grey[500], 0.04),
	borderRadius: theme.shape.borderRadius * 2,
	border: `1px dashed ${alpha(theme.palette.text.primary, 0.2)}`
}))

export function EmptyContent({
	title = 'Không có dữ liệu!!!',
	description,
	// imgUrl,
	sx
}) {
	return (
		<RootStyle sx={sx}>
			<Box
				sx={{
					maxWidth: 480,
					textAlign: 'center'
				}}
			>
				{/* <Box
					component="img"
					alt="Empty"
					src={imgUrl || '/assets/empty-content.svg'}
					sx={{ height: 160, mx: 'auto', mb: 2 }}
				/> */}
				<Box sx={{ height: 160, mx: 'auto', mb: 2 }}>
					<LayersClearIcon sx={{ fontSize: 150, color: 'text.disabled' }} />
				</Box>

				<Typography variant="h5" paragraph>
					{title}
				</Typography>

				{description && (
					<Typography variant="body2" sx={{ color: 'text.secondary' }}>
						{description}
					</Typography>
				)}
			</Box>
		</RootStyle>
	)
}

export default EmptyContent
