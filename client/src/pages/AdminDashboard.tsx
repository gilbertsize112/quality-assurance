import { useState, useEffect } from 'react';
import { LayoutDashboard, LogOut, ShieldAlert, CheckCircle, MapPin, Search, FileDown, Globe, Moon, Sun, ArrowLeft, Database, X, User, Calendar, Clock, AlertCircle, Trash2, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const AdminDashboard = () => {
  const [allReports, setAllReports] = useState<any[]>([]);
  const [filteredReports, setFilteredReports] = useState<any[]>([]);
  const [activeFilter, setActiveFilter] = useState('NONE'); 
  const [subFilter, setSubFilter] = useState('ALL'); // 'ALL' for Registered, 'FAULTY' for Level 1
  const [searchTerm, setSearchTerm] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  
  const navigate = useNavigate();
  const supervisorName = localStorage.getItem('username') || 'Supervisor';
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/');
    } else {
      fetchReports();
    }
  }, [token, navigate]);

  const fetchReports = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/utilities/all', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setAllReports(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        localStorage.clear();
        navigate('/');
      }
    }
  };

  // Notification / Resolve Logic
  const handleNotifyAndFix = async (reportId: string) => {
    try {
        // Optimistic update for UI feel
        const updated = allReports.map(r => r._id === reportId ? { ...r, conditionKey: 3, actionRequired: "RESOLVED/FIXED" } : r);
        setAllReports(updated);
        
        // Backend update (Assuming your API supports PATCH)
        await axios.patch(`http://localhost:5000/api/utilities/${reportId}`, 
          { conditionKey: 3, actionRequired: "RESOLVED: Utility Officer Notified & Fixed" },
          { headers: { 'Authorization': `Bearer ${token}` }}
        );
        alert("Notification sent! Utility marked as fixed.");
        setSelectedReport(null);
    } catch (err) {
        console.error("Update error", err);
    }
  };

  // Delete Logic
  const handleDeleteReport = async (reportId: string) => {
    if (window.confirm("Are you sure you want to permanently delete this report from the database?")) {
        try {
            await axios.delete(`http://localhost:5000/api/utilities/${reportId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setAllReports(allReports.filter(r => r._id !== reportId));
            setSelectedReport(null);
        } catch (err) {
            console.error("Delete failed", err);
        }
    }
  };

  useEffect(() => {
    let result = allReports;

    // Filter by State
    if (activeFilter !== 'ALL' && activeFilter !== 'NONE') {
      result = result.filter((r: any) => 
        r.state === activeFilter || r.broadcastToAll === true
      );
    }

    // Sub-Filter: Registered vs Faulty
    if (subFilter === 'FAULTY') {
        result = result.filter((r: any) => r.conditionKey === 1);
    }

    // Search Bar
    if (searchTerm) {
      result = result.filter((r: any) => 
        r.utilityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.inspectorName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredReports(result);
  }, [searchTerm, activeFilter, subFilter, allReports]);

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.setTextColor(0, 102, 153);
    doc.text('NDDC - QMP AUDIT REPORT', 14, 20);
    const tableColumn = ["Date", "State", "Utility Name", "Condition", "Inspector"];
    const tableRows = filteredReports.map((report: any) => [
      report.reportDate, report.state, report.utilityName, `Level ${report.conditionKey}`, report.inspectorName
    ]);
    autoTable(doc, { head: [tableColumn], body: tableRows, startY: 35 });
    doc.save(`NDDC_${activeFilter}_Report.pdf`);
  };

  const handleLogout = () => { localStorage.clear(); navigate('/'); };

  const theme = {
    bg: 'transparent', 
    card: darkMode ? 'rgba(25, 25, 25, 0.94)' : 'rgba(255, 255, 255, 0.92)',
    text: darkMode ? '#ffffff' : '#1a1a1a',
    border: darkMode ? '#333333' : '#e0e0e0',
    primary: '#006699', // Blue
    secondary: '#006837' // Green
  };

  return (
    <div style={{
        ...styles.container, 
        backgroundImage: `linear-gradient(${darkMode ? 'rgba(0,0,0,0.85)' : 'rgba(0,0,0,0.4)'}, ${darkMode ? 'rgba(0,0,0,0.85)' : 'rgba(0,0,0,0.4)'}), url('/admin.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat',
        backgroundColor: 'transparent'
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap');
        
        html, body, #root { 
          margin: 0 !important; 
          padding: 0 !important; 
          background-color: transparent !important; 
          min-height: 100vh;
        }

        .animate-fade { animation: fadeIn 0.4s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        @keyframes float-logo {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-5px) rotate(2deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        .moving-logo { animation: float-logo 3s ease-in-out infinite; }
        
        /* RESTORED: Beautiful Hover Effect */
        .state-card:hover { 
          transform: translateY(-8px) scale(1.02) !important; 
          border: 2px solid ${theme.secondary} !important; 
          box-shadow: 0 15px 30px rgba(0,104,55,0.25) !important; 
          background-color: ${darkMode ? 'rgba(35, 35, 35, 0.98)' : 'rgba(255, 255, 255, 1)'} !important;
        }

        .clickable-row:hover { background-color: ${darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,104,55,0.05)'} !important; cursor: pointer; }
        
        @media (max-width: 768px) {
          .header-container { padding: 15px !important; }
          .state-grid { grid-template-columns: 1fr !important; }
          .action-row { flex-direction: column !important; }
          .filter-group { flex-direction: column !important; gap: 10px !important; }
          .hide-mobile { display: none !important; }
          .logo-box-mobile { transform: scale(0.8); }
        }
      `}</style>

      <div style={styles.mainWrapper}>
        <div style={styles.centralizer}>
          
          <div style={{...styles.topNav, backgroundColor: theme.card, backdropFilter: 'blur(15px)'}} className="animate-fade header-container">
            <div style={styles.headerTop} className="logo-box-mobile">
                <img src="/nddclogo.png" alt="NDDC" style={styles.logoNddc} className="moving-logo" />
                <div style={{textAlign: 'center'}}>
                    <h2 style={{color: theme.primary, margin: 0, fontSize: '18px', fontWeight: '800', letterSpacing: '0.5px'}}>NDDC COMMAND CENTER</h2>
                    <p style={{color: theme.secondary, margin: 0, fontSize: '10px', fontWeight: 'bold'}}>QUALITY MANAGEMENT PORTAL</p>
                </div>
                <img src="/everlogo.png" alt="Everlink" style={styles.logoEver} className="moving-logo" />
            </div>

            <div style={{...styles.headerBottom, borderTop: `1px solid ${theme.border}`}}>
               <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                  <div style={{...styles.avatar, backgroundColor: theme.secondary}}>
                    <User size={18} color="white" />
                  </div>
                  <div>
                    <p style={{margin: 0, fontSize: '13px', color: theme.text, fontWeight: '700'}}>{supervisorName}</p>
                    <p style={{margin: 0, fontSize: '10px', color: darkMode ? '#bbb' : '#777'}}>Administrator</p>
                  </div>
               </div>

               <div style={{display: 'flex', gap: '8px'}}>
                  <button onClick={() => setDarkMode(!darkMode)} style={{...styles.iconBtn, background: darkMode ? '#333' : '#eee', color: theme.text}}>
                      {darkMode ? <Sun size={18}/> : <Moon size={18}/>}
                  </button>
                  <button onClick={handleLogout} style={styles.logoutBtn}><LogOut size={16}/> <span className="hide-mobile">Logout</span></button>
               </div>
            </div>
          </div>

          {activeFilter === 'NONE' ? (
            <div className="animate-fade" style={{width: '100%'}}>
              <div style={{textAlign: 'center', marginBottom: '40px', padding: '0 20px'}}>
                  <h1 style={{color: '#ffffff', fontSize: '28px', fontWeight: '800', margin: '0', textShadow: '2px 2px 4px rgba(0,0,0,0.5)'}}>Regional Overview</h1>
                  <p style={{color: '#f0f0f0', marginTop: '8px', fontSize: '14px', fontWeight: '700'}}>Select a Niger Delta state to view audited utility assets.</p>
              </div>

              <div style={styles.stateGrid} className="state-grid">
                {['ABIA', 'CROSS RIVERS', 'AKWA IBOM', 'IMO STATE'].map((state) => (
                  <div 
                    key={state} 
                    className="state-card" 
                    style={{...styles.stateCard, backgroundColor: theme.card, borderColor: theme.border, backdropFilter: 'blur(10px)'}}
                    onClick={() => { setActiveFilter(state); setSubFilter('ALL'); }}
                  >
                     <div style={{...styles.iconCircle, backgroundColor: `${theme.primary}20`}}>
                        <MapPin size={32} color={theme.primary} />
                     </div>
                     <h2 style={{color: theme.text, margin: '15px 0 5px 0', fontSize: '20px', fontWeight: '800'}}>{state}</h2>
                     <div style={{height: '4px', width: '40px', backgroundColor: theme.secondary, margin: '10px auto', borderRadius: '2px'}}></div>
                     <p style={{color: theme.secondary, fontSize: '13px', fontWeight: '700'}}>
                        {allReports.filter((r) => r.state === state).length} Assets Verified
                     </p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="animate-fade" style={{width: '100%'}}>
              <button onClick={() => setActiveFilter('NONE')} style={{...styles.backBtn, color: theme.primary, backgroundColor: theme.card, padding: '8px 15px', borderRadius: '20px'}}>
                  <ArrowLeft size={18}/> BACK TO REGIONS
              </button>

              <div style={styles.filterGroup} className="filter-group">
                 <button 
                   onClick={() => setSubFilter('ALL')}
                   style={{...styles.filterBtn, backgroundColor: subFilter === 'ALL' ? theme.primary : theme.card, color: subFilter === 'ALL' ? 'white' : theme.text, backdropFilter: 'blur(10px)'}}
                 >
                   <Database size={18}/> REGISTERED ASSETS
                 </button>
                 <button 
                   onClick={() => setSubFilter('FAULTY')}
                   style={{...styles.filterBtn, backgroundColor: subFilter === 'FAULTY' ? '#e63946' : theme.card, color: subFilter === 'FAULTY' ? 'white' : theme.text, backdropFilter: 'blur(10px)'}}
                 >
                   <ShieldAlert size={18}/> FAULTY REPORTS
                 </button>
              </div>

              <div style={styles.actionRow} className="action-row">
                <div style={{...styles.searchContainer, backgroundColor: theme.card, borderColor: theme.border, backdropFilter: 'blur(10px)'}}>
                  <Search size={18} color={theme.primary} />
                  <input 
                    type="text" 
                    placeholder="Search asset or inspector..." 
                    style={{...styles.searchInput, background: 'transparent', color: theme.text}}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <button onClick={downloadPDF} style={{...styles.pdfBtn, backgroundColor: theme.secondary}}><FileDown size={18} /> EXPORT DATA</button>
              </div>

              <div style={{...styles.tableSection, backgroundColor: theme.card, backdropFilter: 'blur(12px)'}}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={{...styles.th, color: darkMode ? '#ccc' : '#666', borderBottom: `1px solid ${theme.border}`}}>DATE</th>
                      <th style={{...styles.th, color: darkMode ? '#ccc' : '#666', borderBottom: `1px solid ${theme.border}`}}>UTILITY NAME</th>
                      <th style={{...styles.th, color: darkMode ? '#ccc' : '#666', borderBottom: `1px solid ${theme.border}`}}>CONDITION</th>
                      <th style={{...styles.th, color: darkMode ? '#ccc' : '#666', borderBottom: `1px solid ${theme.border}`}} className="hide-mobile">INSPECTOR</th>
                      <th style={{...styles.th, color: darkMode ? '#ccc' : '#666', borderBottom: `1px solid ${theme.border}`}}>ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReports.map((report) => (
                      <tr key={report._id} className="clickable-row" onClick={() => setSelectedReport(report)}>
                        <td style={{...styles.td, color: theme.text, borderBottom: `1px solid ${theme.border}`}}>{report.reportDate}</td>
                        <td style={{...styles.td, color: theme.text, borderBottom: `1px solid ${theme.border}`}}><strong>{report.utilityName}</strong></td>
                        <td style={{...styles.td, borderBottom: `1px solid ${theme.border}`}}>
                           <span style={{
                             padding: '5px 10px', borderRadius: '6px', fontSize: '10px', fontWeight: '800',
                             backgroundColor: report.conditionKey === 1 ? 'rgba(230, 57, 70, 0.2)' : 'rgba(0, 104, 55, 0.2)',
                             color: report.conditionKey === 1 ? '#ff4d4d' : theme.secondary
                           }}>{report.conditionKey === 1 ? '⚠️ FAULTY' : '✅ GOOD'}</span>
                        </td>
                        <td style={{...styles.td, color: theme.text, borderBottom: `1px solid ${theme.border}`}} className="hide-mobile">{report.inspectorName}</td>
                        <td style={{...styles.td, borderBottom: `1px solid ${theme.border}`}}>
                           <button onClick={(e) => { e.stopPropagation(); setSelectedReport(report); }} style={{...styles.viewBtn, backgroundColor: theme.primary, color: 'white'}}>VIEW</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredReports.length === 0 && (
                  <div style={{padding: '40px', textAlign: 'center', color: theme.text, fontWeight: '600'}}>No assets found for this criteria.</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* DETAILED MODAL */}
      {selectedReport && (
        <div style={styles.modalOverlay} className="animate-fade">
          <div style={{...styles.modalBox, backgroundColor: darkMode ? '#1e1e1e' : '#ffffff'}}>
            <div style={styles.modalHeader}>
              <h3 style={{color: theme.primary, margin: 0, fontWeight: '800'}}>ASSET RECORD</h3>
              <button onClick={() => setSelectedReport(null)} style={styles.closeBtn}><X size={24}/></button>
            </div>

            <div style={styles.modalContent}>
               <div style={{...styles.detailFocus, borderLeft: `4px solid ${selectedReport.conditionKey === 1 ? '#e63946' : theme.secondary}`, backgroundColor: darkMode ? '#2a2a2a' : '#f9f9f9'}}>
                  <h1 style={{margin: '0', color: theme.text, fontSize: '20px'}}>{selectedReport.utilityName}</h1>
                  <p style={{color: '#777', margin: '4px 0', fontSize: '12px'}}>Ref: {selectedReport._id.substring(0,8)} | {selectedReport.state}</p>
               </div>

               <div style={{...styles.recommendationBox, backgroundColor: darkMode ? '#162b3d' : '#f0f7ff', borderColor: darkMode ? theme.primary : '#d0e4ff'}}>
                  <AlertCircle size={20} color={theme.primary} />
                  <div>
                    <label style={{fontSize: '10px', fontWeight: '900', color: theme.primary, textTransform: 'uppercase'}}>Current Status</label>
                    <p style={{margin: '3px 0 0 0', color: theme.text, fontSize: '13px', lineHeight: '1.5'}}>{selectedReport.actionRequired}</p>
                  </div>
               </div>

               <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                  {selectedReport.conditionKey === 1 && (
                    <button 
                        onClick={() => handleNotifyAndFix(selectedReport._id)}
                        style={{...styles.notifyBtn, backgroundColor: theme.secondary}}
                    >
                        <Send size={16}/> NOTIFY & RESOLVE
                    </button>
                  )}
                  
                  <button 
                    onClick={() => handleDeleteReport(selectedReport._id)}
                    style={styles.deleteBtn}
                  >
                    <Trash2 size={16}/> PERMANENT DELETE
                  </button>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles: any = {
  container: { minHeight: '100vh', width: '100vw', display: 'block' },
  mainWrapper: { width: '100%', display: 'flex', justifyContent: 'center', padding: '15px 0', backgroundColor: 'transparent' },
  centralizer: { width: '95%', maxWidth: '1100px' },
  
  topNav: { borderRadius: '16px', padding: '20px', marginBottom: '25px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' },
  headerTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' },
  headerBottom: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '15px' },
  logoNddc: { width: '65px', height: '65px', objectFit: 'contain' },
  logoEver: { width: '110px', height: 'auto', objectFit: 'contain' },
  avatar: { width: '36px', height: '36px', borderRadius: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center' },
  
  stateGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px' },
  stateCard: { padding: '30px 15px', borderRadius: '20px', border: '1px solid', textAlign: 'center', cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' },
  iconCircle: { width: '60px', height: '60px', borderRadius: '50%', margin: '0 auto', display: 'flex', justifyContent: 'center', alignItems: 'center' },
  
  backBtn: { display: 'flex', alignItems: 'center', gap: '8px', border: 'none', cursor: 'pointer', marginBottom: '20px', fontWeight: '800', fontSize: '11px' },
  filterGroup: { display: 'flex', gap: '15px', marginBottom: '25px' },
  filterBtn: { flex: 1, padding: '14px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '12px', transition: '0.3s', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' },
  actionRow: { display: 'flex', justifyContent: 'space-between', gap: '15px', marginBottom: '20px' },
  searchContainer: { display: 'flex', alignItems: 'center', gap: '10px', padding: '0 15px', borderRadius: '12px', border: '1px solid', flex: 1, height: '45px' },
  searchInput: { border: 'none', outline: 'none', fontSize: '13px', width: '100%' },
  pdfBtn: { color: 'white', border: 'none', padding: '0 20px', borderRadius: '12px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', height: '45px' },
  
  tableSection: { borderRadius: '16px', overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.08)' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: '15px', fontSize: '10px', fontWeight: '800', background: 'rgba(0,0,0,0.05)' },
  td: { padding: '15px', fontSize: '13px' },
  viewBtn: { border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', fontWeight: '800' },
  
  logoutBtn: { backgroundColor: '#e63946', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', display: 'flex', gap: '6px', fontSize: '11px', alignItems: 'center' },
  iconBtn: { border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center' },
  
  modalOverlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,30,60,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 999, backdropFilter: 'blur(6px)', padding: '20px' },
  modalBox: { width: '100%', maxWidth: '420px', padding: '25px', borderRadius: '24px', position: 'relative', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  closeBtn: { background: 'none', border: 'none', cursor: 'pointer', color: '#aaa' },
  detailFocus: { padding: '15px', borderRadius: '12px', marginBottom: '15px' },
  recommendationBox: { padding: '15px', borderRadius: '15px', display: 'flex', gap: '12px', marginBottom: '20px', border: '1px solid' },
  notifyBtn: { color: 'white', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '800', cursor: 'pointer', display: 'flex', justifyContent: 'center', gap: '10px', fontSize: '12px' },
  deleteBtn: { backgroundColor: '#fff5f5', color: '#e63946', border: '1px solid #fed7d7', padding: '14px', borderRadius: '12px', fontWeight: '800', cursor: 'pointer', display: 'flex', justifyContent: 'center', gap: '10px', fontSize: '12px' }
};

export default AdminDashboard;