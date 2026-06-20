import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import {
  LayoutDashboard, User, FolderKanban, Award, Palette,
  BarChart3, Zap, Mail, Tags, LogOut,
} from 'lucide-react';

import OverviewPanel from '../components/admin/OverviewPanel';
import AnalyticsPanel from '../components/admin/AnalyticsPanel';
import CategoriesPanel from '../components/admin/CategoriesPanel';
import SkillsPanel from '../components/admin/SkillsPanel';
import MessagesPanel from '../components/admin/MessagesPanel';
import ProfilePanel from '../components/admin/ProfilePanel';
import ProjectsPanel from '../components/admin/ProjectsPanel';
import CertsPanel from '../components/admin/CertsPanel';
import ThemePanel from '../components/admin/ThemePanel';

const TABS = [
  { key: 'overview',  label: 'Overview',  icon: LayoutDashboard },
  { key: 'analytics', label: 'Analytics', icon: BarChart3 },
  { key: 'profile',   label: 'Profile',   icon: User },
  { key: 'messages', label: 'Messages', icon: Mail },
  { key: 'categories', label: 'Categories', icon: Tags },
  { key: 'skills',      label: 'Skills',      icon: Zap },
  { key: 'projects',  label: 'Projects',  icon: FolderKanban },
  { key: 'certs',     label: 'Certifications', icon: Award },
  { key: 'theme',     label: 'Theme',     icon: Palette },
];

export default function AdminDashboard() {
  const { user, loading: authLoading, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('overview');

  useEffect(() => {
    if (!authLoading && !user) navigate('/admin', { replace: true });
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const handler = (e) => setTab(e.detail);
    window.addEventListener('admin:nav', handler);
    return () => window.removeEventListener('admin:nav', handler);
  }, []);

  if (authLoading || !user) return null;

  return (
    <div className="min-h-screen bg-[#fafaf8] flex">
      <aside className="w-56 bg-white border-r border-[#e5e3df] hidden lg:flex flex-col flex-shrink-0">
        <div className="h-14 flex items-center px-5 border-b border-[#e5e3df]">
          <span className="text-sm font-bold text-[#0a0a23]">OMAR<span className="text-[#e94560]">.</span></span>
          <span className="ml-auto text-[10px] text-[#6b7280] font-medium uppercase tracking-wider">Admin</span>
        </div>
        <nav className="flex-1 p-3 space-y-0.5">
          {TABS.map((t) => (
            <button key={t.key}
              onClick={() => setTab(t.key)}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                tab === t.key
                  ? 'bg-[#0a0a23] text-white'
                  : 'text-[#6b7280] hover:text-[#0a0a23] hover:bg-[#fafaf8]'
              }`}
            >
              <t.icon size={16} strokeWidth={1.8} />
              {t.label}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-[#e5e3df]">
          <div className="flex items-center gap-2.5 px-3.5 py-2 mb-1">
            <div className="w-7 h-7 bg-[#0a0a23] rounded-lg flex items-center justify-center text-white text-[10px] font-bold">
              {user.email?.charAt(0).toUpperCase()}
            </div>
            <div className="text-xs truncate">
              <p className="font-medium truncate text-[#0a0a23]">{user.email}</p>
            </div>
          </div>
          <button onClick={logout}
            className="w-full flex items-center gap-2 px-3.5 py-2 text-sm text-[#6b7280] hover:text-[#e94560] rounded-lg hover:bg-[#fafaf8] transition-colors"
          >
            <LogOut size={15} /> Sign Out
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden bg-white border-b border-[#e5e3df] h-14 flex items-center justify-between px-4">
          <span className="text-sm font-bold">OMAR<span className="text-[#e94560]">.</span> Admin</span>
          <button onClick={logout} className="text-xs text-[#6b7280] hover:text-[#e94560] flex items-center gap-1">
            <LogOut size={14} /> Sign Out
          </button>
        </header>

        <div className="lg:hidden flex gap-1.5 p-3 pb-0 overflow-x-auto bg-white border-b border-[#e5e3df]">
          {TABS.map((t) => (
            <button key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                tab === t.key ? 'bg-[#0a0a23] text-white' : 'bg-[#fafaf8] text-[#6b7280]'
              }`}
            ><t.icon size={13} />{t.label}</button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <AnimatePresence mode="wait">
            <motion.div key={tab}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
            >
              {tab === 'overview' && <OverviewPanel />}
              {tab === 'analytics' && <AnalyticsPanel />}
              {tab === 'categories' && <CategoriesPanel />}
              {tab === 'skills' && <SkillsPanel />}
              {tab === 'messages' && <MessagesPanel />}
              {tab === 'profile'  && <ProfilePanel />}
              {tab === 'projects' && <ProjectsPanel />}
              {tab === 'certs'    && <CertsPanel />}
              {tab === 'theme'    && <ThemePanel />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
