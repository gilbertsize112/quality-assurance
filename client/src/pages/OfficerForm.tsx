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
    marqueeBg: darkMode ? '#00334d' : '#f0f7ff'
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
          background: ${theme.marqueeBg};
          padding: 15px 0;
          margin-bottom: 25px;
          border-radius: 12px;
          border: 1px solid ${darkMode ? '#004466' : '#cce4f0'};
        }

        .marquee-content {
          display: inline-block;
          white-space: nowrap;
          padding-left: 100%;
          animation: marquee-scroll 20s linear infinite;
          font-size: 20px;
          font-weight: 900;
          color: #006699;
          text-transform: uppercase;
          letter-spacing: 2px;
        }

        @keyframes marquee-scroll {
          0% { transform: translate(0, 0); }
          100% { transform: translate(-100%, 0); }
        }

        input:focus, select:focus, textarea:focus {
          border-color: #006699 !important;
          box-shadow: 0 0 0 4px rgba(0, 102, 153, 0.1) !important;
          outline: none !important;
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-section { animation: fadeInUp 0.5s ease-out forwards; opacity: 0; }

        @media (max-width: 768px) {
          .form-grid { grid-template-columns: 1fr !important; gap: 15px !important; }
          .main-container { width: 95% !important; }
          .top-bar { flex-direction: column; gap: 15px; }
          .btn-group { width: 100%; justify-content: center; flex-wrap: wrap; }
        }
      `}</style>

      <div className="main-container" style={styles.mainWrapper}>
        
        {/* TOP BAR */}
        <div style={styles.topBar} className="top-bar">
          <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
             <button 
              onClick={toggleDarkMode} 
              style={{
                background: theme.card, 
                border: `1px solid ${theme.inputBorder}`, 
                padding: '10px', 
                borderRadius: '50%', 
                cursor: 'pointer',
                color: darkMode ? '#FFD700' : '#006699',
                display: 'flex',
                alignItems: 'center',
                boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
              }}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <Globe size={18} color="#006699" />
            <span style={{fontSize: '12px', fontWeight: 'bold', color: '#006699'}}>Everlink Telesat Network</span>
          </div>
          <div style={{display: 'flex', gap: '10px'}} className="btn-group">
            <button onClick={() => navigate('/image')} style={styles.viewImagesBtn}>
              <ImageIcon size={16}/> View Images
            </button>
            <button onClick={() => navigate('/officer-reports')} style={styles.historyBtn}>
              <History size={16}/> View History
            </button>
            <button onClick={() => navigate('/faulty')} style={styles.faultyBtn}>
              <AlertTriangle size={16}/> Report Faulty Assets
            </button>
            <button onClick={handleLogout} style={styles.logoutBtn}><LogOut size={16}/> Logout</button>
          </div>
        </div>

        {/* BIG MOVING MARQUEE */}
        <div className="marquee-wrapper">
          <div className="marquee-content">
            Facilitated by Everlink Telesat Network — Premium Quality Management Infrastructure — NDDC-QMP Audit Services
          </div>
        </div>

        {/* HEADER BLOCK */}
        <div style={styles.preamble} className="animate-section">
          <div style={styles.header}>
              <ShieldAlert color="#FFD700" size={45} />
              <h1 style={styles.mainTitle} className="main-title">NDDC - QMP Fault/Emergency Reporting</h1>
          </div>
          <p style={{fontSize: '14px', opacity: 0.9, margin: '12px 0', lineHeight: '1.5'}}><strong>Purpose:</strong> This form is aimed at providing full details of faults and emergencies.</p>
          <div style={styles.instructions}>
              <p style={{margin: 0}}><strong>Logged in as:</strong> {officerName.toUpperCase()} | <strong>Zone:</strong> {assignedState}</p>
          </div>
        </div>

        {/* MAIN FORM GRID */}
        <form onSubmit={handleSubmit} style={styles.formGrid} className="form-grid">
          
          <section style={{...styles.section, backgroundColor: theme.card, borderColor: theme.inputBorder, animationDelay: '0.1s'}} className="animate-section">
              <h3 style={{...styles.secTitle, color: theme.text, borderBottomColor: theme.inputBorder}}><MapPin size={18} color="#006699"/> Location Description</h3>
              <label style={{...styles.fieldLabel, color: theme.subText}}>Location *</label>
              <input style={{...styles.input, backgroundColor: darkMode ? '#121212' : '#f0f0f0', color: theme.text, borderColor: theme.inputBorder, cursor: 'not-allowed'}} value={formData.state} readOnly />
              
              <label style={{...styles.fieldLabel, color: theme.subText}}>Building/Zone *</label>
              <input style={{...styles.input, backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.inputBorder}} placeholder="e.g. .." value={formData.buildingZone} onChange={e => setFormData({...formData, buildingZone: e.target.value})} required />
              
              <div style={styles.row}>
                  <div><label style={{...styles.fieldLabel, color: theme.subText}}>Date *</label><input type="date" style={{...styles.input, backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.inputBorder}} onChange={e => setFormData({...formData, reportDate: e.target.value})} required/></div>
                  <div><label style={{...styles.fieldLabel, color: theme.subText}}>Time *</label><input type="time" style={{...styles.input, backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.inputBorder}} onChange={e => setFormData({...formData, reportTime: e.target.value})} required/></div>
              </div>
          </section>

          <section style={{...styles.section, backgroundColor: theme.card, borderColor: theme.inputBorder, animationDelay: '0.2s'}} className="animate-section">
              <h3 style={{...styles.secTitle, color: theme.text, borderBottomColor: theme.inputBorder}}><ClipboardCheck size={18} color="#006699"/> Field Inspector's Details</h3>
              <label style={{...styles.fieldLabel, color: theme.subText}}>Inspector's Details (Surname, First Name) *</label>
              <input style={{...styles.input, backgroundColor: darkMode ? '#121212' : '#f0f0f0', color: theme.text, borderColor: theme.inputBorder, cursor: 'not-allowed'}} value={formData.inspectorName} readOnly />
              <label style={{...styles.fieldLabel, color: theme.subText}}>Utility Location: Outdoor/Indoor *</label>
              <select style={{...styles.input, backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.inputBorder}} value={formData.utilityLocationType} onChange={e => setFormData({...formData, utilityLocationType: e.target.value})}>
                  <option>Indoor</option><option>Outdoor</option>
              </select>
          </section>

          <section style={{...styles.section, backgroundColor: theme.card, borderColor: theme.inputBorder, animationDelay: '0.3s'}} className="animate-section">
              <h3 style={{...styles.secTitle, color: theme.text, borderBottomColor: theme.inputBorder}}><FileText size={18} color="#006699"/> Utility-Specific Fields</h3>
              <label style={{...styles.fieldLabel, color: theme.subText}}>Utility Name *</label>
              <input style={{...styles.input, backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.inputBorder}} placeholder="e.g. Television" value={formData.utilityName} onChange={e => setFormData({...formData, utilityName: e.target.value})} required />
              <label style={{...styles.fieldLabel, color: theme.subText}}>Utility Code *</label>
              <input style={{...styles.input, backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.inputBorder}} placeholder="Enter code or 'None'" value={formData.utilityCode} onChange={e => setFormData({...formData, utilityCode: e.target.value})} />
              <label style={{...styles.fieldLabel, color: theme.subText}}>Upload Image Here *</label>
              <div style={{...styles.uploadBox, backgroundColor: theme.marqueeBg}}>
                  <input type="file" style={styles.fileInput} accept="image/*" />
                  <UploadCloud size={32} color="#006699" />
                  <span style={{fontSize: '13px', fontWeight: '700', color: '#006699'}}>GPS Map Camera Image</span>
                  <p style={{fontSize: '10px', color: theme.subText, margin: 0}}>Tap to capture or upload</p>
              </div>
          </section>

          <section style={{...styles.section, backgroundColor: theme.card, borderColor: theme.inputBorder, animationDelay: '0.4s'}} className="animate-section">
              <h3 style={{...styles.secTitle, color: theme.text, borderBottomColor: theme.inputBorder}}><ShieldAlert size={18} color="#006699"/> Condition Key (1-5)</h3>
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
              <label style={{...styles.fieldLabel, color: theme.subText}}>Next Maintenance Due *</label>
              <input type="date" style={{...styles.input, backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.inputBorder}} onChange={e => setFormData({...formData, nextMaintenanceDue: e.target.value})} required/>
          </section>

          <section style={{...styles.section, backgroundColor: theme.card, borderColor: theme.inputBorder, animationDelay: '0.5s'}} className="animate-section">
              <h3 style={{...styles.secTitle, color: theme.text, borderBottomColor: theme.inputBorder}}><FileText size={18} color="#006699"/> Action Required</h3>
              <textarea style={{...styles.textArea, backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.inputBorder}} placeholder="Describe the recommended action..." value={formData.actionRequired} onChange={e => setFormData({...formData, actionRequired: e.target.value})} required />
              <label style={{...styles.fieldLabel, color: theme.subText}}>Category *</label>
              <select style={{...styles.input, backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.inputBorder}} value={formData.utilityCategory} onChange={e => setFormData({...formData, utilityCategory: e.target.value})}>
                  <option value="Electrical">Electrical</option><option value="Water">Water</option><option value="HVAC">HVAC</option><option value="IT/Network">IT/Network</option>
                  <option value="Waste Management">Waste Management</option><option value="General">General</option>
              </select>
          </section>

          <section style={{...styles.section, backgroundColor: theme.card, borderColor: theme.inputBorder, animationDelay: '0.6s'}} className="animate-section">
              <h3 style={{...styles.secTitle, color: theme.text, borderBottomColor: theme.inputBorder}}><ShieldAlert size={18} color="#006699"/> Impact Assessment</h3>
              <textarea style={{...styles.textArea, backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.inputBorder}} placeholder="Detailed fault assessment..." value={formData.faultDetails} onChange={e => setFormData({...formData, faultDetails: e.target.value})} required />
              
              <button 
                type="submit" 
                disabled={isSubmitting}
                style={{
                  ...styles.submitBtn, 
                  backgroundColor: isSubmitting ? '#004466' : '#006699',
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
                    SUBMITTING AUDIT...
                  </>
                ) : (
                  "SUBMIT AUDIT REPORT"
                )}
              </button>
              
              <div style={{marginTop: '25px', textAlign: 'center'}}>
                  <p style={{fontSize: '11px', color: theme.subText, fontWeight: '500'}}>System Powered by Everlink Telesat Network</p>
              </div>
          </section>
        </form>
      </div>
    </div>
  );
};

const styles: any = {
    container: { minHeight: '100vh', width: '100%', display: 'flex', justifyContent: 'center', boxSizing: 'border-box', margin: 0, padding: '30px 15px', transition: 'all 0.3s ease' },
    mainWrapper: { maxWidth: '1100px', width: '100%', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' },
    topBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', padding: '0 10px' },
    preamble: { backgroundColor: '#006699', color: 'white', padding: '35px', borderRadius: '20px', marginBottom: '30px', boxShadow: '0 12px 30px rgba(0,102,153,0.25)', boxSizing: 'border-box' },
    mainTitle: { margin: 0, fontSize: '26px', fontWeight: '800', lineHeight: '1.2', letterSpacing: '-0.5px' },
    header: { display: 'flex', alignItems: 'center', gap: '20px' },
    instructions: { backgroundColor: 'rgba(255,255,255,0.12)', padding: '14px', fontSize: '13px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)', marginTop: '15px', fontWeight: '500' },
    formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px', width: '100%', boxSizing: 'border-box' },
    section: { padding: '30px', borderRadius: '20px', boxShadow: '0 8px 20px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', boxSizing: 'border-box', border: '1px solid #f0f0f0', transition: 'all 0.3s ease' },
    secTitle: { borderBottom: '2px solid #f4f7f6', paddingBottom: '15px', marginBottom: '22px', display: 'flex', alignItems: 'center', gap: '12px', fontWeight: '800', fontSize: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' },
    fieldLabel: { fontSize: '13px', fontWeight: '700', marginBottom: '10px', display: 'block' },
    input: { width: '100%', padding: '14px', marginBottom: '20px', border: '2px solid #eef2f5', borderRadius: '12px', fontSize: '15px', boxSizing: 'border-box', outline: 'none', transition: 'all 0.2s ease' },
    textArea: { width: '100%', height: '120px', padding: '14px', border: '2px solid #eef2f5', borderRadius: '12px', fontSize: '15px', marginBottom: '20px', boxSizing: 'border-box', outline: 'none', resize: 'none', transition: 'all 0.2s ease' },
    row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' },
    uploadBox: { border: '2px dashed #006699', padding: '30px', borderRadius: '16px', textAlign: 'center', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', transition: 'all 0.3s ease' },
    fileInput: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer', zIndex: 5 },
    submitBtn: { width: '100%', padding: '20px', backgroundColor: '#006699', color: 'white', border: 'none', borderRadius: '14px', fontWeight: '800', cursor: 'pointer', fontSize: '16px', boxShadow: '0 10px 25px rgba(0,102,153,0.3)', transition: 'all 0.3s ease', marginTop: '10px', letterSpacing: '1px' },
    logoutBtn: { backgroundColor: '#ff4d4d', color: 'white', border: 'none', padding: '10px 18px', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 'bold', transition: 'all 0.2s ease' },
    faultyBtn: { backgroundColor: '#E67E22', color: 'white', border: 'none', padding: '10px 18px', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 'bold', transition: 'all 0.2s ease' },
    historyBtn: { backgroundColor: '#34495E', color: 'white', border: 'none', padding: '10px 18px', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 'bold', transition: 'all 0.2s ease' },
    viewImagesBtn: { backgroundColor: '#006699', color: 'white', border: 'none', padding: '10px 18px', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 'bold', transition: 'all 0.2s ease' }
};

export default OfficerForm;