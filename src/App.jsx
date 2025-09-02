// import './App.css';
// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import { useDispatch, useSelector } from 'react-redux';
// import { useEffect } from 'react';
// // import { checkAuth } from './app/authSlice'; // Import checkAuth action

// import HomePage from './pages/homepage/Home';
// import SuccessPage from './pages/mainpage/SuccessLoginPage';
// import RoomExpenditureDetails from './pages/RoomExpenditureDetail';
// import TestingMessage from './components/Test';
// import MemberExpenseDetails from './pages/MemberExpenseDetails';
// import RoomList from './pages/RoomList';
// import SendExpenditurePage from './pages/email/Email';

// function App() {
//   const dispatch = useDispatch();
//   const { isAuthenticated } = useSelector(state => state.auth); // Get authentication status from Redux store

//   useEffect(() => {
//     // Check if the user is authenticated when the app loads
//     //dispatch(checkAuth());
//   }, [dispatch]);

//   return (
//     <Router>
//       {/* Your header/navigation can go here */}
//       <Routes>
//         {/* Redirect authenticated users to the SuccessPage */}
//         <Route
//           path="/"
//           element={isAuthenticated ? <Navigate to="/rooms" /> : <HomePage />}
//         />
//         <Route path="/room/:room_id" element={<SuccessPage />} />
//         <Route path="/rooms" element={<RoomList />} />
//         <Route path="/test" element={<TestingMessage />} />
//         <Route path="/send-report/:room_id" element={<SendExpenditurePage/>} />
//         <Route path="/room-expense-details/:room_id" element={<RoomExpenditureDetails />} />
//         <Route path="/member-expense-details" element={<MemberExpenseDetails />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./app/store"; 
// import { checkAuth } from "./app/authSlice"; // if you want to auto-check token on load

import HomePage from "./pages/homepage/Home";
import SuccessPage from "./pages/mainpage/SuccessLoginPage";
import RoomExpenditureDetails from "./pages/RoomExpenditureDetail";
import TestingMessage from "./components/Test";
import MemberExpenseDetails from "./pages/MemberExpenseDetails";
import RoomList from "./pages/RoomList";
import SendExpenditurePage from "./pages/email/Email";

function App() {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth); 

  useEffect(() => {
    // 🔹 Optional: Check auth on app load (e.g., if token exists in localStorage)
    // dispatch(checkAuth());
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        {/* Redirect authenticated users to /rooms */}
        <Route
          path="/"
          element={isAuthenticated ? <Navigate to="/rooms" /> : <HomePage />}
        />
        <Route path="/room/:room_id" element={<SuccessPage />} />
        <Route path="/rooms" element={<RoomList />} />
        <Route path="/test" element={<TestingMessage />} />
        <Route path="/send-report/:room_id" element={<SendExpenditurePage />} />
        <Route path="/room-expense-details/:room_id" element={<RoomExpenditureDetails />} />
        <Route path="/member-expense-details" element={<MemberExpenseDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
