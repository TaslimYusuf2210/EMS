// import type { Department } from '../../../types/dashboard/department';
import { ReportCard } from './EmployeeMetrics';
import { useGetSalarySummary } from '../../../hooks/useQuery/useGetSalarySummary';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// interface SalaryMetricsProps {
//   departments: Department[];
// }

export function SalaryMetrics() {
  const { data: salarySummary, isLoading: isSalarySummaryLoading, isError: isSalarySummaryError } = useGetSalarySummary();

  const totalMonthlyPayroll = salarySummary?.totalMonthlyPayroll ?? 0;
  const averageCompensation = salarySummary?.averageCompensation ?? 0;
  const highestPaid = salarySummary?.highestPaid ?? 0;

  return (
    <section className="space-y-4">
      <h2 className="text-sm font-extrabold text-neutral-900 uppercase tracking-wider">Salary Reports</h2>
      {isSalarySummaryLoading ? (
        <div className="text-center text-neutral-400 text-xs py-6">Loading salary data...</div>
      ) : isSalarySummaryError ? (
        <div className="text-center text-red-500 text-xs py-6">Failed to load salary data.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <ReportCard label="Total Monthly Payroll" value={`₦${totalMonthlyPayroll.toLocaleString()}`} />
          <ReportCard label="Average Compensation" value={`₦${averageCompensation.toLocaleString()}`} />
          <ReportCard label="Highest Paid" value={`₦${highestPaid.toLocaleString()}`} />
        </div>
      )}
      <SalaryDistribution />
    </section>
  );
}

function SalaryDistribution() {
    const { data: salarySummary, isLoading: isSalarySummaryLoading, isError: isSalarySummaryError } = useGetSalarySummary();

    const salaryDistributionByDepartment = salarySummary?.salaryDistributionByDepartment ?? [];

  return (
    <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm">
      <h3 className="font-bold text-sm text-neutral-900 mb-6">Average Salary Distribution by Department</h3>
      {isSalarySummaryLoading ? (
        <div className="h-40 bg-neutral-50 rounded-xl animate-pulse" />
      ) : isSalarySummaryError ? (
        <div className="h-40 flex items-center justify-center text-red-500 text-xs">Failed to load chart data.</div>
      ) : salaryDistributionByDepartment.length === 0 ? (
        <div className="h-40 flex items-center justify-center text-neutral-400 text-xs">No data available.</div>
      ) : (
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={salaryDistributionByDepartment} margin={{ left: 10, right: 20 }}>
            <XAxis type="category" dataKey="department" tick={{ fontSize: 10 }} />
            <YAxis type="number" tick={{ fontSize: 10 }} />
            <Tooltip formatter={(value: any) => `₦${Number(value).toLocaleString()}`} />
            <Bar dataKey="averageSalary" fill="#ccd5ae" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
