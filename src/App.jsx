// export default App;
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "./app/store"; 
// import { checkAuth } from "./app/authSlice"; // if you want to auto-check token on load

import HomePage from "./pages/homepage/Home";
import SuccessPage from "./pages/mainpage/SuccessLoginPage";
import RoomExpenditureDetails from "./pages/RoomExpenditureDetail";
import MemberExpenseDetails from "./pages/MemberExpenseDetails";
import RoomList from "./pages/RoomList";
import SendExpenditurePage from "./pages/email/Email";

function App() {
  const [isAuthenticated, setAuthenticate] = useState(false)
 
  useEffect(() => {
    const token = localStorage.getItem("oauthstate")
    if(token){
      setAuthenticate(true)
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={isAuthenticated ? <Navigate to="/rooms" /> : <HomePage />}
        />
        <Route path="/room/:room_id" element={<SuccessPage />} />
        <Route path="/rooms" element={<RoomList />} />
        <Route path="/send-report/:room_id" element={isAuthenticated ? <SendExpenditurePage /> : <HomePage />} />
        <Route path="/room-expense-details/:room_id" element={<RoomExpenditureDetails />} />
        <Route path="/member-expense-details" element={<MemberExpenseDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
