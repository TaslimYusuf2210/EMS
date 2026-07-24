import type { Employee } from '../../../types/dashboard/employee';
import type { Department } from '../../../types/dashboard/department';
import { useGetEmployeeCount } from '../../../hooks/useQuery/useGetEmployeeCount';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface ReportCardProps {
  label: string;
  value: string | number;
}

export function ReportCard({ label, value }: ReportCardProps) {
  return (
    <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-sm">
      <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">{label}</span>
      <p className="text-3xl font-black text-neutral-950 mt-2">{value}</p>
    </div>
  );
}

interface EmployeeMetricsProps {
  employees: Employee[];
  departments: Department[];
}

export function EmployeeMetrics({ employees, departments }: EmployeeMetricsProps) {
  const { data: employeeCountData, isLoading: isEmployeeCountLoading, isError: isEmployeeCountError } = useGetEmployeeCount();
  const total = employees.length;
  const active = employees.filter((e) => e.status === 'Active').length;
  const inactive = employees.filter(
    (e) => e.status === 'Inactive' || e.status === 'Resigned' || e.status === 'Terminated'
  ).length;

  return (
    <section className="space-y-4">
      <h2 className="text-sm font-extrabold text-neutral-900 uppercase tracking-wider">Employee Reports</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <ReportCard label="Total Employees" value={total} />
        <ReportCard label="Active" value={active} />
        <ReportCard label="Inactive / Departed" value={inactive} />
        <ReportCard label="Departments" value={departments.length} />
      </div>
      <DepartmentBreakdown data={employeeCountData} isLoading={isEmployeeCountLoading} isError={isEmployeeCountError} />
    </section>
  );
}

interface DepartmentBreakdownProps {
  data: ReturnType<typeof useGetEmployeeCount>['data'];
  isLoading: boolean;
  isError: boolean;
}

function DepartmentBreakdown({ data, isLoading, isError }: DepartmentBreakdownProps) {
  const byDepartment = data?.departments ?? [];

  return (
    <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm">
      <h3 className="font-bold text-sm text-neutral-900 mb-6">Employees Per Department</h3>
      {isLoading ? (
        <div className="h-40 bg-neutral-50 rounded-xl animate-pulse" />
      ) : isError ? (
        <div className="h-40 flex items-center justify-center text-red-500 text-xs">Failed to load chart data.</div>
      ) : byDepartment.length === 0 ? (
        <div className="h-40 flex items-center justify-center text-neutral-400 text-xs">No data available.</div>
      ) : (
        <ResponsiveContainer width="100%" height={Math.max(byDepartment.length * 50, 200)}>
          <BarChart layout="vertical" data={byDepartment} margin={{ left: 10, right: 20 }}>
            <XAxis type="number" tick={{ fontSize: 10 }} />
            <YAxis type="category" dataKey="department" width={120} tick={{ fontSize: 10 }} />
            <Tooltip formatter={(value: any) => value} />
            <Bar dataKey="employeeCount" fill="#ccd5ae" radius={[0, 4, 4, 0]} minPointSize={2} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
