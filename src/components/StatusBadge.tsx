import { Badge } from './ui/badge';

type EmployeeStatus = 'Active' | 'Inactive' | 'Probation' | 'Resigned' | 'Terminated' | 'OnLeave';

const statusVariantMap: Record<EmployeeStatus, 'active' | 'inactive' | 'probation' | 'danger'> = {
  Active: 'active',
  Inactive: 'inactive',
  Probation: 'probation',
  Resigned: 'danger',
  Terminated: 'danger',
  OnLeave: 'inactive',
};

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const variant = statusVariantMap[status as EmployeeStatus] ?? 'default';
  return <Badge variant={variant} className={className}>{status}</Badge>;
}
