import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, ShieldCheck, Globe, ArrowLeft, Loader2, Landmark } from 'lucide-react';
import axios from 'axios';

const Create = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [state, setState] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    try {
      const response = await axios.post(`${apiUrl}/api/auth/register`, {
        username,
        password,
        state,
        role: 'officer' // Default for new staff
      });

      if (response.data.success) {
        alert("STAFF ENROLLMENT SUCCESSFUL: Please proceed to login.");
        navigate('/login');
      }
    } catch (err: any) {
      console.error("Enrollment Error:", err);
      setLoading(false);
      alert(err.response?.data?.message || "NDDC Security: Enrollment Failed");
    }
  };

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-in { animation: slideIn 0.5s ease-out; }
      `}</style>

      <div style={styles.card} className="animate-in">
        {/* HEADER */}
        <div style={styles.header}>
          <button onClick={() => navigate('/login')} style={styles.backBtn}>
            <ArrowLeft size={18} /> Back to Portal
          </button>
          <Landmark color="#006837" size={40} />
          <h2 style={styles.title}>STAFF ENROLLMENT</h2>
          <p style={styles.subtitle}>NDDC QUALITY ASSURANCE MANAGEMENT SYSTEM</p>
        </div>

        <div style={styles.divider} />

        {/* FORM */}
        <form onSubmit={handleRegister} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>OFFICIAL USERNAME / STAFF ID</label>
            <input 
              style={styles.input}
              placeholder="e.g. J.Doe_Rivers"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>ASSIGNED MONITORING STATE</label>
            <select 
              style={styles.input}
              value={state}
              onChange={(e) => setState(e.target.value)}
              required
            >
              <option value="">-- Select State --</option>
              {["Abia", "Akwa Ibom", "Bayelsa", "Cross River", "Delta", "Edo", "Imo", "Rivers", "Ondo", ""].map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>SECURITY ACCESS PASSWORD</label>
            <input 
              type="password"
              style={styles.input}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" style={styles.submitBtn} disabled={loading}>
            {loading ? (
              <><Loader2 className="animate-spin" size={18} /> PROCESSING ENROLLMENT...</>
            ) : (
              <><ShieldCheck size={18} /> CREATE OFFICIAL ACCOUNT</>
            )}
          </button>
        </form>

        {/* FOOTER */}
        <div style={styles.footer}>
          <div style={styles.everlinkTag}>
            <Globe size={12} /> SYSTEM FACILITATED BY EVERLINK TELESAT NETWORK
          </div>
          <p style={styles.copy}>© 2026 NDDC MONITORING UNIT HQ</p>
        </div>
      </div>
    </div>
  );
};

const styles: any = {
  container: {
    height: '100vh',
    width: '100vw',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'linear-gradient(135deg, #003366 0%, #006837 100%)',
    fontFamily: "'Inter', sans-serif",
  },
  card: {
    backgroundColor: '#ffffff',
    width: '450px',
    padding: '40px',
    borderRadius: '20px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
    position: 'relative',
    borderTop: '8px solid #006837',
  },
  backBtn: {
    position: 'absolute',
    top: '20px',
    left: '20px',
    background: 'none',
    border: 'none',
    color: '#003366',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  header: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  title: {
    color: '#003366',
    fontSize: '22px',
    fontWeight: '800',
    margin: '10px 0 5px 0',
    letterSpacing: '1px',
  },
  subtitle: {
    color: '#006837',
    fontSize: '10px',
    fontWeight: 'bold',
    letterSpacing: '1px',
  },
  divider: {
    height: '1px',
    background: '#eee',
    margin: '20px 0',
  },
  inputGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    fontSize: '10px',
    fontWeight: '800',
    color: '#666',
    marginBottom: '8px',
    letterSpacing: '0.5px',
  },
  input: {
    width: '100%',
    padding: '12px 15px',
    borderRadius: '10px',
    border: '1px solid #ddd',
    fontSize: '15px',
    backgroundColor: '#f9f9f9',
    outline: 'none',
    boxSizing: 'border-box',
  },
  submitBtn: {
    width: '100%',
    padding: '15px',
    backgroundColor: '#006837',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '10px',
    transition: 'background 0.3s',
  },
  footer: {
    marginTop: '30px',
    textAlign: 'center',
  },
  everlinkTag: {
    fontSize: '9px',
    color: '#003366',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '5px',
  },
  copy: {
    fontSize: '8px',
    color: '#999',
    marginTop: '10px',
  }
};

export default Create;