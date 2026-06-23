import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { LogIn, Eye, EyeOff, ShieldCheck, ArrowLeft } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [step, setStep] = useState('login');
  const [loading, setLoading] = useState(false);
  const { login, verifyCode, cancelVerification, user, pendingVerification } = useAuth();
  const navigate = useNavigate();
  const codeRefs = useRef([]);

  useEffect(() => {
    if (user) navigate('/admin/dashboard', { replace: true });
  }, [user, navigate]);

  useEffect(() => {
    if (pendingVerification) setStep('verify');
  }, [pendingVerification]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) navigate('/admin/dashboard', { replace: true });
  };

  const handleCodeChange = (idx, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...code];
    next[idx] = val;
    setCode(next);
    if (val && idx < 5) codeRefs.current[idx + 1]?.focus();
  };

  const handleCodeKeyDown = (idx, e) => {
    if (e.key === 'Backspace' && !code[idx] && idx > 0) {
      codeRefs.current[idx - 1]?.focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const fullCode = code.join('');
    if (fullCode.length !== 6) return;
    setLoading(true);
    const result = await verifyCode(pendingVerification.email, fullCode);
    setLoading(false);
    if (result.success) navigate('/admin/dashboard', { replace: true });
  };

  const handleBack = () => {
    cancelVerification();
    setCode(['', '', '', '', '', '']);
    setStep('login');
  };

  if (step === 'verify') {
    return (
      <div className="min-h-screen bg-[#fafaf8] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-sm"
        >
          <div className="bg-white rounded-xl border border-[#e5e3df] p-8 shadow-sm">
            <div className="text-center mb-8">
              <div className="w-12 h-12 bg-[#0a0a23] rounded-xl flex items-center justify-center mx-auto mb-4">
                <ShieldCheck size={20} className="text-white" />
              </div>
              <h1 className="text-lg font-bold text-[#0a0a23]">Check Your Email</h1>
              <p className="text-sm text-[#6b7280] mt-1">
                A verification code has been sent to<br />
                <span className="font-medium text-[#0a0a23]">{pendingVerification.email}</span>
              </p>
            </div>

            <form onSubmit={handleVerify} className="space-y-6">
              <div>
                <label className="block text-xs font-medium text-[#6b7280] mb-3 text-center">
                  Enter 6-digit code
                </label>
                <div className="flex justify-center gap-2">
                  {code.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => (codeRefs.current[idx] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleCodeChange(idx, e.target.value)}
                      onKeyDown={(e) => handleCodeKeyDown(idx, e)}
                      className="w-11 h-12 text-center text-lg font-bold border border-[#e5e3df] rounded-lg bg-[#fafaf8] focus:outline-none focus:border-[#0a0a23]/30 focus:ring-1 focus:ring-[#0a0a23]/10 transition-colors"
                      autoFocus={idx === 0}
                    />
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || code.join('').length !== 6}
                className="w-full py-2.5 bg-[#0a0a23] text-white text-sm font-semibold rounded-lg hover:bg-[#e94560] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : 'Verify & Sign In'}
              </button>

              <button
                type="button"
                onClick={handleBack}
                className="w-full text-center text-xs text-[#6b7280] hover:text-[#0a0a23] transition-colors flex items-center justify-center gap-1"
              >
                <ArrowLeft size={13} /> Back to login
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafaf8] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm"
      >
        <div className="bg-white rounded-xl border border-[#e5e3df] p-8 shadow-sm">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-[#0a0a23] rounded-xl flex items-center justify-center mx-auto mb-4">
              <LogIn size={20} className="text-white" />
            </div>
            <h1 className="text-lg font-bold text-[#0a0a23]">Admin Access</h1>
            <p className="text-sm text-[#6b7280] mt-1">Sign in to manage your portfolio</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#6b7280] mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm border border-[#e5e3df] rounded-lg bg-[#fafaf8] focus:outline-none focus:border-[#0a0a23]/30 transition-colors"
                placeholder="omar.khecharem@isimg.tn"
                autoFocus
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#6b7280] mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={show ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 pr-10 text-sm border border-[#e5e3df] rounded-lg bg-[#fafaf8] focus:outline-none focus:border-[#0a0a23]/30 transition-colors"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b7280] hover:text-[#0a0a23] transition-colors"
                  tabIndex={-1}
                >
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-[#0a0a23] text-white text-sm font-semibold rounded-lg hover:bg-[#e94560] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : 'Sign In'}
            </button>
          </form>
        </div>

        <p className="text-center mt-6">
          <a href="/" className="text-xs text-[#6b7280] hover:text-[#0a0a23] transition-colors">
            &larr; Back to portfolio
          </a>
        </p>
      </motion.div>
    </div>
  );
}
