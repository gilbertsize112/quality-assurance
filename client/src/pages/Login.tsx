import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ShieldCheck, Eye, EyeOff, Globe, Settings, Loader2, UserPlus, LogIn, X, HelpCircle, Mail, KeyRound } from 'lucide-react';
import axios from 'axios';

// --- SUB-COMPONENT: PASSWORD RECOVERY MODAL ---
const ForgotPasswordModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  if (!isOpen) return null;

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsSent(true);
      setTimeout(() => {
        setIsSent(false);
        onClose();
        setEmail('');
      }, 4000);
    } catch (err) {
      alert("System Error: Recovery services temporarily unavailable.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.modalOverlay}>
      <div style={{...styles.registerCard, margin: 'auto'}} className="animate-slide modal-card-mobile">
        <button onClick={onClose} style={styles.closeBtn}><X size={20} /></button>
        {!isSent ? (
          <>
            <div style={{textAlign: 'center', marginBottom: '15px'}}>
               <KeyRound color="#003366" size={35} />
               <h2 style={{color: '#003366', fontSize: '18px', fontWeight: '800', margin: '10px 0 5px 0'}}>PASSWORD RECOVERY</h2>
               <p style={{fontSize: '10px', color: '#006837', fontWeight: 'bold', letterSpacing: '1px'}}>VERIFY OFFICIAL EMAIL IDENTITY</p>
            </div>
            <form onSubmit={handleResetRequest}>
              <div style={{marginBottom: '15px'}}>
                <label style={styles.label}>REGISTERED OFFICIAL EMAIL</label>
                <input 
                  type="email" 
                  style={styles.input} 
                  placeholder="staff.name@nddc.gov.ng" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  required 
                />
              </div>
              <button type="submit" style={styles.submitBtn} disabled={loading}>
                {loading ? "VERIFYING IDENTITY..." : "REQUEST RESET LINK"}
              </button>
            </form>
          </>
        ) : (
          <div style={{textAlign: 'center', padding: '15px 0'}}>
            <div style={{...styles.successCircle, backgroundColor: '#003366', width: '70px', height: '70px'}}>
              <Mail color="#ffffff" size={30} />
            </div>
            <h2 style={{color: '#003366', fontSize: '16px', fontWeight: '900', marginTop: '15px'}}>LINK DISPATCHED</h2>
            <p style={{color: '#666', fontSize: '11px', marginTop: '10px', lineHeight: '1.5'}}>
              A secure reset link has been sent to <br/><strong>{email}</strong>.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// --- SUB-COMPONENT: THE CREATE ACCOUNT CARD (MODAL) ---
const CreateModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [state, setState] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    try {
      const response = await axios.post(`${apiUrl}/api/auth/register`, {
        username,
        email,
        password,
        state,
        role: 'officer'
      });
      if (response.data.success) {
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          onClose();
          setUsername('');
          setEmail('');
          setPassword('');
          setState('');
        }, 3500);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "NDDC Security: Enrollment Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.modalOverlay}>
      <div style={{...styles.registerCard, margin: 'auto'}} className="animate-slide modal-card-mobile">
        {!isSuccess ? (
          <>
            <button onClick={onClose} style={styles.closeBtn}><X size={20} /></button>
            <div style={{textAlign: 'center', marginBottom: '15px'}}>
               <UserPlus color="#006837" size={35} />
               <h2 style={{color: '#003366', fontSize: '18px', fontWeight: '800', margin: '5px 0'}}>STAFF ENROLLMENT</h2>
               <p style={{fontSize: '9px', color: '#006837', fontWeight: 'bold', letterSpacing: '1px'}}>NDDC QUALITY ASSURANCE SYSTEM</p>
            </div>
            <form onSubmit={handleRegister}>
              <div className="enrollment-grid" style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px'}}>
                <div>
                  <label style={styles.label}>STAFF USERNAME</label>
                  <input style={styles.input} placeholder="J.Doe" value={username} onChange={e => setUsername(e.target.value)} required />
                </div>
                <div>
                  <label style={styles.label}>ASSIGNED STATE</label>
                  <input style={styles.input} list="states" placeholder="Select" value={state} onChange={e => setState(e.target.value)} required />
                  <datalist id="states">
                     {["Abia", "Akwa Ibom", "Bayelsa", "Cross River", "Delta", "Edo", "Imo", "Rivers", "Ondo", "Head Quaters"].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </datalist>
                </div>
              </div>
              <div style={{marginBottom: '10px'}}>
                <label style={styles.label}>OFFICIAL EMAIL ADDRESS</label>
                <input type="email" style={styles.input} placeholder="name@nddc.gov.ng" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <div style={{marginBottom: '15px'}}>
                <label style={styles.label}>SECURITY ACCESS PASSWORD</label>
                <input type="password" style={styles.input} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
              </div>
              <button type="submit" style={styles.submitBtn} disabled={loading}>
                {loading ? "ENROLLING..." : "CREATE OFFICIAL ACCOUNT"}
              </button>
            </form>
          </>
        ) : (
          <div style={{textAlign: 'center', padding: '20px 10px'}} className="animate-slide">
            <div style={{...styles.successCircle, width: '70px', height: '70px'}} className="animate-pulse-slow">
              <ShieldCheck color="#ffffff" size={35} />
            </div>
            <h2 style={{color: '#006837', fontSize: '18px', fontWeight: '900', marginTop: '15px'}}>ENROLLMENT SUCCESSFUL</h2>
            <div style={{marginTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'}}>
               <Loader2 size={14} className="animate-spin-slow" color="#006837" />
               <span style={{fontSize: '9px', fontWeight: 'bold', color: '#888'}}>REDIRECTING...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSplash, setShowSplash] = useState(true); 
  const [showRegisterModal, setShowRegisterModal] = useState(false); 
  const [showForgotModal, setShowForgotModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    try {
      const response = await axios.post(`${apiUrl}/api/auth/login`, { username, password });
      if (response.data.success) {
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('username', user.username);
        localStorage.setItem('userRole', user.role);
        localStorage.setItem('userState', user.state);
        setTimeout(() => {
          if (user.role === 'admin') navigate('/admin');
          else navigate('/staff-page');
        }, 1500);
      }
    } catch (err: any) {
      setLoading(false); 
      alert(err.response?.data?.message || "NDDC Security: Invalid Credentials");
    }
  };

  return (
    <div style={styles.loginOverlay}>
      <style>{`
        body, html { margin: 0; padding: 0; overflow: hidden; width: 100%; height: 100%; font-family: 'Inter', sans-serif; }
        input, select { font-size: 15px !important; }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spinSlow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes fadeInOut { 0% { opacity: 0; transform: scale(0.9); } 20% { opacity: 1; transform: scale(1); } 80% { opacity: 1; transform: scale(1); } 100% { opacity: 0; transform: scale(1.1); } }
        @keyframes pulseCustom { 0% { opacity: 0.6; } 50% { opacity: 1; } 100% { opacity: 0.6; } }
        .animate-slide { animation: slideUp 0.6s ease-out; }
        .animate-spin-slow { animation: spinSlow 4s linear infinite; }
        .animate-splash { animation: fadeInOut 5s forwards; }
        .animate-pulse-slow { animation: pulseCustom 2s infinite; }
        
        .logo-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          gap: 20px;
          margin-bottom: 15px;
        }

        .ever-img { width: 110px; height: auto; object-fit: contain; }
        .nddc-img { width: 65px; height: 65px; object-fit: contain; }

        @media (max-width: 450px) {
          .animate-slide { width: 95% !important; padding: 20px 15px !important; }
          .logo-row { gap: 10px; margin-bottom: 10px; }
          .ever-img { width: 85px; }
          .nddc-img { width: 50px; height: 50px; }
          h1 { font-size: 22px !important; }
          
          /* Modal Specific Mobile Fixes */
          .modal-card-mobile {
            padding: 20px 15px !important;
            width: 90% !important;
            max-height: 85vh;
            overflow-y: auto;
            margin: auto !important; /* Forces centering on mobile */
          }
          .enrollment-grid {
            grid-template-columns: 1fr !important;
            gap: 5px !important;
          }
        }
      `}</style>

      {showRegisterModal && <CreateModal isOpen={showRegisterModal} onClose={() => setShowRegisterModal(false)} />}
      {showForgotModal && <ForgotPasswordModal isOpen={showForgotModal} onClose={() => setShowForgotModal(false)} />}

      {loading && (
        <div style={styles.authLoadingOverlay}>
          <div style={{ textAlign: 'center' }}>
            <Loader2 className="animate-spin-slow" color="#006837" size={50} />
            <h2 className="animate-pulse-slow" style={styles.loadingText}>AUTHENTICATING SECURE ACCESS...</h2>
          </div>
        </div>
      )}

      {showSplash ? (
        <div style={styles.splashContainer} className="animate-splash">
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <Settings className="animate-spin-slow" color="#ffffff" size={80} style={{ marginBottom: '30px' }} />
            <h1 style={styles.splashTitle}>QUALITY ASSURANCE <br/> MANAGEMENT SYSTEM</h1>
            <p style={styles.splashSubtitle}>NDDC x EVERLINK TELESAT</p>
          </div>
        </div>
      ) : (
        <div style={styles.darkenLayer}>
          <div style={{...styles.loginCard, margin: 'auto'}} className="animate-slide">
            
            <div className="logo-row">
               <img src="/nddclogo.png" alt="NDDC" className="nddc-img" />
               <div style={{ flex: 1, textAlign: 'center' }}>
                  <span style={styles.facilitatorTag}>OFFICIAL PORTAL</span>
               </div>
               <img src="/everlogo.png" alt="Everlink" className="ever-img" />
            </div>

            <div style={{textAlign: 'center', marginBottom: '15px'}}>
              <h1 style={{color: '#003366', fontSize: '28px', margin: '0', fontWeight: '900', letterSpacing: '1px'}}>NDDC-QMP</h1>
              <p style={{fontSize: '10px', color: '#006837', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '2px', margin: '2px 0'}}>Infrastructure Audit Portal</p>
            </div>
            
            <form onSubmit={handleLogin} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={styles.label}>OFFICIAL USERNAME</label>
                <input style={styles.input} placeholder="Enter your name" value={username} onChange={e => setUsername(e.target.value)} required />
              </div>
              <div style={{ gridColumn: 'span 2', position: 'relative' }}>
                <label style={styles.label}>SECURITY PASSWORD</label>
                <div style={{position: 'relative'}}>
                  <input type={showPassword ? "text" : "password"} style={styles.input} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                    {showPassword ? <EyeOff size={16} color="#006837" /> : <Eye size={16} color="#006837" />}
                  </button>
                </div>
              </div>

              <div style={{ gridColumn: 'span 1', display: 'flex', alignItems: 'center' }}>
                 <button onClick={() => setShowRegisterModal(true)} type="button" style={styles.toggleBtnSmall}>
                   <UserPlus size={12} /> Enrollment
                 </button>
              </div>
              <div style={{ gridColumn: 'span 1', textAlign: 'right' }}>
                <button type="button" onClick={() => setShowForgotModal(true)} style={styles.forgotBtn}>
                  Forgot Password?
                </button>
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <button type="submit" style={styles.submitBtn}>AUTHENTICATE & ENTER</button>
              </div>
            </form>

            <div style={{marginTop: '15px', textAlign: 'center', borderTop: '1px solid #eee', paddingTop: '10px'}}>
              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px'}}>
                 <Globe size={10} color="#006837" />
                 <p style={{fontSize: '8px', color: '#003366', fontWeight: '800', margin: 0, textTransform: 'uppercase'}}>Facilitated by Everlink Telesat Network</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles: any = {
  loginOverlay: { backgroundImage: "linear-gradient(rgba(0, 51, 102, 0.7), rgba(0, 104, 55, 0.7)), url('/login.jpg')", backgroundSize: 'cover', backgroundPosition: 'center', height: '100vh', width: '100vw', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', backgroundColor: '#003366' },
  splashContainer: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(135deg, #003366 0%, #006837 100%)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  splashTitle: { color: '#ffffff', fontSize: 'min(32px, 7vw)', fontWeight: '900', letterSpacing: '1px', lineHeight: '1.2', textTransform: 'uppercase', textAlign: 'center' },
  splashSubtitle: { color: '#ffffff', fontSize: '10px', fontWeight: 'bold', letterSpacing: '3px', marginTop: '15px', opacity: 0.9 },
  authLoadingOverlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(255, 255, 255, 0.95)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000 },
  loadingText: { color: '#003366', fontSize: '12px', fontWeight: 'bold', letterSpacing: '2px', marginTop: '15px' },
  darkenLayer: { height: '100%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '15px', boxSizing: 'border-box' },
  loginCard: { backgroundColor: 'rgba(255, 255, 255, 0.98)', padding: '25px 40px', borderRadius: '20px', width: '100%', maxWidth: '500px', boxShadow: '0 30px 60px -12px rgba(0,0,0,0.6)', borderBottom: '6px solid #006837', position: 'relative' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 3000, padding: '20px', boxSizing: 'border-box' },
  registerCard: { backgroundColor: 'white', padding: '25px 30px', borderRadius: '20px', width: '100%', maxWidth: '450px', position: 'relative', borderTop: '8px solid #006837' },
  closeBtn: { position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', cursor: 'pointer', color: '#888' },
  facilitatorTag: { fontSize: '7px', backgroundColor: '#003366', color: 'white', padding: '3px 10px', borderRadius: '50px', fontWeight: '900', letterSpacing: '1px' },
  label: { display: 'block', fontSize: '9px', fontWeight: '900', color: '#003366', marginBottom: '5px', letterSpacing: '0.5px' },
  input: { width: '100%', padding: '12px', border: '2px solid #eef6f9', borderRadius: '10px', fontSize: '15px', outline: 'none', boxSizing: 'border-box', backgroundColor: '#f8fbff' },
  eyeBtn: { position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer' },
  forgotBtn: { background: 'none', border: 'none', color: '#006837', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer' },
  submitBtn: { width: '100%', padding: '14px', backgroundColor: '#006837', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '900', fontSize: '13px', cursor: 'pointer', letterSpacing: '1px' },
  toggleBtnSmall: { background: 'none', border: 'none', color: '#003366', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' },
  successCircle: { backgroundColor: '#006837', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto' }
};

export default Login;