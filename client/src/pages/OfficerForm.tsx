import React, { useState, useEffect } from 'react';
import { ShieldAlert, FileText, ClipboardCheck, UploadCloud, MapPin, LogOut, Globe, Loader2, AlertTriangle, Sun, Moon, History, Image as ImageIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const OfficerForm = () => {
  const navigate = useNavigate();
  
  // Pulling official data from Login session
  const assignedState = localStorage.getItem('userState') || 'ABIA';
  const officerName = localStorage.getItem('username') || '';
  const token = localStorage.getItem('token');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Initialize state with official login data
  const [formData, setFormData] = useState({
    state: assignedState,
    buildingZone: '',
    reportDate: '',
    reportTime: '',
    inspectorName: officerName, // Auto-filled from login
    utilityLocationType: 'Indoor',
    utilityName: '',
    utilityCode: 'None',
    conditionKey: 1,
    lastInspectionDate: '',
    lastMaintenanceDue: '',
    nextMaintenanceDue: '',
    actionRequired: '',
    utilityCategory: 'General',
    faultDetails: '',
    readyToSubmit: 'Yes',
    // UPDATE: Added visibility tags for all 3 supervisors
    broadcastToAll: true,
    viewingPermissions: 'GLOBAL'
  });

  // Security Check: Redirect if not logged in
  useEffect(() => {
    if (!token) {
      navigate('/');
    }
  }, [token, navigate]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  // Dynamic Theme Mapping
  const theme = {
    bg: darkMode ? '#121212' : '#f4f7f6',
    card: darkMode ? '#1e1e1e' : '#ffffff',
    text: darkMode ? '#ffffff' : '#333333',
    subText: darkMode ? '#aaaaaa' : '#666666',
    inputBg: darkMode ? '#2d2d2d' : '#fcfdfe',
    inputBorder: darkMode ? '#333333' : '#eef2f5',
    marqueeBg: darkMode ? '#003366' : '#e6f4ea' // Deep Blue or NDDC Light Green
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // UPDATED: Sending payload with broadcast flag to ensure all 3 supervisors receive it
      await axios.post('http://10.53.75.193:5000/api/utilities/submit', formData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      alert("NDDC-QMP Audit Submitted. Visible to all Supervisors!");
      
      // Reset non-static fields after success
      setFormData({
        ...formData,
        buildingZone: '',
        utilityName: '',
        utilityCode: 'None',
        faultDetails: '',
        actionRequired: ''
      });

    } catch (error: any) {
      console.error("Submission Error:", error);
      alert(error.response?.data?.message || "Error submitting. Check if server is running.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div style={{...styles.container, backgroundColor: theme.bg}}>
      <style>{`
        body, html {
          margin: 0 !important;
          padding: 0 !important;
          background-color: ${theme.bg} !important;
          transition: background-color 0.3s ease;
          width: 100% !important;
          min-height: 100vh !important;
          font-family: 'Inter', -apple-system, sans-serif;
        }

        #root { width: 100%; display: flex; justify-content: center; }

        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .spin-icon { animation: spin 1s linear infinite; }

        /* MARQUEE STYLING */
        .marquee-wrapper {
          width: 100%;
          overflow: hidden;
          background: ${darkMode ? '#002200' : '#006837'};
          padding: 12px 0;
          margin-bottom: 25px;
          border-radius: 12px;
        }

        .marquee-content {
          display: inline-block;
          white-space: nowrap;
          padding-left: 100%;
          animation: marquee-scroll 25s linear infinite;
          font-size: 14px;
          font-weight: 800;
          color: #ffffff;
          text-transform: uppercase;
          letter-spacing: 2px;
        }

        @keyframes marquee-scroll {
          0% { transform: translate(0, 0); }
          100% { transform: translate(-100%, 0); }
        }

        input:focus, select:focus, textarea:focus {
          border-color: #006837 !important;
          box-shadow: 0 0 0 4px rgba(0, 104, 55, 0.1) !important;
          outline: none !important;
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-section { animation: fadeInUp 0.5s ease-out forwards; opacity: 0; }

        .logo-img-nddc { width: 80px; height: 80px; object-fit: contain; }
        .logo-img-ever { width: 120px; height: auto; object-fit: contain; }

        @media (max-width: 768px) {
          .form-grid { grid-template-columns: 1fr !important; gap: 15px !important; }
          .main-container { width: 95% !important; padding: 10px !important; }
          .top-bar { flex-direction: column; gap: 15px; }
          .btn-group { width: 100%; justify-content: center; flex-wrap: wrap; }
          .header-logos { justify-content: space-between; width: 100%; }
          .logo-img-nddc { width: 50px; height: 50px; }
          .logo-img-ever { width: 80px; }
        }
      `}</style>

      <div className="main-container" style={styles.mainWrapper}>
        
        {/* TOP BAR WITH LOGOS */}
        <div style={styles.topBar} className="top-bar">
          <div className="header-logos" style={{display: 'flex', alignItems: 'center', gap: '20px'}}>
             <img src="/nddclogo.png" alt="NDDC" className="logo-img-nddc" />
             <div style={{height: '40px', width: '2px', backgroundColor: '#ddd'}}></div>
             <img src="/everlogo.png" alt="Everlink" className="logo-img-ever" />
          </div>
          <div style={{display: 'flex', gap: '8px'}} className="btn-group">
            <button onClick={toggleDarkMode} style={{...styles.iconCircleBtn, color: darkMode ? '#FFD700' : '#006699', backgroundColor: theme.card}}>
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button onClick={() => navigate('/image')} style={styles.navBtn}><ImageIcon size={14}/> Images</button>
            <button onClick={() => navigate('/officer-reports')} style={styles.navBtn}><History size={14}/> History</button>
            <button onClick={() => navigate('/faulty')} style={{...styles.navBtn, backgroundColor: '#E67E22'}}><AlertTriangle size={14}/> Faulty</button>
            <button onClick={handleLogout} style={styles.logoutBtn}><LogOut size={14}/> Logout</button>
          </div>
        </div>

        {/* BIG MOVING MARQUEE */}
        <div className="marquee-wrapper">
          <div className="marquee-content">
            OFFICIAL QUALITY MANAGEMENT PORTAL • FACILITATED BY EVERLINK TELESAT NETWORK • SECURE AUDIT UPLOAD ACTIVE • AUTHORIZED PERSONNEL ONLY
          </div>
        </div>

        {/* HEADER BLOCK */}
        <div style={styles.preamble} className="animate-section">
          <div style={styles.header}>
              <ShieldAlert color="#FFD700" size={40} />
              <div style={{flex: 1}}>
                <h1 style={styles.mainTitle}>NDDC - QMP Fault/Emergency Reporting</h1>
                <p style={{fontSize: '11px', color: '#e0e0e0', margin: '5px 0 0 0', letterSpacing: '1px', fontWeight: 'bold'}}>INFRASTRUCTURE QUALITY ASSURANCE SYSTEM</p>
              </div>
          </div>
          <div style={styles.instructions}>
              <p style={{margin: 0}}><strong>OFFICER:</strong> {officerName.toUpperCase()} | <strong>STATIONED:</strong> {assignedState.toUpperCase()} | <strong>STATUS:</strong> AUTHENTICATED</p>
          </div>
        </div>

        {/* MAIN FORM GRID */}
        <form onSubmit={handleSubmit} style={styles.formGrid} className="form-grid">
          
          <section style={{...styles.section, backgroundColor: theme.card, borderColor: theme.inputBorder, animationDelay: '0.1s'}} className="animate-section">
              <h3 style={{...styles.secTitle, color: '#006837', borderBottomColor: theme.inputBorder}}><MapPin size={18} /> Location Description</h3>
              <label style={{...styles.fieldLabel, color: theme.subText}}>Location (Auto-Detect) *</label>
              <input style={{...styles.input, backgroundColor: darkMode ? '#121212' : '#f0f0f0', color: theme.text, borderColor: theme.inputBorder, cursor: 'not-allowed'}} value={formData.state} readOnly />
              
              <label style={{...styles.fieldLabel, color: theme.subText}}>Building/Zone *</label>
              <input style={{...styles.input, backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.inputBorder}} placeholder="Specify Area/Floor" value={formData.buildingZone} onChange={e => setFormData({...formData, buildingZone: e.target.value})} required />
              
              <div style={styles.row}>
                  <div><label style={{...styles.fieldLabel, color: theme.subText}}>Date *</label><input type="date" style={{...styles.input, backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.inputBorder}} onChange={e => setFormData({...formData, reportDate: e.target.value})} required/></div>
                  <div><label style={{...styles.fieldLabel, color: theme.subText}}>Time *</label><input type="time" style={{...styles.input, backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.inputBorder}} onChange={e => setFormData({...formData, reportTime: e.target.value})} required/></div>
              </div>
          </section>

          <section style={{...styles.section, backgroundColor: theme.card, borderColor: theme.inputBorder, animationDelay: '0.2s'}} className="animate-section">
              <h3 style={{...styles.secTitle, color: '#006837', borderBottomColor: theme.inputBorder}}><ClipboardCheck size={18} /> Field Inspector's Details</h3>
              <label style={{...styles.fieldLabel, color: theme.subText}}>Inspector's Official Identity *</label>
              <input style={{...styles.input, backgroundColor: darkMode ? '#121212' : '#f0f0f0', color: theme.text, borderColor: theme.inputBorder, cursor: 'not-allowed'}} value={formData.inspectorName} readOnly />
              <label style={{...styles.fieldLabel, color: theme.subText}}>Utility Location Environment *</label>
              <select style={{...styles.input, backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.inputBorder}} value={formData.utilityLocationType} onChange={e => setFormData({...formData, utilityLocationType: e.target.value})}>
                  <option>Indoor</option><option>Outdoor</option>
              </select>
          </section>

          <section style={{...styles.section, backgroundColor: theme.card, borderColor: theme.inputBorder, animationDelay: '0.3s'}} className="animate-section">
              <h3 style={{...styles.secTitle, color: '#006837', borderBottomColor: theme.inputBorder}}><FileText size={18} /> Utility-Specific Fields</h3>
              <label style={{...styles.fieldLabel, color: theme.subText}}>Utility Name *</label>
              <input style={{...styles.input, backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.inputBorder}} placeholder="e.g. Server, Generator, Lift" value={formData.utilityName} onChange={e => setFormData({...formData, utilityName: e.target.value})} required />
              <label style={{...styles.fieldLabel, color: theme.subText}}>Utility Serial/Asset Code</label>
              <input style={{...styles.input, backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.inputBorder}} placeholder="Code or 'None'" value={formData.utilityCode} onChange={e => setFormData({...formData, utilityCode: e.target.value})} />
              <label style={{...styles.fieldLabel, color: theme.subText}}>Geo-Tagged Image Evidence *</label>
              <div style={{...styles.uploadBox, backgroundColor: theme.marqueeBg + '22'}}>
                  <input type="file" style={styles.fileInput} accept="image/*" />
                  <UploadCloud size={28} color="#006837" />
                  <span style={{fontSize: '12px', fontWeight: 'bold', color: '#006837'}}>Capture/Upload Image</span>
                  <p style={{fontSize: '9px', color: theme.subText, margin: 0}}>Camera must have GPS active</p>
              </div>
          </section>

          <section style={{...styles.section, backgroundColor: theme.card, borderColor: theme.inputBorder, animationDelay: '0.4s'}} className="animate-section">
              <h3 style={{...styles.secTitle, color: '#006837', borderBottomColor: theme.inputBorder}}><ShieldAlert size={18} /> Condition Key (1-5)</h3>
              <select style={{...styles.input, backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.inputBorder}} value={formData.conditionKey} onChange={e => setFormData({...formData, conditionKey: parseInt(e.target.value)})}>
                  <option value="1">1 = Critical Failure</option>
                  <option value="2">2 = Major Issues</option>
                  <option value="3">3 = Minor Defects</option>
                  <option value="4">4 = Functional</option>
                  <option value="5">5 = Excellent</option>
              </select>
              <div style={styles.row}>
                  <div><label style={{...styles.fieldLabel, color: theme.subText}}>Last Inspection</label><input type="date" style={{...styles.input, backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.inputBorder}} onChange={e => setFormData({...formData, lastInspectionDate: e.target.value})}/></div>
                  <div><label style={{...styles.fieldLabel, color: theme.subText}}>Last Maintenance</label><input type="date" style={{...styles.input, backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.inputBorder}} onChange={e => setFormData({...formData, lastMaintenanceDue: e.target.value})}/></div>
              </div>
              <label style={{...styles.fieldLabel, color: theme.subText}}>Required Maintenance Due Date *</label>
              <input type="date" style={{...styles.input, backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.inputBorder}} onChange={e => setFormData({...formData, nextMaintenanceDue: e.target.value})} required/>
          </section>

          <section style={{...styles.section, backgroundColor: theme.card, borderColor: theme.inputBorder, animationDelay: '0.5s'}} className="animate-section">
              <h3 style={{...styles.secTitle, color: '#006837', borderBottomColor: theme.inputBorder}}><FileText size={18} /> Recommended Action</h3>
              <textarea style={{...styles.textArea, backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.inputBorder}} placeholder="Detail the required repair or replacement..." value={formData.actionRequired} onChange={e => setFormData({...formData, actionRequired: e.target.value})} required />
              <label style={{...styles.fieldLabel, color: theme.subText}}>Infrastructure Category *</label>
              <select style={{...styles.input, backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.inputBorder}} value={formData.utilityCategory} onChange={e => setFormData({...formData, utilityCategory: e.target.value})}>
                  <option value="Electrical">Electrical</option><option value="Water">Water</option><option value="HVAC">HVAC</option><option value="IT/Network">IT/Network</option>
                  <option value="Waste Management">Waste Management</option><option value="General">General</option>
              </select>
          </section>

          <section style={{...styles.section, backgroundColor: theme.card, borderColor: theme.inputBorder, animationDelay: '0.6s'}} className="animate-section">
              <h3 style={{...styles.secTitle, color: '#006837', borderBottomColor: theme.inputBorder}}><AlertTriangle size={18} /> Impact Assessment</h3>
              <textarea style={{...styles.textArea, backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.inputBorder}} placeholder="Full technical assessment of the fault..." value={formData.faultDetails} onChange={e => setFormData({...formData, faultDetails: e.target.value})} required />
              
              <button 
                type="submit" 
                disabled={isSubmitting}
                style={{
                  ...styles.submitBtn, 
                  backgroundColor: isSubmitting ? '#004433' : '#006837',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={20} className="spin-icon" />
                    TRANSMITTING AUDIT...
                  </>
                ) : (
                  "SECURELY SUBMIT AUDIT REPORT"
                )}
              </button>
              
              <div style={{marginTop: '20px', textAlign: 'center'}}>
                  <p style={{fontSize: '10px', color: theme.subText, fontWeight: '800'}}>© EVERLINK TELESAT NETWORK x NDDC</p>
              </div>
          </section>
        </form>
      </div>
    </div>
  );
};

const styles: any = {
    container: { minHeight: '100vh', width: '100%', display: 'flex', justifyContent: 'center', boxSizing: 'border-box', margin: 0, padding: '20px 10px', transition: 'all 0.3s ease' },
    mainWrapper: { maxWidth: '1150px', width: '100%', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' },
    topBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', padding: '10px', backgroundColor: 'white', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' },
    preamble: { background: 'linear-gradient(135deg, #003366 0%, #006837 100%)', color: 'white', padding: '30px', borderRadius: '20px', marginBottom: '20px', boxShadow: '0 10px 25px rgba(0,0,0,0.15)', boxSizing: 'border-box' },
    mainTitle: { margin: 0, fontSize: '24px', fontWeight: '900', lineHeight: '1.1', letterSpacing: '-0.5px' },
    header: { display: 'flex', alignItems: 'center', gap: '15px' },
    instructions: { backgroundColor: 'rgba(255,255,255,0.1)', padding: '12px', fontSize: '11px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.2)', marginTop: '20px', fontWeight: 'bold' },
    formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', width: '100%', boxSizing: 'border-box' },
    section: { padding: '25px', borderRadius: '20px', boxShadow: '0 5px 15px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', boxSizing: 'border-box', border: '1px solid #f0f0f0', transition: 'all 0.3s ease' },
    secTitle: { borderBottom: '2px solid #f4f7f6', paddingBottom: '12px', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '900', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' },
    fieldLabel: { fontSize: '11px', fontWeight: '900', marginBottom: '8px', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' },
    input: { width: '100%', padding: '12px', marginBottom: '15px', border: '2px solid #eef2f5', borderRadius: '10px', fontSize: '15px', boxSizing: 'border-box', outline: 'none', transition: 'all 0.2s ease' },
    textArea: { width: '100%', height: '100px', padding: '12px', border: '2px solid #eef2f5', borderRadius: '10px', fontSize: '15px', marginBottom: '15px', boxSizing: 'border-box', outline: 'none', resize: 'none' },
    row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },
    uploadBox: { border: '2px dashed #006837', padding: '20px', borderRadius: '15px', textAlign: 'center', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' },
    fileInput: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer', zIndex: 5 },
    submitBtn: { width: '100%', padding: '18px', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '900', cursor: 'pointer', fontSize: '15px', boxShadow: '0 8px 20px rgba(0,104,55,0.3)', transition: 'all 0.3s ease', marginTop: '10px', letterSpacing: '1px' },
    logoutBtn: { backgroundColor: '#c0392b', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 'bold' },
    navBtn: { backgroundColor: '#003366', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 'bold' },
    iconCircleBtn: { border: '1px solid #ddd', padding: '8px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }
};

export default OfficerForm;