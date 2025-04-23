import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from './pages/Home';
import SuccessPage from './pages/SuccessLoginPage';
import RoomExpenditureDetails from './pages/RoomExpenditureDetail';
import TestingMessage from './components/Test';

function App() {
  return (
    <Router>
        {/* Your header/navigation can go here */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/successpage" element={<SuccessPage />} />
          <Route path="/test" element={<TestingMessage/>} />
          <Route path="/room-expense-details" element={<RoomExpenditureDetails />} />
        </Routes>
        {/* Optionally you can add a footer here */}
    </Router>
  );
}

export default App;
