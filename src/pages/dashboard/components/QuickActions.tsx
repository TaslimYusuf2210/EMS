import { Link } from 'react-router-dom';
import { UserPlus, Building2, BarChart3, ArrowUpRight } from 'lucide-react';

const actionCard =
  'group flex items-center gap-3 bg-white border border-neutral-200 rounded-2xl p-4 shadow-sm hover:shadow-lg hover:shadow-brand-deep/10 hover:-translate-y-0.5 hover:border-brand-light transition-all cursor-pointer';

const iconChip =
  'w-10 h-10 rounded-xl bg-gradient-to-br from-brand-light to-brand-deep text-white flex items-center justify-center shrink-0';

const actionTitle =
  'font-bold text-sm text-neutral-900 group-hover:text-brand-deep truncate';

const actionDesc = 'text-[11px] text-neutral-500 mt-0.5 truncate';

export function QuickActions() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
      <Link to="/dashboard/employees?add=1" className={actionCard}>
        <span className={iconChip}>
          <UserPlus className="w-5 h-5" />
        </span>
        <span className="min-w-0 flex-1">
          <h4 className={actionTitle}>Add Employee</h4>
          <p className={actionDesc}>Register a new staff member</p>
        </span>
        <ArrowUpRight className="w-4 h-4 text-neutral-300 group-hover:text-brand-deep shrink-0 transition-colors" />
      </Link>

      <Link to="/dashboard/departments?add=1" className={actionCard}>
        <span className={iconChip}>
          <Building2 className="w-5 h-5" />
        </span>
        <span className="min-w-0 flex-1">
          <h4 className={actionTitle}>Add Department</h4>
          <p className={actionDesc}>Create a new division</p>
        </span>
        <ArrowUpRight className="w-4 h-4 text-neutral-300 group-hover:text-brand-deep shrink-0 transition-colors" />
      </Link>

      <Link to="/dashboard/reports" className={actionCard}>
        <span className={iconChip}>
          <BarChart3 className="w-5 h-5" />
        </span>
        <span className="min-w-0 flex-1">
          <h4 className={actionTitle}>View Reports</h4>
          <p className={actionDesc}>See workforce analytics</p>
        </span>
        <ArrowUpRight className="w-4 h-4 text-neutral-300 group-hover:text-brand-deep shrink-0 transition-colors" />
      </Link>
    </div>
  );
}
