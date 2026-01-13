import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Clock, CheckCircle, AlertTriangle, FileText, Filter, Globe, Download } from 'lucide-react';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const OfficerReports = () => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  
  // Keep your words: Dike and IMO STATE
  const officerName = localStorage.getItem('username') || 'Dike';
  const assignedState = localStorage.getItem('userState') || 'IMO STATE';

  useEffect(() => {
    if (!token) {
      navigate('/');
    } else {
      fetchMyReports();
    }
  }, [token, navigate]);

  const fetchMyReports = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/utilities/all`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const myData = res.data.filter((r: any) => r.inspectorName === officerName);
      setReports(myData);
      setFilteredReports(myData);
    } catch (err) {
      console.error("Error fetching officer reports:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let result = reports;
    if (statusFilter !== 'ALL') {
      const level = parseInt(statusFilter);
      result = result.filter((r: any) => r.conditionKey === level);
    }
    if (searchTerm) {
      result = result.filter((r: any) => 
        r.utilityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.buildingZone.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredReports(result);
  }, [searchTerm, statusFilter, reports]);

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.setTextColor(0, 102, 153);
    doc.text("NDDC - QMP INFRASTRUCTURE AUDIT REPORT", 14, 20);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`OFFICIAL INSPECTOR: ${officerName.toUpperCase()}`, 14, 30);
    doc.text(`COMMAND UNIT: ${assignedState}`, 14, 35);
    doc.text(`GENERATED ON: ${new Date().toLocaleString()}`, 14, 40);
    doc.text(`TOTAL LOGS: ${filteredReports.length}`, 14, 45);

    const tableRows = filteredReports.map((r: any) => [
      r.reportDate,
      r.utilityName,
      r.buildingZone,
      `Level ${r.conditionKey}`,
      r.actionRequired
    ]);

    autoTable(doc, {
      startY: 55,
      head: [['DATE', 'UTILITY NAME', 'BUILDING/ZONE', 'CONDITION', 'ACTION REQUIRED']],
      body: tableRows,
      headStyles: { fillColor: [0, 102, 153], textColor: [255, 255, 255], fontStyle: 'bold' },
      styles: { fontSize: 8, cellPadding: 3 },
      alternateRowStyles: { fillColor: [245, 247, 246] },
    });
    doc.save(`NDDC_Audit_${officerName}_${assignedState}.pdf`);
  };

  return (
    <div style={styles.container}>
      <style>{`
        body, html, #root {
          background-color: #f4f7f6 !important;
          margin: 0;
          padding: 0;
          min-height: 100vh;
          width: 100%;
          overflow-x: hidden;
        }

        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade { animation: fadeIn 0.4s ease-out forwards; }
        
        .main-wrapper {
          width: 100%;
          max-width: 1600px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 20px 15px 60px 15px;
          box-sizing: border-box;
        }

        .report-card:hover { transform: translateY(-3px); box-shadow: 0 15px 30px rgba(0,0,0,0.1) !important; }

        /* MOBILE OPTIMIZATIONS (Android/iOS) */
        @media (max-width: 768px) {
          .header-row { 
            flex-direction: column !important; 
            align-items: center !important; 
            text-align: center; 
            gap: 25px; 
          }
          .main-title { font-size: 28px !important; }
          .sub-title { font-size: 15px !important; }
          .button-group { width: 100% !important; flex-direction: column !important; }
          .pdf-btn { width: 100% !important; justify-content: center; }
          .count-badge { width: 100% !important; justify-content: center; box-sizing: border-box; }
          
          .filter-bar { flex-direction: column !important; gap: 12px !important; }
          .search-container, .filter-group { width: 100% !important; box-sizing: border-box; }
          
          .card-header { flex-direction: column !important; align-items: flex-start !important; gap: 12px; }
          .card-body { flex-direction: column !important; gap: 15px !important; }
          .card-footer { flex-direction: column !important; gap: 20px; align-items: flex-start !important; }
          .action-text { padding-right: 0 !important; }
          .top-nav { margin-bottom: 25px !important; }
          .report-card { padding: 20px !important; }
        }
      `}</style>

      <div className="main-wrapper">
        <div style={styles.content}>
          
          {/* TOP NAVIGATION */}
          <div style={styles.topNav} className="animate-fade top-nav">
            <button onClick={() => navigate(-1)} style={styles.backBtn}>
              <ArrowLeft size={20} /> BACK
            </button>
            <div style={{ textAlign: 'right' }}>
              <h2 style={styles.officerName}>{officerName}</h2>
              <p style={styles.stateLabel}>{assignedState} COMMAND UNIT</p>
            </div>
          </div>

          {/* HEADER SECTION */}
          <div style={styles.headerBox} className="animate-fade">
            <div className="header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h1 style={styles.mainTitle} className="main-title">My Audit History</h1>
                <p style={styles.subTitle} className="sub-title">Centralized infrastructure database for {assignedState}.</p>
              </div>
              <div className="button-group" style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                <button onClick={exportToPDF} style={styles.pdfBtn} className="pdf-btn">
                  <Download size={20} /> EXPORT PDF
                </button>
                <div style={styles.countBadge} className="count-badge">
                  <FileText size={20} /> {filteredReports.length} LOGS
                </div>
              </div>
            </div>
          </div>

          {/* SEARCH & FILTER BAR */}
          <div style={styles.filterBar} className="animate-fade filter-bar">
            <div style={styles.searchBox} className="search-container">
              <Search size={22} color="#006699" />
              <input 
                placeholder="Search by Utility or Zone..." 
                style={styles.searchInput}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div style={styles.filterGroup} className="filter-group">
              <Filter size={20} color="#666" />
              <select 
                style={styles.select} 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="ALL">All Condition Levels</option>
                <option value="1">Level 1 (Critical)</option>
                <option value="2">Level 2 (Major)</option>
                <option value="3">Level 3 (Minor)</option>
                <option value="4">Level 4 (Functional)</option>
                <option value="5">Level 5 (Excellent)</option>
              </select>
            </div>
          </div>

          {/* REPORTS LIST */}
          <div style={styles.listContainer}>
            {loading ? (
              <div style={styles.emptyState}>Gathering Logs from Everlink Network...</div>
            ) : filteredReports.length > 0 ? (
              filteredReports.map((report: any, idx: number) => (
                <div key={idx} style={styles.reportCard} className="animate-fade report-card">
                  <div style={styles.cardHeader} className="card-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <div style={{
                        ...styles.statusDot, 
                        backgroundColor: report.conditionKey === 1 ? '#e63946' : 
                                         report.conditionKey === 2 ? '#f59e0b' :
                                         report.conditionKey === 3 ? '#FFD700' : '#4CAF50' 
                      }} />
                      <h3 style={styles.utilityName}>{report.utilityName}</h3>
                    </div>
                    <span style={styles.dateStamp}>
                      <Clock size={14} style={{marginRight: '8px'}}/> {report.reportDate} | {report.reportTime}
                    </span>
                  </div>
                  
                  <div style={styles.cardBody} className="card-body">
                    <div style={styles.infoBit}>
                      <Globe size={18} color="#006699" />
                      <span>Zone: <strong>{report.buildingZone}</strong></span>
                    </div>
                    <div style={styles.infoBit}>
                      <AlertTriangle size={18} color="#006699" />
                      <span>Status: <strong>Level {report.conditionKey}</strong></span>
                    </div>
                  </div>

                  <div style={styles.cardFooter} className="card-footer">
                    <p style={styles.actionText}>
                      <strong style={{color: '#1e293b'}}>Recommendation:</strong> {report.actionRequired}
                    </p>
                    {report.conditionKey === 1 ? (
                      <div style={styles.urgentBadge}><AlertTriangle size={14}/> URGENT</div>
                    ) : (
                      <div style={styles.verifiedBadge}><CheckCircle size={14}/> LOGGED</div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div style={styles.emptyState}>
                <Globe size={64} color="#ccc" />
                <p style={{fontSize: '18px'}}>No matching reports found for {officerName}.</p>
              </div>
            )}
          </div>

          <p style={styles.footerBranding}>
            SECURE AUDIT PORTAL — EVERLINK TELESAT NETWORK — NDDC HQ MONITORING
          </p>
        </div>
      </div>
    </div>
  );
};

const styles: any = {
  container: { backgroundColor: '#f4f7f6', minHeight: '100vh', width: '100%', margin: 0, padding: 0, fontFamily: 'Inter, system-ui, sans-serif' },
  content: { width: '100%', maxWidth: '1600px', boxSizing: 'border-box' },
  topNav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', width: '100%' },
  backBtn: { border: 'none', background: '#fff', padding: '12px 20px', borderRadius: '12px', fontWeight: 'bold', color: '#006699', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', fontSize: '14px' },
  officerName: { margin: 0, fontSize: '18px', fontWeight: '900', color: '#1a1a1a' },
  stateLabel: { margin: 0, fontSize: '12px', color: '#006699', fontWeight: 'bold', letterSpacing: '1px' },
  headerBox: { backgroundColor: '#006699', padding: '30px', borderRadius: '25px', color: 'white', marginBottom: '35px', boxShadow: '0 20px 40px rgba(0,102,153,0.15)', width: '100%', boxSizing: 'border-box' },
  mainTitle: { margin: 0, fontSize: '36px', fontWeight: '900', letterSpacing: '-1px' },
  subTitle: { margin: '10px 0 0 0', opacity: 0.9, fontSize: '18px' },
  pdfBtn: { backgroundColor: '#FFD700', color: '#00334d', border: 'none', padding: '15px 25px', borderRadius: '15px', fontWeight: '900', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', boxShadow: '0 8px 20px rgba(255,215,0,0.3)', transition: '0.2s' },
  countBadge: { backgroundColor: 'rgba(255,255,255,0.15)', padding: '15px 20px', borderRadius: '15px', display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 'bold', fontSize: '15px', border: '1px solid rgba(255,255,255,0.2)' },
  filterBar: { display: 'flex', gap: '15px', marginBottom: '30px', width: '100%' },
  searchBox: { flex: 1, backgroundColor: 'white', display: 'flex', alignItems: 'center', gap: '15px', padding: '0 20px', borderRadius: '18px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' },
  searchInput: { border: 'none', outline: 'none', height: '60px', width: '100%', fontSize: '16px', background: 'transparent' },
  filterGroup: { backgroundColor: 'white', display: 'flex', alignItems: 'center', gap: '12px', padding: '0 20px', borderRadius: '18px', border: '1px solid #e2e8f0' },
  select: { border: 'none', outline: 'none', height: '60px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', color: '#333', background: 'transparent' },
  listContainer: { display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' },
  reportCard: { backgroundColor: 'white', padding: '30px', borderRadius: '22px', border: '1px solid #eef0f2', boxShadow: '0 8px 20px rgba(0,0,0,0.04)', transition: '0.3s ease', width: '100%', boxSizing: 'border-box' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #f1f5f9', paddingBottom: '15px' },
  statusDot: { width: '14px', height: '14px', borderRadius: '50%', boxShadow: '0 0 10px rgba(0,0,0,0.1)' },
  utilityName: { margin: 0, fontSize: '22px', fontWeight: '900', color: '#0f172a' },
  dateStamp: { fontSize: '13px', color: '#64748b', fontWeight: '600', display: 'flex', alignItems: 'center' },
  cardBody: { display: 'flex', gap: '30px', marginBottom: '25px' },
  infoBit: { display: 'flex', alignItems: 'center', gap: '10px', fontSize: '16px', color: '#334155' },
  cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc', padding: '20px', borderRadius: '15px', border: '1px solid #e2e8f0' },
  actionText: { margin: 0, fontSize: '15px', color: '#475569', flex: 1, paddingRight: '15px', lineHeight: '1.5' },
  urgentBadge: { backgroundColor: '#fee2e2', color: '#dc2626', padding: '8px 16px', borderRadius: '10px', fontSize: '12px', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '6px' },
  verifiedBadge: { backgroundColor: '#f0fdf4', color: '#16a34a', padding: '8px 16px', borderRadius: '10px', fontSize: '12px', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '6px' },
  emptyState: { textAlign: 'center', padding: '100px 0', color: '#94a3b8', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' },
  footerBranding: { textAlign: 'center', fontSize: '11px', color: '#94a3b8', marginTop: '50px', letterSpacing: '1.5px', fontWeight: 'bold' }
};

export default OfficerReports;