// export default App;
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import HomePage from "./pages/homepage/Home";
import SuccessPage from "./pages/mainpage/SuccessLoginPage";
import RoomExpenditureDetails from "./pages/RoomExpenditureDetail";
import MemberExpenseDetails from "./pages/MemberExpenseDetails";
import RoomList from "./pages/RoomList";
import SendExpenditurePage from "./pages/email/Email";
import ProtectedRoutes from "./routes/ProtectedRoutes";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage/>}/>
        {/* <Route path="/rooms" element={<RoomList />} /> */}
        <Route element={<ProtectedRoutes/>}>
            <Route path="/" element={<Navigate to="/rooms"/>} />
            <Route path="/room/:room_id" element={<SuccessPage />} />
            <Route path="/rooms" element={<RoomList />} />
            <Route path="/send-report/:room_id" element={<SendExpenditurePage />} />
            <Route path="/room-expense-details/:room_id" element={<RoomExpenditureDetails />} />
            <Route path="/member-expense-details" element={<MemberExpenseDetails />} />
        </Route>
      </Routes>
      
    </BrowserRouter>
  );
}

export default App;