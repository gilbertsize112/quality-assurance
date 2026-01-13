import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Image as ImageIcon, Globe, MapPin, Calendar, ChevronRight, X } from 'lucide-react';
import axios from 'axios';

// 1. UPDATED INTERFACE TO INCLUDE IMAGE URL
interface AuditReport {
  _id?: string;
  utilityName: string;
  buildingZone: string;
  reportDate: string;
  actionRequired: string;
  inspectorName: string;
  imageUrl?: string; // New field for actual image path
}

const ImageGallery = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState<AuditReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFolder, setSelectedFolder] = useState<AuditReport | null>(null); 
  
  const token = localStorage.getItem('token');
  const officerName = localStorage.getItem('username') || '';

  useEffect(() => {
    const fetchImages = async () => {
      try {
        // UPDATED TO USE NETWORK IP FOR MOBILE ACCESS
        const res = await axios.get('http://10.53.75.193:5000/api/utilities/all', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const filtered = res.data.filter((r: AuditReport) => r.inspectorName === officerName);
        setReports(filtered);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, [token, officerName]);

  return (
    <div style={styles.container}>
      <style>{`
        .folder-card:hover { transform: translateY(-5px); box-shadow: 0 12px 20px rgba(0,0,0,0.1) !important; }
        .image-item:hover { opacity: 0.9; transform: scale(1.02); }
        @media (max-width: 768px) {
          .main-wrapper { width: 95% !important; padding: 15px !important; }
          .grid-layout { 
            grid-template-columns: 1fr !important; 
            gap: 15px !important;
          }
          .modal-content { width: 95% !important; margin: 0 auto; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="main-wrapper" style={styles.mainWrapper}>
        <div style={styles.topBar}>
          <button onClick={() => navigate(-1)} style={styles.backBtn}>
            <ArrowLeft size={18}/> Back to Form
          </button>
          <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
             <Globe size={20} color="#006699" />
             <span style={{fontSize: '14px', fontWeight: 'bold', color: '#006699'}}>Everlink Telesat Network</span>
          </div>
        </div>

        <div style={styles.headerBlock}>
          <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
            <ImageIcon size={40} color="#FFD700" />
            <div>
              <h1 style={styles.title}>Audit Image Archive</h1>
              <p style={styles.subtitle}>Officer: {officerName.toUpperCase()}</p>
            </div>
          </div>
        </div>

        {loading ? (
          <div style={styles.statusBox}>Connecting to Secure Server...</div>
        ) : reports.length > 0 ? (
          <div className="grid-layout" style={styles.grid}>
            {reports.map((report, index) => (
              <div 
                key={index} 
                className="folder-card" 
                style={styles.folderCard}
                onClick={() => setSelectedFolder(report)}
              >
                <div style={styles.folderHeader}>
                  <MapPin size={16} color="#006699" />
                  <span style={styles.locationLabel}>{report.buildingZone}</span>
                </div>
                <div style={styles.folderBody}>
                  <h3 style={styles.utilityTitle}>{report.utilityName}</h3>
                  <div style={styles.metaRow}>
                    <Calendar size={14} />
                    <span>{report.reportDate}</span>
                  </div>
                </div>
                <div style={styles.folderFooter}>
                  <span style={{fontSize: '12px', fontWeight: '600'}}>View Audit Photos</span>
                  <ChevronRight size={16} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={styles.emptyState}>
            <ImageIcon size={60} color="#ccc" />
            <p>No audit images found in your history.</p>
          </div>
        )}

        {/* IMAGE OVERLAY MODAL */}
        {selectedFolder && (
          <div style={styles.overlay}>
            <div className="modal-content" style={styles.modalContent}>
              <div style={styles.modalHeader}>
                <h2 style={{margin: 0, fontSize: '18px'}}>{selectedFolder.utilityName} - {selectedFolder.buildingZone}</h2>
                <button onClick={() => setSelectedFolder(null)} style={styles.closeBtn}><X size={24}/></button>
              </div>
              <div style={styles.modalBody}>
                <p style={{color: '#666', marginBottom: '20px'}}>Inspection Date: {selectedFolder.reportDate}</p>
                
                <div style={styles.imageGalleryGrid}>
                   {/* ACTUAL IMAGE LOGIC */}
                   {selectedFolder.imageUrl ? (
                      <div style={styles.imageContainer}>
                         <img 
                           src={selectedFolder.imageUrl} 
                           alt="Audit Evidence" 
                           style={styles.modalImage} 
                         />
                      </div>
                   ) : (
                      <div style={styles.mainImagePlaceholder}>
                        <ImageIcon size={80} color="#006699" />
                        <p style={{fontWeight: 'bold', color: '#006699'}}>SECURE IMAGE DATA</p>
                        <p style={{fontSize: '12px', color: '#666'}}>Audit ID: {selectedFolder._id || 'Pending'}</p>
                      </div>
                   )}
                </div>

                <div style={styles.actionInfo}>
                   <strong>Action Required:</strong>
                   <p style={{margin: '5px 0 0 0'}}>{selectedFolder.actionRequired}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const styles: any = {
  container: { 
    minHeight: '100vh', 
    width: '100vw', 
    backgroundColor: '#f4f7f6', 
    display: 'flex', 
    flexDirection: 'column',
    alignItems: 'center', 
    justifyContent: 'flex-start', 
    margin: 0, 
    padding: 0,
    overflowX: 'hidden' 
  },
  mainWrapper: { 
    width: '100%', 
    maxWidth: '1200px', 
    padding: '40px 20px', 
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch'
  },
  topBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', width: '100%' },
  backBtn: { backgroundColor: 'white', border: '1px solid #eef2f5', padding: '12px 20px', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '700', color: '#006699', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' },
  headerBlock: { backgroundColor: '#006699', color: 'white', padding: '35px', borderRadius: '24px', marginBottom: '40px', boxShadow: '0 10px 30px rgba(0,102,153,0.2)', width: '100%', boxSizing: 'border-box' },
  title: { margin: 0, fontSize: '28px', fontWeight: '900' },
  subtitle: { margin: '8px 0 0 0', opacity: 0.9, fontWeight: '500', letterSpacing: '1px' },
  grid: { 
    display: 'grid', 
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
    gap: '25px', 
    width: '100%' 
  },
  folderCard: { backgroundColor: 'white', borderRadius: '20px', border: '1px solid #eef2f5', cursor: 'pointer', transition: 'all 0.3s ease', boxShadow: '0 5px 15px rgba(0,0,0,0.02)', overflow: 'hidden' },
  folderHeader: { padding: '15px 20px', borderBottom: '1px solid #f9f9f9', display: 'flex', alignItems: 'center', gap: '8px' },
  locationLabel: { fontSize: '12px', fontWeight: 'bold', color: '#666', textTransform: 'uppercase' },
  folderBody: { padding: '25px 20px' },
  utilityTitle: { margin: '0 0 10px 0', fontSize: '20px', color: '#333', fontWeight: '800' },
  metaRow: { display: 'flex', alignItems: 'center', gap: '8px', color: '#999', fontSize: '13px' },
  folderFooter: { backgroundColor: '#fcfdfe', padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#006699', borderTop: '1px solid #f4f7f6' },
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' },
  modalContent: { backgroundColor: 'white', width: '100%', maxWidth: '800px', borderRadius: '24px', overflow: 'hidden', animation: 'fadeInUp 0.3s ease' },
  modalHeader: { padding: '20px 25px', backgroundColor: '#006699', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  closeBtn: { background: 'none', border: 'none', color: 'white', cursor: 'pointer' },
  modalBody: { padding: '25px' },
  imageGalleryGrid: { width: '100%', marginBottom: '20px' },
  imageContainer: { width: '100%', borderRadius: '16px', overflow: 'hidden', border: '1px solid #eee', display: 'flex', justifyContent: 'center' },
  modalImage: { width: '100%', maxHeight: '450px', objectFit: 'contain', display: 'block' },
  mainImagePlaceholder: { width: '100%', height: '300px', backgroundColor: '#f0f7ff', borderRadius: '16px', border: '2px dashed #006699', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '10px' },
  actionInfo: { padding: '20px', backgroundColor: '#fff9e6', borderRadius: '12px', border: '1px solid #ffeeba', color: '#856404', fontSize: '14px' },
  statusBox: { textAlign: 'center', padding: '100px', color: '#006699', fontWeight: '800', width: '100%' },
  emptyState: { textAlign: 'center', padding: '100px 20px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', color: '#999' }
};

export default ImageGallery;