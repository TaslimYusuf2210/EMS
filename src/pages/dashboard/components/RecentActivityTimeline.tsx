import { useState } from 'react';
import type { RecentActivity } from '../../../types/dashboard/dashboard';

interface TimelineProps {
  activities?: RecentActivity[];
}

const typeIcons: Record<RecentActivity['type'], string> = {
  note: '📝',
  document: '📄',
  department: '🏢',
  department_edit: '✏️',
  employee: '👤',
  employee_delete: '🗑️',
  education: '🎓',
  salary: '💰',
};

const INITIAL_COUNT = 6;

export function RecentActivityTimeline({ activities }: TimelineProps) {
  const [showAll, setShowAll] = useState(false);
  const items = activities ?? [];
  const visibleItems = showAll ? items : items.slice(0, INITIAL_COUNT);
  const hasMore = items.length > INITIAL_COUNT;

  return (
    <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm">
      <h3 className="font-bold text-sm text-neutral-900 mb-4">Recent Activity</h3>
      {items.length === 0 ? (
        <div className="text-center text-neutral-400 text-xs py-6">No recent activity.</div>
      ) : (
        <>
          <div className={`space-y-4 ${showAll ? 'max-h-80 overflow-y-auto pr-2' : ''}`}>
            {visibleItems.map((item) => (
              <div key={item.id} className="flex gap-3">
                <span className="text-sm shrink-0 mt-0.5">{typeIcons[item.type]}</span>
                <div className="min-w-0">
                  <p className="text-xs text-neutral-800 leading-relaxed">{item.action}</p>
                  <span className="text-[10px] text-neutral-400 font-bold">{item.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
          {hasMore && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="mt-4 w-full text-center text-[11px] font-bold text-neutral-500 hover:text-neutral-800 transition-colors cursor-pointer"
            >
              {showAll ? 'Show less' : `View all ${items.length} activities`}
            </button>
          )}
        </>
      )}
    </div>
  );
}
