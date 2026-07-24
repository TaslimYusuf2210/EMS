import type { DepartmentOverview } from '../../../types/dashboard/dashboard';

interface DepartmentCardsProps {
  departments: DepartmentOverview[];
}

export function DepartmentCards({ departments }: DepartmentCardsProps) {
  return (
    <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm">
      <h3 className="font-bold text-sm text-neutral-900 mb-4">Department Overview</h3>
      {departments.length === 0 ? (
        <div className="text-center text-neutral-400 text-xs py-4">No departments yet.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {departments.map((dep) => {
            const count = dep.employeeCount;
            return (
              <div
                key={dep.id}
                className="border border-neutral-200 rounded-xl p-4 hover:border-[#ccd5ae] transition-colors"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-neutral-900 truncate">{dep.name}</span>
                  <span className="text-[10px] font-bold text-neutral-400 uppercase">{dep.abbreviation}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-lg font-black text-neutral-950">{count}</span>
                  <span className="text-[10px] text-neutral-400">employee{count !== 1 ? 's' : ''}</span>
                </div>
                <p className="text-[10px] text-neutral-500 mt-1.5 truncate">
                  {dep.head && dep.head !== 'Not assigned' ? `Head: ${dep.head}` : 'No head assigned'}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
