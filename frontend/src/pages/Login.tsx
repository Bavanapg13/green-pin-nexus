import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Shield, Eye, EyeOff, Lock, AlertOctagon, HelpCircle, Check, X } from 'lucide-react';
import { api } from '../services/api';

export default function Login() {
  const [emailOrId, setEmailOrId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Password Policy State
  const [pwRequirements, setPwRequirements] = useState({
    length: false,
    upper: false,
    lower: false,
    number: false,
    special: false,
  });

  // Calculate redirect path
  const from = (location.state as any)?.from?.pathname || '/overview';

  useEffect(() => {
    // If already authenticated, redirect
    const session = localStorage.getItem('gpn_session');
    if (session) {
      navigate(from, { replace: true });
    }
  }, [navigate, from]);

  useEffect(() => {
    // Check password policy requirements
    setPwRequirements({
      length: password.length >= 8,
      upper: /[A-Z]/.test(password),
      lower: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    });
  }, [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrId.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await api.login(emailOrId.trim(), password.trim());
      setSuccess(true);
      
      // Store session
      const sessionData = {
        isAuthenticated: true,
        supervisor: res.supervisor,
        lastActivity: Date.now()
      };
      localStorage.setItem('gpn_session', JSON.stringify(sessionData));

      // Visual delay for the "AUTHENTICATION VERIFIED" transition
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please verify your login details.');
    } finally {
      setLoading(false);
    }
  };

  const handleUseDemo = () => {
    setEmailOrId('supervisor@greenpinnexus.local');
    setPassword('Demo@2026');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-darker text-slate-100 flex flex-col justify-between font-[Inter]">
      {/* Top Header - Mobile Branding */}
      <div className="md:hidden p-4 bg-panel/40 border-b border-slate-800 flex items-center gap-2">
        <Shield size={20} className="text-primary" />
        <span className="font-bold tracking-wider text-sm">GREEN PIN NEXUS</span>
      </div>

      {/* Main Container */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto p-4 md:p-8 items-center justify-center gap-8">
        
        {/* Left Side: Brand & Visual Flow (Desktop only) */}
        <div className="hidden md:flex flex-1 flex-col justify-center space-y-6 max-w-lg pr-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center text-primary shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              <Shield size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-wider font-mono text-slate-100">GREEN PIN NEXUS</h1>
              <p className="text-xs text-primary font-mono tracking-widest uppercase">Privileged Access Intelligence</p>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-slate-300 text-lg leading-relaxed">
              "Detect the chain, not just the event."
            </p>
            <p className="text-slate-400 text-sm leading-relaxed">
              Monitor privileged actions. Understand suspicious chains. Respond with confidence.
            </p>
          </div>

          {/* Mini Flow Diagram */}
          <div className="bg-panel/40 border border-slate-800 rounded-xl p-5 space-y-3 shadow-inner">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">Workflow Sequence</div>
            <div className="flex flex-col space-y-2">
              <div className="flex items-center gap-3">
                <span className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] font-mono text-slate-400">1</span>
                <span className="text-xs text-slate-300 font-medium">Bank Officer Privileged Action</span>
              </div>
              <div className="w-0.5 h-3 bg-slate-800 ml-2.5"></div>
              <div className="flex items-center gap-3">
                <span className="w-5 h-5 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-[10px] font-mono text-amber-400">2</span>
                <span className="text-xs text-slate-300 font-medium">Green Pin Nexus Chain Detection</span>
              </div>
              <div className="w-0.5 h-3 bg-slate-800 ml-2.5"></div>
              <div className="flex items-center gap-3">
                <span className="w-5 h-5 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-[10px] font-mono text-primary">3</span>
                <span className="text-xs text-slate-200 font-bold">Supervisor Investigation & Response</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Security Portal Login Form */}
        <div className="w-full max-w-md bg-panel border border-slate-800 rounded-2xl p-6 md:p-8 shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
          <div className="mb-6">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-100 mb-1">SECURITY SUPERVISOR PORTAL</h2>
            <p className="text-xs text-slate-400">
              Securely access privileged activity monitoring and risk intelligence.
            </p>
          </div>

          {/* Form Alert States */}
          {error && (
            <div className="mb-5 bg-danger/10 border border-danger/30 text-danger rounded-lg p-3 text-xs flex gap-2.5 items-start">
              <AlertOctagon size={16} className="shrink-0 mt-0.5" />
              <div>
                <span className="font-bold uppercase block mb-0.5">Authentication Failed</span>
                {error.includes('Too many') ? error : "Invalid supervisor credentials. Please verify your login details."}
              </div>
            </div>
          )}

          {success && (
            <div className="mb-5 bg-primary/10 border border-primary/30 text-primary rounded-lg p-3 text-xs flex gap-2.5 items-center justify-center font-bold">
              <Shield size={16} className="animate-pulse" />
              AUTHENTICATION VERIFIED. Redirecting...
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username/ID Field */}
            <div>
              <label htmlFor="emailOrId" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Supervisor ID / Official Email
              </label>
              <input
                id="emailOrId"
                type="text"
                required
                className="w-full bg-darker border border-slate-700/80 rounded-lg px-3.5 py-2.5 focus:outline-none focus:border-primary text-slate-200 text-sm font-mono placeholder-slate-600 transition-colors"
                placeholder="supervisor@greenpinnexus.local"
                value={emailOrId}
                onChange={(e) => setEmailOrId(e.target.value)}
                disabled={loading || success}
              />
            </div>

            {/* Password Field */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label htmlFor="password" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-xs text-slate-400 hover:text-slate-200 focus:outline-none flex items-center gap-1"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={13} /> : <Eye size={13} />}
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="w-full bg-darker border border-slate-700/80 rounded-lg pl-3.5 pr-10 py-2.5 focus:outline-none focus:border-primary text-slate-200 text-sm placeholder-slate-600 transition-colors font-mono"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading || success}
                />
                <Lock size={15} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              </div>
            </div>

            {/* Password policy requirements checklist */}
            <div className="p-3 bg-darker/60 rounded-lg border border-slate-800/80 text-[10px] space-y-1.5">
              <span className="font-semibold text-slate-400 uppercase tracking-wider block mb-1">Password Requirements</span>
              
              <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-slate-400">
                <div className="flex items-center gap-1.5">
                  {pwRequirements.length ? (
                    <Check size={11} className="text-primary font-bold" />
                  ) : (
                    <X size={11} className="text-slate-600" />
                  )}
                  <span className={pwRequirements.length ? 'text-slate-300' : ''}>At least 8 chars</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {pwRequirements.upper ? (
                    <Check size={11} className="text-primary font-bold" />
                  ) : (
                    <X size={11} className="text-slate-600" />
                  )}
                  <span className={pwRequirements.upper ? 'text-slate-300' : ''}>Uppercase letter</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {pwRequirements.lower ? (
                    <Check size={11} className="text-primary font-bold" />
                  ) : (
                    <X size={11} className="text-slate-600" />
                  )}
                  <span className={pwRequirements.lower ? 'text-slate-300' : ''}>Lowercase letter</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {pwRequirements.number ? (
                    <Check size={11} className="text-primary font-bold" />
                  ) : (
                    <X size={11} className="text-slate-600" />
                  )}
                  <span className={pwRequirements.number ? 'text-slate-300' : ''}>One number</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {pwRequirements.special ? (
                    <Check size={11} className="text-primary font-bold" />
                  ) : (
                    <X size={11} className="text-slate-600" />
                  )}
                  <span className={pwRequirements.special ? 'text-slate-300' : ''}>Special character</span>
                </div>
              </div>
            </div>

            {/* Secure Sign In Button */}
            <button
              type="submit"
              disabled={loading || success}
              className="w-full bg-primary hover:bg-primaryDark text-darker font-bold py-2.5 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary text-xs uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-darker border-t-transparent rounded-full animate-spin"></div>
                  Authenticating...
                </>
              ) : (
                <>
                  <Lock size={14} />
                  Sign In Securely
                </>
              )}
            </button>
          </form>

          {/* Demo Access Area */}
          <div className="mt-6 pt-5 border-t border-slate-800/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Demo Access</span>
              <span className="text-[10px] text-amber-500 font-mono">Prototype Mode</span>
            </div>
            <button
              type="button"
              onClick={handleUseDemo}
              className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-700/80 border border-slate-700 rounded-lg text-xs font-bold text-slate-200 transition-colors flex items-center justify-center gap-1.5"
            >
              <HelpCircle size={14} />
              Use Supervisor Demo
            </button>
          </div>
        </div>
      </div>

      {/* Footer / Security Notice */}
      <div className="w-full p-4 md:p-6 bg-panel/30 border-t border-slate-800 text-center space-y-2.5">
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold tracking-wider text-slate-400">
          <span>🔒 AUTHORIZED SECURITY PERSONNEL ONLY</span>
          <span className="text-slate-600">|</span>
          <span className="text-primary font-mono bg-primary/5 px-2 py-0.5 rounded border border-primary/10">SIMULATION ENVIRONMENT</span>
        </div>
        <p className="max-w-2xl mx-auto text-[10px] md:text-xs text-slate-500 leading-relaxed">
          <strong>SECURITY NOTICE:</strong> GREEN PIN NEXUS is a controlled simulation environment.
          No real bank accounts, customer data, employee credentials, or financial transactions are connected to this prototype.
        </p>
      </div>
    </div>
  );
}
