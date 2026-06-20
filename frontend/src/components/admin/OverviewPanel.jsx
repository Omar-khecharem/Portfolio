import { useEffect, useState } from 'react';
import { profileApi, projectsApi } from '../../services/api';
import api from '../../services/api';

export default function OverviewPanel() {
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [certs, setCerts] = useState([]);

  useEffect(() => {
    Promise.all([
      profileApi.get().catch(() => null),
      projectsApi.list().catch(() => []),
      api.get('/certifications').then(r => r.data).catch(() => []),
    ]).then(([p, pr, c]) => { setProfile(p); setProjects(pr); setCerts(c); });
  }, []);

  const cards = [
    { label: 'Projects', value: projects.length, color: 'bg-[#0a0a23]' },
    { label: 'Certifications', value: certs.length, color: 'bg-[#e94560]' },
    { label: 'Skills', value: profile?.skills?.length || 0, color: 'bg-[#1a1a3e]' },
    { label: 'Services', value: profile?.services?.length || 0, color: 'bg-[#6b7280]' },
  ];

  return (
    <div>
      <h1 className="text-lg font-bold text-[#0a0a23] mb-5">Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {cards.map((c) => (
          <div key={c.label} className="bg-white rounded-xl border border-[#e5e3df] p-5">
            <p className="text-xs text-[#6b7280] font-medium mb-2">{c.label}</p>
            <p className="text-2xl font-bold text-[#0a0a23]">{c.value}</p>
          </div>
        ))}
      </div>

      <h2 className="text-sm font-semibold text-[#0a0a23] mb-3">Quick Actions</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Edit Profile', tab: 'profile' },
          { label: 'Add Project', tab: 'projects' },
          { label: 'Add Certification', tab: 'certs' },
          { label: 'Customize Theme', tab: 'theme' },
        ].map((a) => (
          <a key={a.label} href={`/admin/dashboard?tab=${a.tab}`}
            onClick={(e) => { e.preventDefault(); window.dispatchEvent(new CustomEvent('admin:nav', { detail: a.tab })); }}
            className="block text-center py-3 px-4 bg-white border border-[#e5e3df] rounded-xl text-sm font-medium text-[#0a0a23] hover:border-[#0a0a23]/30 transition-all"
          >{a.label}</a>
        ))}
      </div>
    </div>
  );
}
