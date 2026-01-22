import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import OfficerForm from './pages/OfficerForm';
import AdminDashboard from './pages/AdminDashboard';
import FaultyAssets from './pages/faulty'; 
import OfficerReports from './pages/OfficerReports'; 
import ImageGallery from './pages/image'; 
import StaffPage from './pages/StaffPage'; // IMPORTING THE NEW STAFF PAGE

function App() {
  return (
    <Router>
      <Routes>
        {/* Authentication Gateway */}
        <Route path="/" element={<Login />} />
        
        {/* Field Officer Routes */}
        <Route path="/officer-form" element={<OfficerForm />} />
        <Route path="/faulty" element={<FaultyAssets />} /> 
        <Route path="/officer-reports" element={<OfficerReports />} /> 
        <Route path="/image" element={<ImageGallery />} /> 

        {/* New Staff Utility Reporting Route */}
        <Route path="/staff-page" element={<StaffPage />} /> 
        
        {/* Management/HQ Routes */}
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;