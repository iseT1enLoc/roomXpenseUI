import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from './pages/Home';
import SuccessPage from './pages/SuccessLoginPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Use JSX tags <HomePage /> and <SuccessPage /> */}
        <Route path="/" element={<HomePage />} />
        <Route path="/successpage" element={<SuccessPage />} />
        
      </Routes>
    </Router>
  );
}

export default App;
