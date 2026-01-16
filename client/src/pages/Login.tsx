import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Eye, EyeOff, Globe, Settings, Loader2 } from 'lucide-react';
import axios from 'axios';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSplash, setShowSplash] = useState(true); // State for the 5s welcome screen
  const navigate = useNavigate();

  // Handle the 5-second Splash Screen timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await axios.post(`${apiUrl}/api/auth/login`, {
        username,
        password
      });

      if (response.data.success) {
        const { token, user } = response.data;

        localStorage.setItem('token', token);
        localStorage.setItem('username', user.username);
        localStorage.setItem('userRole', user.role);
        localStorage.setItem('userState', user.state);

        // Small delay so the user can see the "Authentication Successful" state
        setTimeout(() => {
          if (user.role === 'admin') {
            navigate('/admin');
          } else {
            navigate('/officer-form');
          }
        }, 1500);
      }
    } catch (err: any) {
      console.error("Login Error:", err);
      setLoading(false); // Stop loading to show the error
      alert(err.response?.data?.message || "NDDC Security: Invalid Credentials");
    }
  };

  return (
    <div style={styles.loginOverlay}>
      <style>{`
        body, html {
          margin: 0 !important;
          padding: 0 !important;
          overflow: hidden !important;
          width: 100%;
          height: 100%;
          position: fixed; 
        }

        input {
          font-size: 16px !important; 
        }

        /* Animations */
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes fadeInOut {
          0% { opacity: 0; transform: scale(0.9); }
          20% { opacity: 1; transform: scale(1); }
          80% { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(1.1); }
        }

        @keyframes pulseCustom {
          0% { opacity: 0.6; }
          50% { opacity: 1; }
          100% { opacity: 0.6; }
        }

        .animate-slide { animation: slideUp 0.6s ease-out; }
        .animate-spin-slow { animation: spinSlow 4s linear infinite; }
        .animate-splash { animation: fadeInOut 5s forwards; }
        .animate-pulse-slow { animation: pulseCustom 2s infinite; }
        
        @media (max-width: 480px) {
          .login-card { 
            width: 92% !important; 
            padding: 30px 20px !important;
            margin: 10px;
          }
          .portal-title {
            font-size: 20px !important;
          }
          .submit-btn {
            padding: 14px !important;
            font-size: 13px !important;
          }
          .splash-text {
            font-size: 18px !important;
            padding: 0 20px;
          }
        }

        @supports (padding: env(safe-area-inset-top)) {
          .login-container {
            padding-top: env(safe-area-inset-top);
            padding-bottom: env(safe-area-inset-bottom);
          }
        }
      `}</style>

      {/* --- AUTHENTICATION LOADING OVERLAY (Shows when logging in) --- */}
      {loading && (
        <div style={styles.authLoadingOverlay}>
          <div style={{ textAlign: 'center' }}>
            <Loader2 className="animate-spin-slow" color="#00aaff" size={60} style={{ marginBottom: '20px' }} />
            <h2 className="animate-pulse-slow" style={styles.loadingText}>AUTHENTICATING SECURE ACCESS...</h2>
            <p style={{ color: '#aaa', fontSize: '10px', letterSpacing: '2px' }}>NDDC QUALITY ASSURANCE GATEWAY</p>
          </div>
        </div>
      )}

      {/* --- WELCOME SPLASH SCREEN (Shows for 5 Seconds) --- */}
      {showSplash ? (
        <div style={styles.splashContainer} className="animate-splash">
          <div style={{ textAlign: 'center' }}>
            <Settings className="animate-spin-slow" color="#ffffff" size={80} style={{ marginBottom: '30px', opacity: 0.9 }} />
            <h1 className="splash-text" style={styles.splashTitle}>
              WELCOME TO OUR QUALITY ASSURANCE <br/> MANAGEMENT SYSTEM FOR NDDC
            </h1>
            <p style={styles.splashSubtitle}>FACILITATED BY EVERLINK TELESAT</p>
          </div>
        </div>
      ) : (
        /* --- MAIN LOGIN PAGE (Shows after Splash) --- */
        <div style={styles.darkenLayer} className="login-container">
          <div style={styles.loginCard} className="animate-slide login-card">
            
            {/* TOP TAG */}
            <div style={{display: 'flex', justifyContent: 'center', marginBottom: '10px'}}>
               <span style={styles.facilitatorTag}>FACILITATED BY EVERLINK TELESAT</span>
            </div>

            <div style={{textAlign: 'center', marginBottom: '25px'}}>
              <div style={styles.iconCircle}>
                <ShieldAlert color="#006699" size={40} />
              </div>
              <h1 className="portal-title" style={{color: '#006699', fontSize: '24px', marginTop: '12px', fontWeight: '800', letterSpacing: '1px', marginBottom: '5px'}}>NDDC-QMP</h1>
              <p style={{fontSize: '10px', color: '#666', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '2px'}}>Infrastructure Audit Portal</p>
            </div>

            <form onSubmit={handleLogin}>
              <div style={{marginBottom: '18px'}}>
                <label style={styles.label}>OFFICIAL USERNAME</label>
                <input 
                  style={styles.input} 
                  placeholder="Enter your name" 
                  onChange={e => setUsername(e.target.value)} 
                  required
                />
              </div>
              
              <div style={{marginBottom: '22px', position: 'relative'}}>
                <label style={styles.label}>SECURITY PASSWORD</label>
                <div style={{position: 'relative'}}>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    style={styles.input} 
                    placeholder="••••••••" 
                    onChange={e => setPassword(e.target.value)} 
                    required
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={styles.eyeBtn}
                  >
                    {showPassword ? <EyeOff size={18} color="#006699" /> : <Eye size={18} color="#006699" />}
                  </button>
                </div>
              </div>

              <button type="submit" style={styles.submitBtn} className="submit-btn" disabled={loading}>
                {loading ? "VERIFYING..." : "AUTHENTICATE & ENTER"}
              </button>
            </form>
            
            {/* FOOTER SECTION */}
            <div style={{marginTop: '25px', textAlign: 'center', borderTop: '1px solid #eee', paddingTop: '20px'}}>
              <p style={{fontSize: '9px', color: '#888', marginBottom: '8px', fontWeight: 'bold'}}>
                © 2026 NDDC MONITORING UNIT | HQ PORT HARCOURT
              </p>
              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px'}}>
                 <Globe size={12} color="#006699" />
                 <p style={{fontSize: '9px', color: '#006699', fontWeight: '800', margin: 0}}>
                   System Facilitated by Everlink Telesat Network
                 </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles: any = {
  loginOverlay: { 
    backgroundImage: "url('/login.jpg')", 
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    height: '100vh', 
    width: '100vw',
    margin: 0,
    padding: 0,
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center',
    position: 'relative',
    backgroundColor: '#001e3c'
  },
  splashContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 30, 60, 0.95)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  splashTitle: {
    color: '#ffffff',
    fontSize: '28px',
    fontWeight: '800',
    letterSpacing: '1px',
    lineHeight: '1.4',
    textTransform: 'uppercase'
  },
  splashSubtitle: {
    color: '#00aaff',
    fontSize: '12px',
    fontWeight: 'bold',
    letterSpacing: '4px',
    marginTop: '20px',
    opacity: 0.8
  },
  authLoadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 15, 30, 0.9)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2000,
  },
  loadingText: {
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: 'bold',
    letterSpacing: '3px',
    margin: '10px 0'
  },
  darkenLayer: {
    backgroundColor: 'rgba(0, 30, 60, 0.6)', 
    height: '100%',
    width: '100%',
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center',
  },
  loginCard: { 
    backgroundColor: 'rgba(255, 255, 255, 0.98)', 
    padding: '40px 35px', 
    borderRadius: '24px', 
    width: '400px', 
    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
    boxSizing: 'border-box',
    border: '1px solid rgba(255,255,255,0.3)',
    position: 'relative'
  },
  facilitatorTag: {
    fontSize: '8px',
    backgroundColor: '#006699',
    color: 'white',
    padding: '3px 10px',
    borderRadius: '20px',
    fontWeight: 'bold',
    letterSpacing: '1px'
  },
  iconCircle: {
    width: '70px',
    height: '70px',
    backgroundColor: '#eef6f9',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '0 auto'
  },
  label: {
    display: 'block',
    fontSize: '9px',
    fontWeight: '800',
    color: '#006699',
    marginBottom: '6px',
    marginLeft: '2px',
    letterSpacing: '0.5px'
  },
  input: { 
    width: '100%', 
    padding: '14px', 
    paddingRight: '45px',
    border: '2px solid #eef6f9', 
    borderRadius: '12px', 
    fontSize: '16px',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'all 0.3s',
    backgroundColor: '#f8fbff',
    color: '#333'
  },
  eyeBtn: {
    position: 'absolute',
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '5px'
  },
  submitBtn: { 
    width: '100%', 
    padding: '16px', 
    backgroundColor: '#006699', 
    color: 'white', 
    border: 'none', 
    borderRadius: '12px', 
    fontWeight: 'bold', 
    fontSize: '14px',
    cursor: 'pointer',
    boxShadow: '0 10px 15px -3px rgba(0,102,153,0.3)',
    transition: 'transform 0.2s',
    WebkitAppearance: 'none'
  }
};

export default Login;