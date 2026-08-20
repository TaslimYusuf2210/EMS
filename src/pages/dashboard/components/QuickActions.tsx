import { Link } from 'react-router-dom';

export function QuickActions() {
  const actions = [
    { label: 'Add Employee', href: '/dashboard/employees', icon: '👤', desc: 'Register a new staff member' },
    { label: 'Add Department', href: '/dashboard/departments', icon: '🏢', desc: 'Create a new division' },
    { label: 'View Reports', href: '/dashboard/reports', icon: '📊', desc: 'See workforce analytics' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
      {actions.map((action) => (
        <Link
          key={action.label}
          to={action.href}
          className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-sm hover:border-[#ccd5ae] hover:bg-[#faedcd]/20 transition-all group cursor-pointer"
        >
          <span className="text-xl">{action.icon}</span>
          <h4 className="font-bold text-sm text-neutral-900 mt-2 group-hover:text-neutral-950">{action.label}</h4>
          <p className="text-[11px] text-neutral-500 mt-1">{action.desc}</p>
        </Link>
      ))}
    </div>
  );
}
