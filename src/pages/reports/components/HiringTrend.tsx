import { useGetHiringTrend } from '../../../hooks/useQuery/useGetHiringTrend';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function HiringTrend() {
  const { data: trendData, isLoading, isError } = useGetHiringTrend();

  return (
    <section className="space-y-4">
      <h2 className="text-sm font-extrabold text-neutral-900 uppercase tracking-wider">Hiring Reports</h2>
      <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm">
        <h3 className="font-bold text-sm text-neutral-900 mb-6">Employee Growth Over Time</h3>
        {isLoading ? (
          <div className="h-48 bg-neutral-50 rounded-xl animate-pulse" />
        ) : isError ? (
          <div className="h-48 flex items-center justify-center text-red-500 text-xs">Failed to load chart data.</div>
        ) : !trendData || trendData.length === 0 ? (
          <div className="h-48 flex items-center justify-center text-neutral-400 text-xs">No data available.</div>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={trendData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="employees" stroke="#84a05a" strokeWidth={2} dot={{ r: 4, fill: '#ccd5ae', stroke: '#84a05a' }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </section>
  );
}
