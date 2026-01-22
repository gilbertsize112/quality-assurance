import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LogOut, 
  Send, 
  AlertTriangle, 
  CheckCircle, 
  ClipboardList,
  MapPin,
  Clock,
  Camera,
  ChevronRight,
  Zap,
  PhoneCall,
  Activity,
  FileCheck 
} from 'lucide-react';

const StaffPage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [staffName, setStaffName] = useState('');
  const [staffState, setStaffState] = useState('');
  const [reportID, setReportID] = useState('');
  
  // Form State
  const [utilityType, setUtilityType] = useState('');
  const [officeLocation, setOfficeLocation] = useState('');
  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState('normal');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    const name = localStorage.getItem('username') || 'Official';
    const state = localStorage.getItem('userState') || 'Headquarters';
    setStaffName(name);
    setStaffState(state);
    setReportID(`NDDC-${Math.floor(1000 + Math.random() * 9000)}`);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSubmitted(true);
    } catch (err) {
      alert("System Error: Could not submit report.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={styles.pageContainer}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;800&display=swap');
        body { margin: 0; padding: 0; font-family: 'Inter', sans-serif; -webkit-font-smoothing: antialiased; }
        
        /* ANIMATIONS */
        .animate-logo { animation: logoFloat 3s ease-in-out infinite; }
        .animate-text-slide { animation: textSlideIn 0.8s cubic-bezier(0.23, 1, 0.32, 1); }
        .animate-fade-in { animation: fadeIn 0.4s ease-out; }
        .animate-pop { animation: popIn 0.5s cubic-bezier(0.26, 0.53, 0.74, 1.48); }
        
        .hover-scale { transition: all 0.2s ease; }
        .hover-scale:hover { transform: translateY(-2px); box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); }
        .hover-scale:active { transform: scale(0.98); }

        @keyframes logoFloat {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-5px) scale(1.05); }
        }

        @keyframes textSlideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes popIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        
        @media (max-width: 600px) {
          .nav-text-container { display: none; }
          .main-card { border-radius: 20px 20px 0 0 !important; margin-top: 5px !important; }
          .stat-box { font-size: 10px !important; }
          .state-badge-mobile { padding: 4px 8px !important; font-size: 9px !important; }
        }
      `}</style>

      {/* NEW DESIGNER TOP NAV BAR */}
      <nav style={styles.navbar}>
        <div style={styles.navContent}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div className="animate-logo">
              <img 
                src="/nddclogo.png" 
                alt="NDDC Logo" 
                style={{ width: '50px', height: '50px', objectFit: 'contain', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' }} 
              />
            </div>
            <div className="nav-text-container animate-text-slide">
              <p style={styles.welcomeText}>NDDC STAFF AUDIT PORTAL</p>
              <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                <div style={{width: '3px', height: '15px', backgroundColor: '#006837', borderRadius: '10px'}}></div>
                <p style={styles.staffNameText}>{staffName.toUpperCase()}</p>
              </div>
            </div>
          </div>
          
          <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
            <div style={styles.stateBadge} className="state-badge-mobile">
              <MapPin size={12} style={{marginRight: '4px'}} />
              {staffState}
            </div>
            <button onClick={handleLogout} style={styles.logoutBtn} title="Logout System">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </nav>

      {/* STATUS INDICATOR BAR */}
      <div style={styles.statsContainer} className="animate-fade-in">
        <div style={styles.statBox}>
            <Activity size={14} color="#004a99" />
            <span>Network: <b style={{color: '#006837'}}>Secure</b></span>
        </div>
        <div style={styles.statBox}>
            <Clock size={14} color="#004a99" />
            <span>Ref: <b>{reportID}</b></span>
        </div>
      </div>

      {/* MAIN FORM AREA */}
      <div style={styles.mainArea}>
        <div className="main-card animate-pop" style={styles.reportCard}>
          
          <div style={styles.cardHeader}>
            <div>
                <h2 style={styles.cardTitle}>Utility Defect Report</h2>
                <p style={styles.cardSub}>Official Maintenance Request Form</p>
            </div>
            <Zap color="#ffd700" size={24} />
          </div>

          {!submitted ? (
            <form onSubmit={handleSubmitReport} style={styles.formPadding}>
              
              <div style={styles.inputGroup}>
                <label style={styles.label}>NATURE OF FAULT</label>
                <select 
                  style={styles.input} 
                  value={utilityType} 
                  onChange={(e) => setUtilityType(e.target.value)}
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Electrical">⚡ Electrical / Power</option>
                  <option value="Plumbing">🚰 Water / Plumbing</option>
                  <option value="IT">📶 IT / Internet / Intercom</option>
                  <option value="Furniture">🪑 Office Furniture</option>
                  <option value="Structural">🏗️ Structural Issues</option>
                </select>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>OFFICE LOCATION / ROOM NO.</label>
                <div style={{ position: 'relative' }}>
                  <MapPin size={18} color="#004a99" style={styles.inputIcon} />
                  <input 
                    style={{ ...styles.input, paddingLeft: '40px' }} 
                    placeholder="e.g. Block B, Room 12, Accounts"
                    value={officeLocation}
                    onChange={(e) => setOfficeLocation(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>URGENCY LEVEL</label>
                <div style={styles.radioGroup}>
                  <button type="button" onClick={() => setUrgency('low')} style={urgency === 'low' ? styles.radioActive : styles.radio}>Routine</button>
                  <button type="button" onClick={() => setUrgency('normal')} style={urgency === 'normal' ? styles.radioActive : styles.radio}>Urgent</button>
                  <button type="button" onClick={() => setUrgency('critical')} style={urgency === 'critical' ? styles.radioActiveRed : styles.radio}>Critical</button>
                </div>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>FAULT DESCRIPTION</label>
                <textarea 
                  style={styles.textarea} 
                  placeholder="Provide brief details about the issue..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                ></textarea>
              </div>

              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                style={{ display: 'none' }} 
              />

              <div 
                style={selectedFile ? styles.uploadBoxActive : styles.uploadBox} 
                className="hover-scale"
                onClick={handleUploadClick}
              >
                  {selectedFile ? (
                    <>
                      <FileCheck size={20} color="#006837" />
                      <span style={{fontSize: '11px', fontWeight: '700', color: '#006837'}}>PHOTO ATTACHED: {selectedFile.name.substring(0, 15)}...</span>
                    </>
                  ) : (
                    <>
                      <Camera size={20} color="#004a99" />
                      <span style={{fontSize: '11px', fontWeight: '700', color: '#004a99'}}>UPLOAD PHOTO EVIDENCE</span>
                    </>
                  )}
              </div>

              <button type="submit" style={styles.submitBtn} className="hover-scale" disabled={submitting}>
                {submitting ? "PROCESSING..." : "SUBMIT TO MAINTENANCE"}
                <ChevronRight size={20} style={{ marginLeft: '10px' }} />
              </button>
            </form>
          ) : (
            <div style={styles.successView} className="animate-pop">
              <div style={styles.successIconWrapper}>
                <CheckCircle color="#ffffff" size={45} />
              </div>
              <h3 style={{ color: '#003366', marginTop: '20px', fontWeight: '800' }}>REPORT LOGGED</h3>
              <p style={{ color: '#64748b', fontSize: '13px', textAlign: 'center', lineHeight: '1.6' }}>
                Your report has been successfully filed under ID: <b style={{color: '#004a99'}}>{reportID}</b>. 
                Maintenance teams have been alerted.
              </p>
              
              <div style={styles.trackingCard}>
                  <p style={{margin: 0, fontSize: '10px', color: '#64748b', fontWeight: 'bold'}}>ESTIMATED RESPONSE</p>
                  <p style={{margin: '4px 0 0 0', fontSize: '14px', fontWeight: 'bold', color: '#006837'}}>Within 24 Hours</p>
              </div>

              <button onClick={() => { setSubmitted(false); setSelectedFile(null); setReportID(`NDDC-${Math.floor(1000 + Math.random() * 9000)}`); }} style={styles.newReportBtn}>
                <ClipboardList size={18} /> SUBMIT ANOTHER
              </button>
            </div>
          )}
        </div>

        <div style={styles.supportLink}>
            <PhoneCall size={14} />
            <span>Internal Support: Ext 4040 (Maintenance HQ)</span>
        </div>

        <div style={styles.footer}>
          <p style={{ marginBottom: '5px' }}>© 2026 NDDC CORPORATE SERVICES DIVISION</p>
          <p style={{ color: '#ffffff', fontWeight: 'bold', marginBottom: '8px', fontSize: '10px' }}>BUILT BY GILBERT</p>
          <div style={{display: 'flex', gap: '10px', justifyContent: 'center', opacity: 1}}>
              <span style={{color: '#ffffff', fontWeight: '800'}}>ALL RIGHTS RESERVED</span> • <span style={{color: '#ffffff', fontWeight: '800'}}>PRIVACY POLICY</span> • <span style={{color: '#ffffff', fontWeight: '800'}}>SYSTEM STATUS</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles: any = {
  pageContainer: { 
    minHeight: '100vh', 
    width: '100vw', 
    display: 'flex', 
    flexDirection: 'column',
    backgroundImage: "url('/bg.jpg')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
    backgroundColor: '#000'
  },
  navbar: { 
    backgroundColor: 'rgba(255, 255, 255, 0.96)', 
    borderBottom: '4px solid #006837', 
    padding: '10px 20px', 
    position: 'sticky', 
    top: 0, 
    zIndex: 100, 
    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
    backdropFilter: 'blur(10px)'
  },
  navContent: { 
    maxWidth: '1000px', 
    margin: '0 auto', 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  welcomeText: { 
    margin: 0, 
    fontSize: '10px', 
    color: '#006837', 
    fontWeight: '900', 
    letterSpacing: '1.5px',
    opacity: 0.8
  },
  staffNameText: { 
    margin: 0, 
    fontSize: '16px', 
    color: '#003366', 
    fontWeight: '900',
    letterSpacing: '-0.2px'
  },
  stateBadge: { 
    backgroundColor: '#003366', 
    color: '#ffffff', 
    padding: '6px 14px', 
    borderRadius: '20px', 
    fontSize: '11px', 
    fontWeight: '800', 
    display: 'flex', 
    alignItems: 'center',
    boxShadow: '0 4px 10px rgba(0,51,102,0.2)'
  },
  logoutBtn: { 
    padding: '10px', 
    backgroundColor: '#fff1f0', 
    color: '#cf1322', 
    border: '2px solid #ffa39e', 
    borderRadius: '12px', 
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  
  statsContainer: { maxWidth: '800px', width: '92%', margin: '15px auto 0 auto', display: 'flex', gap: '10px' },
  statBox: { flex: 1, backgroundColor: 'rgba(255, 255, 255, 0.9)', padding: '10px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: '#475569', border: '1px solid #e2e8f0', backdropFilter: 'blur(5px)' },
  
  mainArea: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px 15px' },
  reportCard: { width: '100%', maxWidth: '480px', backgroundColor: 'rgba(255, 255, 255, 0.96)', borderRadius: '20px', boxShadow: '0 20px 40px rgba(0,0,0,0.3)', overflow: 'hidden', backdropFilter: 'blur(10px)' },
  cardHeader: { backgroundColor: '#003366', padding: '22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundImage: 'linear-gradient(135deg, #003366 0%, #004a99 100%)' },
  cardTitle: { color: '#ffffff', margin: 0, fontSize: '18px', fontWeight: '800', letterSpacing: '0.5px' },
  cardSub: { color: '#99c2ff', margin: '4px 0 0 0', fontSize: '11px', fontWeight: '500' },
  
  formPadding: { padding: '25px' },
  label: { display: 'block', fontSize: '11px', fontWeight: '800', color: '#003366', marginBottom: '8px' },
  inputGroup: { marginBottom: '18px' },
  input: { width: '100%', padding: '14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '15px', boxSizing: 'border-box', outline: 'none', backgroundColor: '#fcfdfe' },
  inputIcon: { position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' },
  textarea: { width: '100%', padding: '14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '15px', minHeight: '100px', boxSizing: 'border-box', fontFamily: 'inherit', outline: 'none' },
  
  radioGroup: { display: 'flex', gap: '8px' },
  radio: { flex: 1, padding: '12px', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#fff', cursor: 'pointer', fontSize: '12px', fontWeight: '600', color: '#64748b' },
  radioActive: { flex: 1, padding: '12px', border: '1.5px solid #006837', borderRadius: '8px', background: '#f0fdf4', color: '#006837', fontWeight: '800' },
  radioActiveRed: { flex: 1, padding: '12px', border: '1.5px solid #cf1322', borderRadius: '8px', background: '#fff1f0', color: '#cf1322', fontWeight: '800' },
  
  uploadBox: { padding: '14px', border: '2px dashed #cbd5e1', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '22px', cursor: 'pointer', backgroundColor: '#f8fafc' },
  uploadBoxActive: { padding: '14px', border: '2px solid #006837', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '22px', cursor: 'pointer', backgroundColor: '#f0fdf4' },
  
  submitBtn: { width: '100%', padding: '18px', backgroundColor: '#006837', color: '#ffffff', border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: '800', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 6px 20px rgba(0, 104, 55, 0.25)' },
  
  successView: { padding: '40px 20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  successIconWrapper: { width: '70px', height: '70px', backgroundColor: '#006837', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' },
  trackingCard: { backgroundColor: '#f8fafc', padding: '15px', borderRadius: '12px', width: '90%', marginTop: '20px', border: '1px solid #e2e8f0' },
  newReportBtn: { marginTop: '25px', width: '100%', padding: '15px', backgroundColor: '#ffffff', color: '#003366', border: '2px solid #003366', borderRadius: '12px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' },
  
  supportLink: { marginTop: '15px', display: 'flex', alignItems: 'center', gap: '8px', color: '#ffffff', fontSize: '11px', fontWeight: '700', backgroundColor: 'rgba(0,51,102,0.8)', padding: '8px 15px', borderRadius: '20px', boxShadow: '0 4px 10px rgba(0,0,0,0.2)' },
  footer: { marginTop: 'auto', textAlign: 'center', padding: '25px 20px', fontSize: '9px', color: '#ffffff', fontWeight: '800', textShadow: '1px 1px 3px rgba(0,0,0,0.5)' }
};

export default StaffPage;