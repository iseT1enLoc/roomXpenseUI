// export default App;
import './App.css'
import {
	BrowserRouter as Router,
	Routes,
	Route,
	BrowserRouter
} from 'react-router-dom'
import HomePage from './pages/homepage/Home'
import SuccessPage from './pages/mainpage/SuccessLoginPage'
import MemberExpenseDetails from './pages/rooms/MemberExpenseDetails'
import RoomList from './pages/rooms/RoomList'
import SendExpenditurePage from './pages/email/Email'
import ProtectedRoutes from './routes/ProtectedRoutes'
import ExpenseTable from './pages/rooms/RoomExpenditureTable'
import Invitations from './pages/invitations/invitations'
import { Toaster } from 'sonner'
function App() {
	return (
		<>
			<Toaster richColors position="top-right" />
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<HomePage />} />
					<Route path="/rooms" element={<RoomList />} />

					<Route element={<ProtectedRoutes />}>
						<Route path="/room/:room_id/:room_name" element={<SuccessPage />} />
						<Route path="/rooms/invitations" element={<Invitations />} />
						<Route
							path="/send-report/:room_id"
							element={<SendExpenditurePage />}
						/>

						<Route
							path="/member-expense-details"
							element={<MemberExpenseDetails />}
						/>
						<Route
							path="/room-expense-details/:room_id"
							element={<ExpenseTable />}
						/>
					</Route>
					<Route path="*" element={<HomePage />} />
				</Routes>
			</BrowserRouter>
		</>
	)
}

export default App
