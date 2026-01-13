import React, { useState, useEffect } from 'react';
import { ShieldAlert, FileText, ClipboardCheck, UploadCloud, MapPin, ArrowLeft, Globe, Loader2, AlertOctagon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const FaultyAssets = () => {
  const navigate = useNavigate();
  const assignedState = localStorage.getItem('userState') || 'ABIA';
  const officerName = localStorage.getItem('username') || '';
  const token = localStorage.getItem('token');

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!token) {
      navigate('/');
    }
  }, [token, navigate]);

  const [formData, setFormData] = useState({
    email: 'imonddcqmp@gmail.com',
    state: assignedState,
    buildingZone: '',
    reportDate: '',
    reportTime: '',
    inspectorName: officerName, // Auto-filled from login session
    utilityLocationType: 'Indoor',
    utilityName: '',
    utilityCode: 'None',
    conditionKey: '3',
    lastInspectionDate: '',
    lastInspectionTime: '',
    lastMaintenanceDue: '',
    lastMaintenanceTime: '',
    nextMaintenanceDue: '',
    nextMaintenanceTime: '',
    actionRequired: '',
    utilityCategory: 'General',
    faultDetails: '',
    readyToSubmit: 'Yes'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.readyToSubmit === 'No') {
      alert("Submission cancelled. Entry remains as draft.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Secure API Call with Auth Token
      await axios.post('http://localhost:5000/api/utilities/submit', formData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      alert("NDDC-QMP Fault/Emergency Register Submitted Successfully!");
      navigate(-1);
    } catch (error) {
      console.error("Submission error:", error);
      alert("Error submitting. Please ensure the server is active and you are logged in.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* MOBILE FRIENDLY STYLING */}
      <style>{`
        body, html { 
          margin: 0 !important; 
          padding: 0 !important; 
          background-color: #f4f7f6 !important; 
          font-family: 'Inter', -apple-system, sans-serif;
          width: 100%;
        }
        
        #root { width: 100%; display: flex; justify-content: center; }

        input:focus, select:focus, textarea:focus { 
          border-color: #006699 !important; 
          outline: none !important; 
          box-shadow: 0 0 0 4px rgba(0, 102, 153, 0.1) !important; 
        }

        .animate-section { animation: fadeInUp 0.5s ease-out forwards; opacity: 0; }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .spin-icon { animation: spin 1s linear infinite; }

        /* MOBILE RESPONSIVENESS */
        @media (max-width: 900px) {
          .form-grid { 
            grid-template-columns: 1fr !important; 
            gap: 20px !important;
          }
          .main-container {
            width: 100% !important;
            padding: 10px !important;
          }
          .preamble-header {
            flex-direction: column !important;
            text-align: center;
          }
          .top-bar {
            flex-direction: column-reverse;
            gap: 15px;
            text-align: center;
          }
        }
      `}</style>

      <div className="main-container" style={styles.mainWrapper}>
        
        {/* TOP BAR */}
        <div style={styles.topBar} className="top-bar">
          <button onClick={() => navigate(-1)} style={styles.backBtn}>
            <ArrowLeft size={18}/> Back to Audit
          </button>
          <div style={{display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center'}}>
             <Globe size={18} color="#006699" />
             <span style={{fontSize: '12px', fontWeight: 'bold', color: '#006699', letterSpacing: '0.3px'}}>Facilitated by Everlink Telesat Network</span>
          </div>
        </div>

        {/* HEADER BLOCK */}
        <div style={styles.preamble} className="animate-section">
          <div style={styles.header} className="preamble-header">
              <AlertOctagon color="#FFD700" size={50} />
              <div>
                <h1 style={styles.mainTitle}>{assignedState} QMP - Fault/Emergency</h1>
                <p style={{margin: '5px 0 0 0', fontSize: '14px', fontWeight: 'bold', opacity: 0.9}}>Email: {formData.email}</p>
                <p style={{margin: '2px 0 0 0', fontSize: '13px', fontWeight: '500'}}>NDDC QMP - {assignedState} Fault/Emergency Register</p>
              </div>
          </div>
          
          <div style={{marginTop: '25px', borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '20px'}}>
            <h4 style={{margin: '0 0 10px 0', fontSize: '16px'}}>Preamble for NDDC - QMP Fault/Emergency Reporting</h4>
            <p style={styles.preambleText}><strong>Purpose:</strong> This form is aimed at providing full details of faults and emergencies. All faults/emergencies must be reported as they are discovered or reported.</p>
            
            <div style={styles.instructionsBox}>
                <p style={{marginTop: 0, fontWeight: 'bold', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px'}}>Instructions for Field Engineers:</p>
                <ul style={{margin: 0, paddingLeft: '20px', fontSize: '13px', lineHeight: '1.7'}}>
                  <li><strong>Verify Physically:</strong> Inspect each asset in person – do not rely on old records</li>
                  <li><strong>Record Accurately:</strong> Note exact specifications, serial numbers, and current condition</li>
                  <li><strong>Flag Issues:</strong> Clearly mark any defective/non-compliant equipment for immediate action</li>
                  <li><strong>Update Changes:</strong> Document new installations, replacements, or decommissioned items</li>
                  <li><strong>Frequency:</strong> Complete inventory audits quarterly or after any major infrastructure changes.</li>
                </ul>
                <p style={{fontSize: '11px', marginTop: '12px', fontStyle: 'italic', opacity: 0.8}}>Note: This inventory directly supports the QMP's preventive maintenance program and regulatory compliance.</p>
            </div>
          </div>
        </div>

        {/* MAIN FORM GRID */}
        <form onSubmit={handleSubmit} style={styles.formGrid} className="form-grid">
          
          {/* LOCATION DESCRIPTION */}
          <section style={{...styles.section, animationDelay: '0.1s'}} className="animate-section">
              <h3 style={styles.secTitle}><MapPin size={18} color="#006699"/> Location Description</h3>
              <label style={styles.fieldLabel}>Location *</label>
              <input style={{...styles.input, backgroundColor: '#f0f0f0', cursor: 'not-allowed'}} value={formData.state} readOnly />
              
              <label style={styles.fieldLabel}>Building/Zone *</label>
              <input style={styles.input} placeholder="e.g. Block C Office 1" required value={formData.buildingZone} onChange={e => setFormData({...formData, buildingZone: e.target.value})} />
              
              <div style={styles.row}>
                  <div><label style={styles.fieldLabel}>Date *</label><input type="date" style={styles.input} required value={formData.reportDate} onChange={e => setFormData({...formData, reportDate: e.target.value})}/></div>
                  <div><label style={styles.fieldLabel}>Time *</label><input type="time" style={styles.input} required value={formData.reportTime} onChange={e => setFormData({...formData, reportTime: e.target.value})}/></div>
              </div>
          </section>

          {/* INSPECTOR DETAILS */}
          <section style={{...styles.section, animationDelay: '0.2s'}} className="animate-section">
              <h3 style={styles.secTitle}><ClipboardCheck size={18} color="#006699"/> Field Inspector's Details</h3>
              <label style={styles.fieldLabel}>Inspector's Details (Surname, First Name) *</label>
              <input style={styles.input} placeholder="e.g. Gilbert favour James" required value={formData.inspectorName} onChange={e => setFormData({...formData, inspectorName: e.target.value})} />
              <label style={styles.fieldLabel}>Utility Location: Outdoor/Indoor *</label>
              <select style={styles.input} value={formData.utilityLocationType} onChange={e => setFormData({...formData, utilityLocationType: e.target.value})}>
                  <option value="Indoor">Indoor</option>
                  <option value="Outdoor">Outdoor</option>
              </select>
          </section>

          {/* UTILITY SPECIFIC */}
          <section style={{...styles.section, animationDelay: '0.3s'}} className="animate-section">
              <h3 style={styles.secTitle}><FileText size={18} color="#006699"/> Utility-Specific Fields (Per QMP Standards)</h3>
              <label style={styles.fieldLabel}>Utility Name *</label>
              <input style={styles.input} placeholder="e.g. Office cabinet 2" required value={formData.utilityName} onChange={e => setFormData({...formData, utilityName: e.target.value})} />
              <label style={styles.fieldLabel}>Utility Code *</label>
              <input style={styles.input} placeholder="Enter code or 'None'" required value={formData.utilityCode} onChange={e => setFormData({...formData, utilityCode: e.target.value})} />
              <label style={styles.fieldLabel}>Upload Image Here *</label>
              <div style={styles.uploadBox}>
                  <input type="file" style={styles.fileInput} accept="image/*" />
                  <UploadCloud size={32} color="#006699" />
                  <span style={{fontSize: '13px', fontWeight: '700', color: '#006699'}}>GPS Map Camera Image Evidence</span>
                  <p style={{fontSize: '11px', color: '#666', margin: 0, padding: '0 10px'}}>Upload a GPS reference image or video (Max 10MB) for tracking</p>
              </div>
          </section>

          {/* CONDITION KEY */}
          <section style={{...styles.section, animationDelay: '0.4s'}} className="animate-section">
              <h3 style={styles.secTitle}><ShieldAlert size={18} color="#006699"/> Condition Key (1-5) *</h3>
              <select style={{...styles.input, height: 'auto', lineHeight: '1.4'}} value={formData.conditionKey} onChange={e => setFormData({...formData, conditionKey: e.target.value})}>
                  <option value="1">1 = Critical Failure: Immediate safety hazard or complete breakdown</option>
                  <option value="2">2 = Major Issues: Partial failure impacting performance</option>
                  <option value="3">3 = Minor Defects: Functional but showing wear/inefficiency</option>
                  <option value="4">4 = Functional: Meets all standards; Minor cosmetic issues</option>
                  <option value="5">5 = Excellent: Like-new condition; Exceeds standards</option>
              </select>
              
              <div style={styles.row}>
                  <div><label style={styles.fieldLabel}>Last Insp. Date *</label><input type="date" style={styles.input} required value={formData.lastInspectionDate} onChange={e => setFormData({...formData, lastInspectionDate: e.target.value})}/></div>
                  <div><label style={styles.fieldLabel}>Time *</label><input type="time" style={styles.input} value={formData.lastInspectionTime} onChange={e => setFormData({...formData, lastInspectionTime: e.target.value})}/></div>
              </div>
              <div style={styles.row}>
                  <div><label style={styles.fieldLabel}>Last Maint. Due *</label><input type="date" style={styles.input} required value={formData.lastMaintenanceDue} onChange={e => setFormData({...formData, lastMaintenanceDue: e.target.value})}/></div>
                  <div><label style={styles.fieldLabel}>Time *</label><input type="time" style={styles.input} value={formData.lastMaintenanceTime} onChange={e => setFormData({...formData, lastMaintenanceTime: e.target.value})}/></div>
              </div>
              <div style={styles.row}>
                  <div><label style={styles.fieldLabel}>Next Maint. Due *</label><input type="date" style={styles.input} required value={formData.nextMaintenanceDue} onChange={e => setFormData({...formData, nextMaintenanceDue: e.target.value})}/></div>
                  <div><label style={styles.fieldLabel}>Time *</label><input type="time" style={styles.input} value={formData.nextMaintenanceTime} onChange={e => setFormData({...formData, nextMaintenanceTime: e.target.value})}/></div>
              </div>
          </section>

          {/* ACTION & CATEGORY */}
          <section style={{...styles.section, animationDelay: '0.5s'}} className="animate-section">
              <h3 style={styles.secTitle}><FileText size={18} color="#006699"/> Action Required</h3>
              <textarea style={styles.textArea} placeholder="e.g. Key replacement needed" required value={formData.actionRequired} onChange={e => setFormData({...formData, actionRequired: e.target.value})} />
              
              <label style={styles.fieldLabel}>Utility Type (QMP Category) *</label>
              <select style={styles.input} value={formData.utilityCategory} onChange={e => setFormData({...formData, utilityCategory: e.target.value})}>
                  <option value="Electrical">Electrical</option>
                  <option value="Water">Water</option>
                  <option value="HVAC">HVAC</option>
                  <option value="IT/Network">IT/Network</option>
                  <option value="Waste Management">Waste Management</option>
                  <option value="General Air Quality">General Air Quality</option>
                  <option value="Furniture">Furniture</option>
                  <option value="General">General</option>
              </select>
          </section>

          {/* SUBMISSION BLOCK */}
          <section style={{...styles.section, animationDelay: '0.6s'}} className="animate-section">
              <h3 style={styles.secTitle}><ShieldAlert size={18} color="#006699"/> Impact Assessment</h3>
              <label style={styles.fieldLabel}>Provide full details of the Fault/Emergency and impact on Work *</label>
              <textarea style={styles.textArea} placeholder="Describe damage and work impact..." required value={formData.faultDetails} onChange={e => setFormData({...formData, faultDetails: e.target.value})} />
              
              <label style={styles.fieldLabel}>Are you ready to submit this entry? *</label>
              <select style={styles.input} value={formData.readyToSubmit} onChange={e => setFormData({...formData, readyToSubmit: e.target.value})}>
                <option value="Yes">Yes - I want to submit</option>
                <option value="No">No - Keep as draft</option>
              </select>

              <button 
                type="submit" 
                disabled={isSubmitting}
                style={{
                  ...styles.submitBtn, 
                  backgroundColor: isSubmitting ? '#004466' : '#006699',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer'
                }}
              >
                {isSubmitting ? (
                  <><Loader2 size={20} className="spin-icon" /> PROCESSING SUBMISSION...</>
                ) : (
                  "SUBMIT EMERGENCY REGISTER"
                )}
              </button>
              <p style={{textAlign: 'center', fontSize: '11px', color: '#999', marginTop: '15px'}}>System Powered by Everlink Telesat Network</p>
          </section>
        </form>
      </div>
    </div>
  );
};

const styles: any = {
    container: { backgroundColor: '#f4f7f6', minHeight: '100vh', width: '100%', display: 'flex', justifyContent: 'center', padding: '30px 15px', boxSizing: 'border-box' },
    mainWrapper: { maxWidth: '1100px', width: '100%', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' },
    topBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', padding: '0 5px' },
    backBtn: { border: 'none', background: '#fff', padding: '10px 18px', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', color: '#006699', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', fontSize: '13px' },
    preamble: { backgroundColor: '#006699', color: 'white', padding: '35px', borderRadius: '24px', marginBottom: '30px', boxShadow: '0 15px 35px rgba(0,102,153,0.25)', boxSizing: 'border-box' },
    mainTitle: { margin: 0, fontSize: '26px', fontWeight: '800', letterSpacing: '-0.5px' },
    header: { display: 'flex', alignItems: 'center', gap: '20px' },
    preambleText: { fontSize: '14px', lineHeight: '1.6', marginBottom: '18px', opacity: 0.95 },
    instructionsBox: { backgroundColor: 'rgba(255,255,255,0.12)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.2)' },
    formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px', width: '100%', boxSizing: 'border-box' },
    section: { backgroundColor: 'white', padding: '30px', borderRadius: '24px', border: '1px solid #eef2f5', display: 'flex', flexDirection: 'column', boxShadow: '0 8px 20px rgba(0,0,0,0.03)', boxSizing: 'border-box' },
    secTitle: { borderBottom: '2px solid #f4f7f6', paddingBottom: '15px', marginBottom: '22px', display: 'flex', alignItems: 'center', gap: '12px', fontWeight: '800', color: '#1a1a1a', fontSize: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' },
    fieldLabel: { fontSize: '13px', fontWeight: '700', color: '#555', marginBottom: '10px', display: 'block' },
    input: { width: '100%', padding: '14px', marginBottom: '20px', border: '2px solid #eef2f5', borderRadius: '12px', boxSizing: 'border-box', fontSize: '15px', backgroundColor: '#fcfdfe', transition: 'all 0.2s' },
    textArea: { width: '100%', height: '120px', padding: '14px', border: '2px solid #eef2f5', borderRadius: '12px', marginBottom: '20px', resize: 'none', boxSizing: 'border-box', fontSize: '15px', backgroundColor: '#fcfdfe' },
    row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' },
    uploadBox: { border: '2px dashed #006699', padding: '30px', borderRadius: '20px', textAlign: 'center', backgroundColor: '#f0f7ff', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', transition: 'all 0.3s' },
    fileInput: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer', zIndex: 10 },
    submitBtn: { width: '100%', padding: '20px', color: 'white', border: 'none', borderRadius: '16px', fontWeight: '800', cursor: 'pointer', fontSize: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', boxShadow: '0 10px 20px rgba(0,102,153,0.2)', marginTop: '10px', transition: 'all 0.3s' }
};

export default FaultyAssets;