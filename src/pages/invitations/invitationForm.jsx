import React, { useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import { sendRoomInvitation } from '../../api/invitation'
import { toast } from 'sonner'
import { TextField } from '@mui/material'
import InputTextField from '../../component/input-action/inputTextField'
export default function SendInvitationModal({ roomId, open, onClose }) {
	const [emails, setEmails] = useState([]) // store as array
	const [inputValue, setInputValue] = useState('') // current input
	const [message, setMessage] = useState('')
	const [loading, setLoading] = useState(false)
	// const [error, setError] = useState(null)

	const handleAddEmail = (value) => {
		const email = value.trim()
		if (email && !emails.includes(email)) {
			setEmails([...emails, email])
		}
	}

	const handleKeyDown = (e) => {
		if (['Enter', ' ', ','].includes(e.key)) {
			e.preventDefault()
			handleAddEmail(inputValue)
			setInputValue('')
		} else if (e.key === 'Backspace' && !inputValue && emails.length) {
			// remove last email if input empty
			setEmails(emails.slice(0, -1))
		}
	}
	const handleClose = () => {
		setEmails([])
		setInputValue('')
		setMessage('')
		// setError(null)
		onClose()
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		setLoading(true)

		const token = localStorage.getItem('oauthstate')
		try {
			await sendRoomInvitation({
				room_id: roomId,
				emails,
				message,
				token
			})

			toast.success('Lời mời đã được gửi thành công')
			handleClose()
		} catch (err) {
			// setError('Lỗi xảy ra khi gửi lời mời: ' + err.message)
			toast.error('Lỗi xảy ra khi gửi lời mời: ' + err.message)
		} finally {
			setLoading(false)
		}
	}

	return (
		<Dialog
			open={open}
			onClose={handleClose}
			maxWidth="sm"
			fullWidth
			PaperProps={{ sx: { borderRadius: 3, p: 2, backgroundColor: '#fff' } }}
			BackdropProps={{
				sx: { backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(3px)' }
			}}
		>
			<DialogTitle className="text-center text-green-800 font-semibold">
				Mời thành viên vào phòng
			</DialogTitle>
			<DialogContent dividers sx={{ maxHeight: '70vh', overflowY: 'auto' }}>
				{/* {success && <p className="text-green-600 mb-2">{success}</p>} */}
				{/* {error && <p className="text-red-600 mb-2">{error}</p>} */}

				<form onSubmit={handleSubmit} className="space-y-4 px-2 sm:px-4">
					{/* Email list */}
					<div>
						<label className="block text-sm font-medium mb-1">
							*Email thành viên (điều kiện là người được mời đã login hệ thống)
						</label>
						<div className="flex flex-wrap gap-2 mb-2">
							{emails.map((email, idx) => (
								<Chip
									key={idx}
									label={email}
									onDelete={() => setEmails(emails.filter((e, i) => i !== idx))}
									color="primary"
								/>
							))}
						</div>
						{/* <input
							type="text"
							value={inputValue}
							onChange={(e) => setInputValue(e.target.value)}
							onKeyDown={handleKeyDown}
							className="w-full border rounded-lg p-2"
							placeholder="Nhập email và nhấn Space / Enter / ,"
						/> */}
						<InputTextField
							label="Nhập email"
							value={inputValue}
							onChange={(e) => setInputValue(e.target.value)}
							onKeyDown={handleKeyDown}
							placeholder="Nhấn Space or Enter sau khi nhập email"
						/>
					</div>

					{/* Message */}
					<div>
						{/* <label className="block text-sm font-medium mb-1">Lời nhắn</label>
						<textarea
							value={message}
							onChange={(e) => setMessage(e.target.value)}
							className="w-full border rounded-lg p-2"
							placeholder="Mời bạn vào phòng..."
							rows={3}
						/> */}
						<InputTextField
							label="Lời nhắn"
							value={message}
							onChange={(e) => setMessage(e.target.value)}
							placeholder="Mời bạn vào phòng..."
							fullWidth
							multiline
							rows={3}
							variant="outlined"
						/>
					</div>

					<div className="flex justify-end mt-4 gap-3">
						<Button onClick={handleClose} color="info" variant="outlined">
							Hủy
						</Button>
						<Button
							type="submit"
							color="info"
							variant="contained"
							disabled={loading || !emails.length}
						>
							{loading ? 'Đang gửi...' : 'Gửi lời mời'}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	)
}
