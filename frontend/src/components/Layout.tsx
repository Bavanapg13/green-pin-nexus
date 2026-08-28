import { Outlet, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import Sidebar from './Sidebar';
import SimulationBanner from './SimulationBanner';
import { Shield, ShieldAlert, LogOut, Info, Clock, CheckCircle2, ChevronDown } from 'lucide-react';
import { api } from '../services/api';

export default function Layout() {
  const navigate = useNavigate();
  const [supervisor, setSupervisor] = useState<any>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [showExpiredModal, setShowExpiredModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Inactivity Config (15 mins = 900,000ms; warning at 14 mins = 840,000ms)
  const TIMEOUT_MS = 15 * 60 * 1000;
  const WARNING_MS = 14 * 60 * 1000;

  useEffect(() => {
    // Parse supervisor session on load
    const sessionStr = localStorage.getItem('gpn_session');
    if (sessionStr) {
      try {
        const session = JSON.parse(sessionStr);
        setSupervisor(session.supervisor);
      } catch (e) {
        console.error(e);
      }
    }

    // Close dropdown on click outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update activity timestamp in local storage
  const updateActivity = () => {
    const sessionStr = localStorage.getItem('gpn_session');
    if (sessionStr) {
      try {
        const session = JSON.parse(sessionStr);
        // Only update if not already expired/warning state
        const elapsed = Date.now() - session.lastActivity;
        if (elapsed < WARNING_MS && !showExpiredModal) {
          session.lastActivity = Date.now();
          localStorage.setItem('gpn_session', JSON.stringify(session));
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  useEffect(() => {
    // Listen for activity events
    const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'click'];
    events.forEach(e => window.addEventListener(e, updateActivity));
    return () => events.forEach(e => window.removeEventListener(e, updateActivity));
  }, [showWarningModal, showExpiredModal]);

  // Timer checking loop
  useEffect(() => {
    const timer = setInterval(() => {
      const sessionStr = localStorage.getItem('gpn_session');
      if (!sessionStr) return;

      try {
        const session = JSON.parse(sessionStr);
        const elapsed = Date.now() - session.lastActivity;

        if (elapsed >= TIMEOUT_MS) {
          // Expired
          if (!showExpiredModal) {
            clearInterval(timer);
            handleSessionExpired();
          }
        } else if (elapsed >= WARNING_MS) {
          // Warning zone (last 60s)
          setShowWarningModal(true);
          const remainingSecs = Math.ceil((TIMEOUT_MS - elapsed) / 1000);
          setTimeLeft(remainingSecs > 0 ? remainingSecs : 0);
        } else {
          // Standard active zone
          setShowWarningModal(false);
        }
      } catch (e) {
        console.error(e);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [showExpiredModal]);

  const handleSessionExpired = async () => {
    setShowWarningModal(false);
    setShowExpiredModal(true);
    
    // Call expire API
    if (supervisor?.id) {
      try {
        await api.sessionExpire(supervisor.id);
      } catch (e) {
        console.error(e);
      }
    }
    
    localStorage.removeItem('gpn_session');
  };

  const handleContinueSession = () => {
    const sessionStr = localStorage.getItem('gpn_session');
    if (sessionStr) {
      try {
        const session = JSON.parse(sessionStr);
        session.lastActivity = Date.now();
        localStorage.setItem('gpn_session', JSON.stringify(session));
        setShowWarningModal(false);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleLogout = async () => {
    const supId = supervisor?.id || 'SUP-001';
    try {
      await api.logout(supId);
    } catch (e) {
      console.error(e);
    }
    localStorage.removeItem('gpn_session');
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-darker text-slate-200 overflow-hidden font-[Inter]">
      <Sidebar />
      <div className="flex-1 flex flex-col relative overflow-hidden">
        
        {/* Top Header Navigation */}
        <header className="h-16 border-b border-slate-800 bg-panel px-6 flex items-center justify-between z-10">
          <div>
            <span className="text-[10px] text-primary font-mono tracking-widest uppercase bg-primary/5 px-2.5 py-1 rounded border border-primary/20 flex items-center gap-1.5 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
              SECURE SESSION
            </span>
          </div>

          <div className="flex items-center gap-6">
            <span className="hidden md:inline text-xs text-slate-400 font-mono">
              ENV: <span className="text-slate-200 font-bold">SIMULATION</span>
            </span>

            {/* Profile Dropdown */}
            {supervisor && (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2.5 hover:bg-slate-800/80 px-3 py-1.5 rounded-lg border border-transparent hover:border-slate-700 transition-all text-left"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary text-xs font-bold font-mono">
                    AR
                  </div>
                  <div className="hidden sm:block">
                    <div className="text-xs font-bold text-slate-100 leading-tight">{supervisor.name}</div>
                    <div className="text-[10px] text-slate-400 leading-tight">{supervisor.role}</div>
                  </div>
                  <ChevronDown size={14} className="text-slate-400" />
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-56 rounded-lg bg-panel border border-slate-800 shadow-[0_10px_25px_rgba(0,0,0,0.5)] p-1.5 text-xs text-slate-300 font-medium">
                    <div className="px-3 py-2 border-b border-slate-800 text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                      Supervisor ID: {supervisor.id}
                    </div>
                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        setShowSecurityModal(true);
                      }}
                      className="w-full text-left px-3 py-2 rounded hover:bg-slate-800 flex items-center gap-2"
                    >
                      <Info size={14} className="text-primary" />
                      Session Security
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 rounded hover:bg-slate-800 text-danger flex items-center gap-2 border-t border-slate-800/50 mt-1"
                    >
                      <LogOut size={14} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto p-6 pb-20">
          <Outlet />
        </main>
        <SimulationBanner />
      </div>

      {/* SESSION SECURITY MODAL */}
      {showSecurityModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-sm bg-panel border border-slate-800 rounded-xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Shield className="text-primary" size={20} />
              <h3 className="font-bold text-sm text-slate-100 uppercase tracking-wider">Session Security Status</h3>
            </div>
            
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-850">
                <span className="text-slate-400">User:</span>
                <span className="text-slate-100 font-semibold">{supervisor?.name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-850">
                <span className="text-slate-400">Role:</span>
                <span className="text-slate-100">{supervisor?.role}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-850">
                <span className="text-slate-400">Supervisor ID:</span>
                <span className="text-slate-100 font-mono">{supervisor?.id}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-850">
                <span className="text-slate-400">Authentication:</span>
                <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                  <CheckCircle2 size={13} /> Verified
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-850">
                <span className="text-slate-400">Environment:</span>
                <span className="text-slate-300 font-mono text-[10px]">Simulation</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-850">
                <span className="text-slate-400">Session status:</span>
                <span className="text-primary font-bold">Active</span>
              </div>
            </div>

            <button
              onClick={() => setShowSecurityModal(false)}
              className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 py-2 rounded text-xs font-bold transition-all border border-slate-700"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* SESSION EXPIRING (14 MINS) WARNING MODAL */}
      {showWarningModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-sm bg-panel border border-red-500/30 rounded-xl p-6 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400 animate-pulse">
              <Clock size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100">SESSION EXPIRING</h3>
              <p className="text-xs text-slate-400 mt-1">
                Your secure supervisor session will expire soon due to inactivity.
              </p>
            </div>
            <div className="text-2xl font-mono font-bold text-amber-400">
              {timeLeft}s
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleLogout}
                className="flex-1 bg-slate-900 hover:bg-slate-850 border border-slate-750 text-slate-400 py-2.5 rounded-lg text-xs font-bold transition-colors"
              >
                Log Out
              </button>
              <button
                onClick={handleContinueSession}
                className="flex-1 bg-primary hover:bg-primaryDark text-darker py-2.5 rounded-lg text-xs font-bold transition-colors"
              >
                Continue Session
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SESSION EXPIRED MODAL */}
      {showExpiredModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-lg flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-sm bg-panel border border-red-500/50 rounded-xl p-6 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto text-red-400">
              <ShieldAlert size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-150 uppercase tracking-wide">SECURE SESSION EXPIRED</h3>
              <p className="text-xs text-slate-400 mt-1">
                Please authenticate again to continue monitoring.
              </p>
            </div>
            <button
              onClick={() => {
                setShowExpiredModal(false);
                navigate('/login');
              }}
              className="w-full bg-primary hover:bg-primaryDark text-darker py-2.5 rounded-lg text-xs font-bold transition-colors uppercase tracking-wider"
            >
              Return to Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
