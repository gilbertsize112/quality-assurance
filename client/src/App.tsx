import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import OfficerForm from './pages/OfficerForm';
import AdminDashboard from './pages/AdminDashboard';
import FaultyAssets from './pages/faulty'; 
import OfficerReports from './pages/OfficerReports'; 
import ImageGallery from './pages/image'; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        
        {/* Field Officer Routes */}
        <Route path="/officer-form" element={<OfficerForm />} />
        <Route path="/faulty" element={<FaultyAssets />} /> 
        <Route path="/officer-reports" element={<OfficerReports />} /> {/* Added History Route */}
        <Route path="/image" element={<ImageGallery />} /> {/* Added Image Gallery Route */}
        
        {/* Management/HQ Routes */}
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;