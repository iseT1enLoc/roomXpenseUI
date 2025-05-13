import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { checkAuth } from './features/auth/authSlice'; // Import checkAuth action

import HomePage from './pages/homepage/Home';
import SuccessPage from './pages/mainpage/SuccessLoginPage';
import RoomExpenditureDetails from './pages/RoomExpenditureDetail';
import TestingMessage from './components/Test';
import PrivateRoute from "./components/privateRoute";
import MemberExpenseDetails from './pages/MemberExpenseDetails';
import RoomList from './pages/RoomList';
import SendExpenditurePage from './pages/email/Email';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(state => state.auth); // Get authentication status from Redux store

  useEffect(() => {
    // Check if the user is authenticated when the app loads
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        {/* Public route */}
        <Route
          path="/"
          element={isAuthenticated ? <Navigate to="/rooms" /> : <HomePage />}
        />

        {/* Protected routes */}
        <Route
          path="/room/:room_id"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <SuccessPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/rooms"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <RoomList />
            </PrivateRoute>
          }
        />
        <Route
          path="/test"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <TestingMessage />
            </PrivateRoute>
          }
        />
        <Route
          path="/send-report/:room_id"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <SendExpenditurePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/room-expense-details/:room_id"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <RoomExpenditureDetails />
            </PrivateRoute>
          }
        />
        <Route
          path="/member-expense-details"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <MemberExpenseDetails />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
