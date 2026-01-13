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
    bg: darkMode ? '#121212' : '#eef6f9',
    card: darkMode ? '#1e1e1e' : '#ffffff',
    text: darkMode ? '#ffffff' : '#333333',
    border: darkMode ? '#333333' : '#cce0eb'
  };

  return (
    <div style={{...styles.container, backgroundColor: theme.bg}}>
      <style>{`
        body, html { margin: 0; padding: 0; background-color: ${theme.bg}; transition: 0.3s; overflow-x: hidden; }
        .marquee-wrapper { width: 100%; overflow: hidden; background: #006699; padding: 12px 0; }
        .marquee-content { display: inline-block; white-space: nowrap; animation: scroll 25s linear infinite; color: white; font-weight: 800; font-family: sans-serif; }
        @keyframes scroll { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }
        .animate-fade { animation: fadeIn 0.4s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .state-card:hover { transform: translateY(-10px); border: 2px solid #006699 !important; }
        .clickable-row:hover { background-color: ${darkMode ? '#2a2a2a' : '#f4f9fc'} !important; cursor: pointer; }
      `}</style>

      <div className="marquee-wrapper">
        <div className="marquee-content">
          ADMIN CONTROL CENTER — MONITORING {allReports.length} ASSETS ACROSS 4 STATES — NDDC QUALITY MANAGEMENT PORTAL
        </div>
      </div>

      <div style={styles.mainWrapper}>
        <div style={styles.centralizer}>
          
          <div style={{...styles.topNav, backgroundColor: theme.card}} className="animate-fade">
            <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
              <LayoutDashboard size={28} color="#006699" />
              <h2 style={{color: '#006699', margin: 0, fontSize: '18px', fontWeight: '800'}}>NDDC HQ MONITORING</h2>
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
              <button onClick={() => setDarkMode(!darkMode)} style={{...styles.iconBtn, background: theme.bg, color: theme.text}}>
                  {darkMode ? <Sun size={18}/> : <Moon size={18}/>}
              </button>
              <button onClick={handleLogout} style={styles.logoutBtn}><LogOut size={16}/> Logout</button>
            </div>
          </div>

          {activeFilter === 'NONE' ? (
            <div className="animate-fade" style={{width: '100%'}}>
              <div style={{textAlign: 'center', marginBottom: '40px'}}>
                  <h1 style={{color: theme.text, fontSize: '32px', fontWeight: '800'}}>Welcome, {supervisorName}</h1>
                  <p style={{color: '#666'}}>Select a state region to manage utilities.</p>
              </div>

              <div style={styles.stateGrid}>
                {['ABIA', 'CROSS RIVERS', 'AKWA IBOM', 'IMO STATE'].map((state) => (
                  <div 
                    key={state} 
                    className="state-card" 
                    style={{...styles.stateCard, backgroundColor: theme.card, borderColor: theme.border, transition: '0.3s'}}
                    onClick={() => { setActiveFilter(state); setSubFilter('ALL'); }}
                  >
                     <MapPin size={48} color="#006699" style={{marginBottom: '15px'}} />
                     <h2 style={{color: theme.text, margin: '0'}}>{state}</h2>
                     <p style={{color: '#888', fontSize: '14px'}}>{allReports.filter((r) => r.state === state).length} Assets</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="animate-fade" style={{width: '100%'}}>
              <button onClick={() => setActiveFilter('NONE')} style={styles.backBtn}>
                 <ArrowLeft size={18}/> BACK TO STATES
              </button>

              <div style={{display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '30px'}}>
                 <button 
                   onClick={() => setSubFilter('ALL')}
                   style={{...styles.filterBtn, backgroundColor: subFilter === 'ALL' ? '#006699' : theme.card, color: subFilter === 'ALL' ? 'white' : theme.text}}
                 >
                   <Database size={18}/> REGISTERED UTILITIES
                 </button>
                 <button 
                   onClick={() => setSubFilter('FAULTY')}
                   style={{...styles.filterBtn, backgroundColor: subFilter === 'FAULTY' ? '#e63946' : theme.card, color: subFilter === 'FAULTY' ? 'white' : theme.text}}
                 >
                   <ShieldAlert size={18}/> FAULTY UTILITIES
                 </button>
              </div>

              <div style={styles.actionRow}>
                <div style={{...styles.searchContainer, backgroundColor: theme.card, borderColor: theme.border}}>
                  <Search size={18} color="#006699" />
                  <input 
                    type="text" 
                    placeholder="Search by name or inspector..." 
                    style={{...styles.searchInput, background: 'transparent', color: theme.text}}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <button onClick={downloadPDF} style={styles.pdfBtn}><FileDown size={18} /> EXPORT PDF</button>
              </div>

              <div style={{...styles.tableSection, backgroundColor: theme.card}}>
                <table style={styles.table}>
                  <thead>
                    <tr style={styles.tableHeader}>
                      <th style={styles.th}>DATE</th>
                      <th style={styles.th}>UTILITY</th>
                      <th style={styles.th}>CONDITION</th>
                      <th style={styles.th}>INSPECTOR</th>
                      <th style={styles.th}>ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReports.map((report) => (
                      <tr key={report._id} className="clickable-row" onClick={() => setSelectedReport(report)}>
                        <td style={{...styles.td, color: theme.text}}>{report.reportDate}</td>
                        <td style={{...styles.td, color: theme.text}}><strong>{report.utilityName}</strong></td>
                        <td style={styles.td}>
                           <span style={{
                             padding: '6px 12px', borderRadius: '20px', fontSize: '10px', fontWeight: 'bold',
                             backgroundColor: report.conditionKey === 1 ? '#fee2e2' : '#dcfce7',
                             color: report.conditionKey === 1 ? '#d32f2f' : '#166534'
                           }}>LEVEL {report.conditionKey}</span>
                        </td>
                        <td style={{...styles.td, color: theme.text}}>{report.inspectorName}</td>
                        <td style={styles.td}>
                           <button onClick={(e) => { e.stopPropagation(); setSelectedReport(report); }} style={{border: 'none', background: '#00669910', color: '#006699', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold'}}>VIEW INFO</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* DETAILED MODAL WITH DELETE AND NOTIFY BUTTONS */}
      {selectedReport && (
        <div style={styles.modalOverlay} className="animate-fade">
          <div style={{...styles.modalBox, backgroundColor: theme.card}}>
            <div style={styles.modalHeader}>
              <h2 style={{color: '#006699', margin: 0, fontWeight: '900'}}>ASSET DATA SHEET</h2>
              <button onClick={() => setSelectedReport(null)} style={styles.closeBtn}><X size={24}/></button>
            </div>

            <div style={styles.modalContent}>
               <div style={{...styles.detailFocus, borderLeft: `5px solid ${selectedReport.conditionKey === 1 ? '#e63946' : '#006699'}`}}>
                  <h1 style={{margin: '0', color: theme.text}}>{selectedReport.utilityName}</h1>
                  <p style={{color: '#888', margin: '5px 0'}}>Inspector: {selectedReport.inspectorName}</p>
               </div>

               <div style={styles.recommendationBox}>
                  <AlertCircle size={20} color="#006699" />
                  <div>
                    <label style={{fontSize: '11px', fontWeight: '900', color: '#006699'}}>STATUS & RECOMMENDATION</label>
                    <p style={{margin: '5px 0 0 0', color: '#333', fontSize: '14px'}}>{selectedReport.actionRequired}</p>
                  </div>
               </div>

               {/* NEW ACTIONS AREA */}
               <div style={{display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px'}}>
                  {selectedReport.conditionKey === 1 && (
                    <button 
                        onClick={() => handleNotifyAndFix(selectedReport._id)}
                        style={styles.notifyBtn}
                    >
                        <Send size={16}/> NOTIFY OFFICER & MARK AS FIXED
                    </button>
                  )}
                  
                  <button 
                    onClick={() => handleDeleteReport(selectedReport._id)}
                    style={styles.deleteBtn}
                  >
                    <Trash2 size={16}/> DELETE REPORT FROM DATABASE
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
  container: { minHeight: '100vh', width: '100vw', fontFamily: 'sans-serif' },
  mainWrapper: { width: '100%', display: 'flex', justifyContent: 'center', padding: '20px 0' },
  centralizer: { width: '92%', maxWidth: '1100px' },
  topNav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', padding: '15px 25px', borderRadius: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' },
  stateGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' },
  stateCard: { padding: '40px 20px', borderRadius: '20px', border: '1px solid', textAlign: 'center', cursor: 'pointer' },
  backBtn: { display: 'flex', alignItems: 'center', gap: '8px', border: 'none', background: 'none', color: '#006699', cursor: 'pointer', marginBottom: '20px', fontWeight: 'bold' },
  filterBtn: { flex: 1, padding: '15px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', transition: '0.3s' },
  actionRow: { display: 'flex', justifyContent: 'space-between', gap: '15px', marginBottom: '20px' },
  searchContainer: { display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 20px', borderRadius: '12px', border: '1px solid', flex: 1 },
  searchInput: { border: 'none', outline: 'none', fontSize: '14px', width: '100%' },
  pdfBtn: { backgroundColor: '#006699', color: 'white', border: 'none', padding: '12px 25px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' },
  tableSection: { padding: '20px', borderRadius: '20px', overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: '15px', fontSize: '11px', color: '#999', fontWeight: '800' },
  td: { padding: '15px', fontSize: '13px' },
  logoutBtn: { backgroundColor: '#e63946', color: 'white', border: 'none', padding: '10px 18px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', gap: '8px', fontSize: '12px' },
  iconBtn: { border: 'none', padding: '10px', borderRadius: '12px', cursor: 'pointer' },
  modalOverlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 999, backdropFilter: 'blur(4px)' },
  modalBox: { width: '90%', maxWidth: '450px', padding: '30px', borderRadius: '20px', position: 'relative' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '20px' },
  closeBtn: { background: 'none', border: 'none', cursor: 'pointer', color: '#888' },
  detailFocus: { padding: '15px', backgroundColor: 'rgba(0,102,153,0.05)', borderRadius: '12px', marginBottom: '15px' },
  recommendationBox: { backgroundColor: '#f0f4f8', padding: '15px', borderRadius: '12px', display: 'flex', gap: '12px', marginBottom: '20px' },
  notifyBtn: { backgroundColor: '#4CAF50', color: 'white', border: 'none', padding: '14px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'center', gap: '10px' },
  deleteBtn: { backgroundColor: '#fee2e2', color: '#e63946', border: '1px solid #e63946', padding: '14px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'center', gap: '10px' }
};

export default AdminDashboard;