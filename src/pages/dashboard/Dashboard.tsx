import { Link } from 'react-router-dom';
import { PageHeader } from '../../components/PageHeader';
import { StatCard } from '../../components/StatCard';
import { Avatar } from '../../components/ui/avatar';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/table';
import { useGetDashboardStats } from '../../hooks/useQuery/useGetDashboardStats';
import { RecentActivityTimeline } from './components/RecentActivityTimeline';
import { QuickActions } from './components/QuickActions';
import { DepartmentCards } from './components/DepartmentCards';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Label } from 'recharts';
import type { RecentEmployee } from '../../types/dashboard/dashboard';

const STATUS_COLORS: Record<string, string> = {
  active: '#ccd5ae',
  probation: '#faedcd',
  onLeave: '#84a05a',
  inactive: '#d4d4d4',
  resigned: '#f5f5f5',
  terminated: '#a3a3a3',
};

export default function Dashboard() {
  const { data: dashboardStats, isError, isLoading } = useGetDashboardStats();
  const stats = dashboardStats?.data;
  const recentEmployees = stats?.recentEmployees ?? [];
  const departments = stats?.departmentOverview ?? [];
  const recentActivity = stats?.recentActivity ?? [];
  console.log('[Dashboard] recentActivity:', recentActivity);
  const statusDist = stats?.statusDistribution;

  const pieData = statusDist
    ? Object.entries(statusDist).map(([name, value]) => ({ name, value }))
    : [];
  const pieTotal = pieData.reduce((sum, d) => sum + d.value, 0);
  console.log('[Dashboard] statusDistribution:', statusDist);
  console.log('[Dashboard] pieData:', pieData);

  return (
    <div className="space-y-6">

      <PageHeader title="Overview" description="Here is what is happening across your workspace today." />

      {/* STATISTICS CARDS */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-sm animate-pulse">
              <div className="h-3 bg-neutral-100 rounded w-24 mb-3" />
              <div className="h-8 bg-neutral-100 rounded w-16" />
            </div>
          ))
        ) : (
          <>
            <StatCard label="Total Employees" value={isError ? '--' : stats?.totalEmployees} footer={isError ? 'Unable to Load' : 'Total database count'} />
            <StatCard label="Active Employees" value={isError ? '--' : stats?.activeEmployees} footer={isError ? 'Unable to Load' : '● Currently active'} footerClassName={isError ? '' : 'text-green-600 font-semibold'} />
            <StatCard label="Inactive Employees" value={isError ? '--' : stats?.inactiveEmployees} footer={isError ? 'Unable to Load' : 'Excluding active / probation'} />
            <StatCard label="Total Departments" value={isError ? '--' : stats?.totalDepartments} footer={isError ? 'Unable to Load' : 'Registered segments'} />
            <StatCard label="New This Month" value={isError ? '--' : stats?.newEmployeesThisMonth} footer={isError ? 'Unable to Load' : 'Hired in current month'} />
          </>
        )}
      </section>

      <QuickActions />

      {/* CHARTS GRAPHICS PANEL */}
      {isLoading ? (
        <section className="space-y-6">
          <div className="bg-white border border-neutral-200 rounded-2xl p-8 shadow-sm animate-pulse">
            <div className="h-4 bg-neutral-100 rounded w-48 mb-8" />
            <div className="flex items-center justify-center">
              <div className="w-40 h-40 bg-neutral-100 rounded-full" />
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm animate-pulse">
              <div className="h-4 bg-neutral-100 rounded w-40 mb-4" />
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 bg-neutral-100 rounded-xl" />
                ))}
              </div>
            </div>
            <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm animate-pulse">
              <div className="h-4 bg-neutral-100 rounded w-32 mb-4" />
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-5 h-5 bg-neutral-100 rounded-full shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-neutral-100 rounded w-full" />
                      <div className="h-2 bg-neutral-100 rounded w-16" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="space-y-6">

        {/* Employment Status Distribution */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-8 shadow-sm">
          <h3 className="font-bold text-sm text-neutral-900 mb-4">Employment Status Distribution</h3>
          {isError ? (
            <div className="flex items-center justify-center h-56 text-neutral-400 text-sm">Failed to load data</div>
          ) : (
            <div className="flex items-center gap-8">
              <ResponsiveContainer width="55%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={0}
                    outerRadius={120}
                    dataKey="value"
                    stroke="none"
                    label={({ name, value }) => {
                      const pct = pieTotal > 0 ? Math.round((value / pieTotal) * 100) : 0;
                      return pct > 0 ? `${pct}%` : '';
                    }}
                  >
                    {pieData.map((entry) => (
                      <Cell key={entry.name} fill={STATUS_COLORS[entry.name] ?? '#e5e5e5'} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any, name: string) => [value, name.charAt(0).toUpperCase() + name.slice(1)]} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-col gap-2 text-[11px] font-bold text-neutral-500 shrink-0">
                {pieData.map((entry) => (
                  <span key={entry.name} className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-sm shrink-0" style={{ backgroundColor: STATUS_COLORS[entry.name] }} />
                    {entry.name.charAt(0).toUpperCase() + entry.name.slice(1)}: {entry.value}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DepartmentCards departments={departments} />
          <RecentActivityTimeline activities={recentActivity} />
        </div>
      </section>
      )}

      {/* RECENT EMPLOYEES LIST TABLE */}
      {isLoading ? (
        <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm animate-pulse">
          <div className="h-5 bg-neutral-100 rounded w-40 mb-6" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-8 h-8 bg-neutral-100 rounded-full shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-neutral-100 rounded w-32" />
                  <div className="h-2 bg-neutral-100 rounded w-48" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <section className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-bold text-base text-neutral-900">Recent Employees</h3>
            <p className="text-xs text-neutral-500 mt-1">Newly hired personnel registered in the database.</p>
          </div>
          <Link to="/dashboard/employees" className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 rounded-xl text-xs font-bold text-neutral-700 transition-all">
            Manage All
          </Link>
        </div>

        {isError ? (
          <div className="py-8 text-center text-neutral-400 text-sm">Unable to Load Recent Employees</div>
        ) : recentEmployees.length === 0 ? (
          <div className="py-8 text-center text-neutral-400 text-sm">No employees registered yet.</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Date Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentEmployees.map((emp: RecentEmployee) => (
                <TableRow key={emp.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar firstName={emp.firstName} lastName={emp.lastName} photoUrl={emp.photoUrl} />
                      <div>
                        <Link to={`/dashboard/employees/${emp.id}`} className="font-bold text-neutral-900 hover:underline">
                          {emp.firstName} {emp.lastName}
                        </Link>
                        <p className="text-[10px] text-neutral-500">{emp.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="px-2 py-0.5 bg-neutral-100 text-neutral-800 text-[10px] font-bold rounded border border-neutral-200">
                      {emp.department}
                    </span>
                  </TableCell>
                  <TableCell className="text-neutral-600 font-medium">{emp.position}</TableCell>
                  <TableCell className="text-neutral-500 font-bold">{emp.hireDate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </section>
      )}
    </div>
  );
}
