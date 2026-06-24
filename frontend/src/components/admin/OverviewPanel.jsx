import { useEffect, useState } from 'react';
import { profileApi, projectsApi, certificationsApi } from '../../services/api';
import api from '../../services/api';

const ADM_ACTIONS = [
  { label: 'Edit Profile', tab: 'profile', desc: 'Personal info, social links, CV' },
  { label: 'Add Project', tab: 'projects', desc: 'New portfolio project' },
  { label: 'Messages', tab: 'messages', desc: 'Inbox & contact requests' },
  { label: 'Newsletter', tab: 'newsletter', desc: 'Subscriber list' },
  { label: 'Skills', tab: 'skills', desc: 'Tech stack & categories' },
  { label: 'Certifications', tab: 'certs', desc: 'Manage certs' },
  { label: 'Analytics', tab: 'analytics', desc: 'Visitors & charts' },
  { label: 'Background', tab: 'background', desc: 'Experience & education' },
  { label: 'Categories', tab: 'categories', desc: 'Project categories' },
  { label: 'Chatbot', tab: 'chatbot', desc: 'AI assistant config' },
  { label: 'Ambiance', tab: 'ambiance', desc: 'Visual effects' },
  { label: 'Customize Theme', tab: 'theme', desc: 'Colors & layout' },
];

function StatCard({ label, value, accent }) {
  return (
    <div className="bg-white rounded-xl border border-[#e5e3df] p-5 flex items-center justify-between">
      <div>
        <p className="text-xs text-[#6b7280] font-medium mb-1">{label}</p>
        <p className={`text-2xl font-bold ${accent ? 'text-[#e94560]' : 'text-[#0a0a23]'}`}>{value ?? '—'}</p>
      </div>
    </div>
  );
}

function ActionCard({ label, desc, tab }) {
  return (
    <a
      href={`/admin/dashboard?tab=${tab}`}
      onClick={(e) => { e.preventDefault(); window.dispatchEvent(new CustomEvent('admin:nav', { detail: tab })); }}
      className="block p-4 bg-white border border-[#e5e3df] rounded-xl hover:border-[#0a0a23]/20 transition-all hover:shadow-sm"
    >
      <p className="text-sm font-semibold text-[#0a0a23]">{label}</p>
      <p className="text-xs text-[#6b7280] mt-0.5">{desc}</p>
    </a>
  );
}

export default function OverviewPanel() {
  const [data, setData] = useState(null);

  useEffect(() => {
    Promise.all([
      profileApi.get().catch(() => null),
      projectsApi.list().catch(() => []),
      certificationsApi.list().catch(() => []),
      api.get('/messages').then(r => r.data).catch(() => []),
      api.get('/newsletter').then(r => r.data).catch(() => []),
      api.get('/visitor/stats').then(r => r.data).catch(() => null),
    ]).then(([p, pr, c, msgs, nl, stats]) => {
      setData({ profile: p, projects: pr, certs: c, messages: msgs, newsletter: nl, stats });
    });
  }, []);

  const profile = data?.profile;
  const projects = data?.projects || [];
  const certs = data?.certs || [];
  const messages = data?.messages || [];
  const newsletter = data?.newsletter || [];
  const stats = data?.stats;

  const unread = messages.filter(m => !m.read).length;
  const recentMessages = messages.slice(0, 3);
  const recentProjects = projects.slice(0, 3);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-bold text-[#0a0a23]">Dashboard</h1>
          {profile && <p className="text-xs text-[#6b7280] mt-0.5">Welcome back, {profile.name}</p>}
        </div>
        <span className="text-[10px] text-[#6b7280] bg-[#fafaf8] px-3 py-1.5 rounded-lg border border-[#e5e3df]">
          {stats ? `${stats.todayVisits} visit${stats.todayVisits !== 1 ? 's' : ''} today` : '...'}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-8">
        <StatCard label="Projects" value={projects.length} />
        <StatCard label="Certifications" value={certs.length} />
        <StatCard label="Skills" value={profile?.skills?.length || 0} />
        <StatCard label="Services" value={profile?.services?.length || 0} />
        <StatCard label="Unread Messages" value={unread} accent />
        <StatCard label="Newsletter Subs" value={newsletter.length} />
        {stats && (
          <>
            <StatCard label="Total Visits" value={stats.totalVisits} />
            <StatCard label="Unique Visitors" value={stats.uniqueVisitors} />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <h2 className="text-sm font-semibold text-[#0a0a23] mb-3">Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {ADM_ACTIONS.map((a) => <ActionCard key={a.tab} {...a} />)}
          </div>
        </div>

        <div className="space-y-6">
          {recentMessages.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-[#0a0a23]">Recent Messages</h2>
                <button
                  onClick={() => window.dispatchEvent(new CustomEvent('admin:nav', { detail: 'messages' }))}
                  className="text-[11px] text-[#e94560] hover:underline"
                >View all</button>
              </div>
              <div className="space-y-2">
                {recentMessages.map(m => (
                  <div key={m._id} className={`bg-white border rounded-xl p-3 ${m.read ? 'border-[#e5e3df]' : 'border-[#0a0a23]/20'}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium text-[#0a0a23] truncate">{m.name}</p>
                      {!m.read && <span className="w-1.5 h-1.5 rounded-full bg-[#e94560] shrink-0" />}
                    </div>
                    <p className="text-xs text-[#6b7280] truncate">{m.subject || m.message?.slice(0, 60)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {recentProjects.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-[#0a0a23]">Latest Projects</h2>
                <button
                  onClick={() => window.dispatchEvent(new CustomEvent('admin:nav', { detail: 'projects' }))}
                  className="text-[11px] text-[#e94560] hover:underline"
                >View all</button>
              </div>
              <div className="space-y-2">
                {recentProjects.map(p => (
                  <div key={p._id} className="bg-white border border-[#e5e3df] rounded-xl p-3">
                    <p className="text-sm font-medium text-[#0a0a23] truncate">{p.title}</p>
                    <p className="text-xs text-[#6b7280]">{p.category}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
