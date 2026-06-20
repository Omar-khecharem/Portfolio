import { useEffect, useState } from 'react';
import api from '../../services/api';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';

export default function AnalyticsPanel() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/visitor/stats').then(r => { setStats(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-sm text-[#6b7280] py-10 text-center">Loading analytics...</div>;
  if (!stats) return <div className="text-sm text-[#6b7280] py-10 text-center">No data yet.</div>;

  const PIE_COLORS = ['#0a0a23', '#e94560', '#1a1a3e', '#6b7280', '#d8d6d0'];

  const browserSummary = (stats.browsers || []).slice(0, 6).map(b => {
    const name = b._id.includes('Chrome') ? 'Chrome' : b._id.includes('Firefox') ? 'Firefox' : b._id.includes('Safari') && !b._id.includes('Chrome') ? 'Safari' : b._id.includes('Edge') ? 'Edge' : b._id.includes('Opera') ? 'Opera' : 'Other';
    return { name, count: b.count };
  });

  const hourly = Array.from({ length: 24 }, (_, i) => {
    const found = stats.hourlyData?.find(h => h._id === i);
    return { hour: `${i}h`, visits: found?.visits || 0 };
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-lg font-bold text-[#0a0a23]">Analytics</h1>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: 'Total Visits', value: stats.totalVisits.toLocaleString() },
          { label: 'Unique Visitors', value: stats.uniqueVisitors.toLocaleString() },
          { label: 'Today', value: stats.todayVisits.toLocaleString() },
        ].map(c => (
          <div key={c.label} className="bg-white rounded-xl border border-[#e5e3df] p-5">
            <p className="text-xs text-[#6b7280] font-medium mb-1">{c.label}</p>
            <p className="text-2xl font-bold text-[#0a0a23]">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-[#e5e3df] p-5">
          <h3 className="text-sm font-semibold text-[#0a0a23] mb-4">Daily Visits (Last 60 days)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={stats.dailyVisits || []}>
              <Line type="monotone" dataKey="visits" stroke="#0a0a23" strokeWidth={2} dot={false} />
              <XAxis dataKey="_id" tick={{ fontSize: 10, fill: '#6b7280' }} interval="preserveStartEnd" />
              <YAxis tick={{ fontSize: 10, fill: '#6b7280' }} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e3df' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-[#e5e3df] p-5">
          <h3 className="text-sm font-semibold text-[#0a0a23] mb-4">Visits by Hour</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={hourly}>
              <Bar dataKey="visits" fill="#0a0a23" radius={[3, 3, 0, 0]} />
              <XAxis dataKey="hour" tick={{ fontSize: 9, fill: '#6b7280' }} interval={3} />
              <YAxis tick={{ fontSize: 10, fill: '#6b7280' }} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e3df' }} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-[#e5e3df] p-5">
          <h3 className="text-sm font-semibold text-[#0a0a23] mb-4">Top Pages</h3>
          <div className="space-y-2">
            {(stats.pageViews || []).slice(0, 10).map(p => (
              <div key={p._id} className="flex items-center justify-between text-sm">
                <span className="text-[#0a0a23] truncate">{p._id === '/' ? 'Home' : p._id}</span>
                <span className="font-medium text-[#6b7280]">{p.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#e5e3df] p-5">
          <h3 className="text-sm font-semibold text-[#0a0a23] mb-4">Browsers</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={browserSummary} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={70} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {browserSummary.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e3df' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#e5e3df] p-5">
        <h3 className="text-sm font-semibold text-[#0a0a23] mb-4">Recent Visitors</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#e5e3df]">
                <th className="text-left p-2 font-medium text-[#6b7280] text-xs">Page</th>
                <th className="text-left p-2 font-medium text-[#6b7280] text-xs hidden sm:table-cell">Screen</th>
                <th className="text-left p-2 font-medium text-[#6b7280] text-xs hidden md:table-cell">Referrer</th>
                <th className="text-right p-2 font-medium text-[#6b7280] text-xs">Time</th>
              </tr>
            </thead>
            <tbody>
              {(stats.recentVisitors || []).slice(0, 20).map((v, i) => (
                <tr key={i} className="border-b border-[#e5e3df] hover:bg-[#fafaf8]/50">
                  <td className="p-2 text-[#0a0a23]">{v.page === '/' ? 'Home' : v.page}</td>
                  <td className="p-2 text-[#6b7280] hidden sm:table-cell">{v.screenSize || '-'}</td>
                  <td className="p-2 text-[#6b7280] hidden md:table-cell truncate max-w-[160px]">{v.referrer || '-'}</td>
                  <td className="p-2 text-right text-[#6b7280]">{new Date(v.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
