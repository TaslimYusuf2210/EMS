import type { RecentActivity } from '../../../types/dashboard/dashboard';

interface TimelineProps {
  activities?: RecentActivity[];
}

const typeIcons: Record<RecentActivity['type'], string> = {
  note: '📝',
  document: '📄',
  department: '🏢',
  employee: '👤',
  education: '🎓',
  salary: '💰',
};

export function RecentActivityTimeline({ activities }: TimelineProps) {
  const items = activities ?? [];

  return (
    <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm">
      <h3 className="font-bold text-sm text-neutral-900 mb-4">Recent Activity</h3>
      {items.length === 0 ? (
        <div className="text-center text-neutral-400 text-xs py-6">No recent activity.</div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex gap-3">
              <span className="text-sm shrink-0 mt-0.5">{typeIcons[item.type]}</span>
              <div className="min-w-0">
                <p className="text-xs text-neutral-800 leading-relaxed">{item.action}</p>
                <span className="text-[10px] text-neutral-400 font-bold">{item.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
