import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/PageHeader';
import { Avatar } from '../../components/ui/avatar';
import { StatusBadge } from '../../components/StatusBadge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/table';
import { Pagination } from '../../components/Pagination';
import { EmptyState } from '../../components/EmptyState';
import { AddEmployeeDialog } from './components/AddEmployeeDialog';
import { DeleteEmployeeDialog } from './components/DeleteEmployeeDialog';
import { useGetEmployees } from '@/hooks/useQuery/useGetEmployees';
import { useGetDepartments } from '@/hooks/useQuery/useGetDepartments';
import { DropdownMenu } from '../../components/ui/dropdown-menu';

export default function EmployeesList() {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [sortBy, setSortBy] = useState<'name' | 'dept' | 'joined'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);

  const {data: employeesData, isLoading: isEmployeesLoading, isError: isEmployeesError} = useGetEmployees({
    page: currentPage,
    limit: 10,
    search: searchTerm || undefined,
    departmentId: selectedDept === 'All' ? undefined : selectedDept,
    status: selectedStatus === 'All' ? undefined : selectedStatus as 'Active' | 'Inactive' | 'Probation' | 'Resigned' | 'Terminated' | 'OnLeave',
    sortBy,
    sortOrder,
  });
  const {data: departmentsData} = useGetDepartments();
  const navigate = useNavigate();
  const [deletingEmp, setDeletingEmp] = useState<{ id: string; name: string } | null>(null);

  const toggleSort = (field: 'name' | 'dept' | 'joined') => {
    if (sortBy === field) setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    else { setSortBy(field); setSortOrder('asc'); }
    setCurrentPage(1);
  };

  const sortIndicator = (field: 'name' | 'dept' | 'joined') =>
    sortBy === field ? (sortOrder === 'asc' ? ' ↑' : ' ↓') : '';

  const peopleIcon = (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-full h-full">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  );

  return (
    <>
      <AddEmployeeDialog open={showAddDialog} onClose={() => setShowAddDialog(false)} />
      {deletingEmp && (
        <DeleteEmployeeDialog
          employeeId={deletingEmp.id}
          employeeName={deletingEmp.name}
          onClose={() => setDeletingEmp(null)}
        />
      )}
      <div className="space-y-6">
      <PageHeader
        title="Employees"
        description="Manage personnel records, roles, settings, and profile info."
        action={
          <button onClick={() => setShowAddDialog(true)} className="px-4 py-2.5 bg-[#ccd5ae] hover:bg-[#faedcd] text-neutral-950 font-bold rounded-xl text-sm transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            Add Employee
          </button>
        }
      />

      {/* FILTER & SEARCH PANEL */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-4 flex flex-wrap gap-4">
        {/* Search Input */}
        <div className="flex-1 basis-full min-w-0 relative">
          <input
            type="text"
            placeholder="Search by name, ID or position..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full py-2.5 pl-10 pr-4 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-neutral-900"
          />
          <svg
            className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        {/* Dept Selector */}
        <div className="flex-1 basis-0 min-w-0 md:basis-auto md:w-48 md:flex-none">
          <select
            value={selectedDept}
            onChange={(e) => {
              setSelectedDept(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full py-2.5 px-3 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-neutral-900"
          >
            <option value="All">All Departments</option>
            {departmentsData?.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>
        {/* Status Selector */}
        <div className="flex-1 basis-0 min-w-0 md:basis-auto md:w-40 md:flex-none">
          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full py-2.5 px-3 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-neutral-900"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Probation">Probation</option>
            <option value="Resigned">Resigned</option>
            <option value="Terminated">Terminated</option>
            <option value="OnLeave">On Leave</option>
          </select>
        </div>
      </div>

      {/* ROSTER TABLE CONTAINER */}
      <div className="bg-white border border-neutral-200 rounded-2xl shadow-sm">
        {isEmployeesLoading ? (
          <div className="p-6 space-y-4 animate-pulse">
            <div className="h-4 bg-neutral-200 rounded w-1/4" />
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex gap-4">
                  <div className="h-10 bg-neutral-100 rounded w-8" />
                  <div className="h-10 bg-neutral-100 rounded w-20" />
                  <div className="h-10 bg-neutral-100 rounded flex-1" />
                  <div className="h-10 bg-neutral-100 rounded w-28" />
                  <div className="h-10 bg-neutral-100 rounded w-32" />
                  <div className="h-10 bg-neutral-100 rounded w-20" />
                  <div className="h-10 bg-neutral-100 rounded w-24" />
                  <div className="h-10 bg-neutral-100 rounded w-10" />
                </div>
              ))}
            </div>
          </div>
        ) : isEmployeesError ? (
          <div className="p-8 text-center">
            <p className="text-neutral-400 text-sm">Failed to load employees data</p>
          </div>
        ) : employeesData?.employees?.length === 0 ? (
          <EmptyState
            icon={peopleIcon}
            title="No employees found"
            description={
              searchTerm || selectedDept !== 'All' || selectedStatus !== 'All'
                ? 'No employees match your current filters. Try adjusting your search criteria.'
                : 'Register a new team member to get started.'
            }
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">S/N</TableHead>
                <TableHead>Employee ID</TableHead>
                <TableHead className="cursor-pointer hover:text-neutral-900 select-none" onClick={() => toggleSort('name')}>Full Name{sortIndicator('name')}</TableHead>
                <TableHead className="cursor-pointer hover:text-neutral-900 select-none" onClick={() => toggleSort('dept')}>Department{sortIndicator('dept')}</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="cursor-pointer hover:text-neutral-900 select-none" onClick={() => toggleSort('joined')}>Date Joined{sortIndicator('joined')}</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employeesData?.employees?.map((emp, index) => (
                <TableRow key={emp.id}>
                  <TableCell className="text-neutral-500 font-bold">{((currentPage - 1) * (employeesData?.pagination?.limit ?? 10)) + index + 1}</TableCell>
                  <TableCell className="font-bold text-neutral-950">{emp.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar firstName={emp.firstName} lastName={emp.lastName} photoUrl={emp.photoUrl} />
                      <div>
                        <Link to={`/dashboard/employees/${emp.id}`} className="font-bold text-neutral-900 hover:underline">
                          {emp.firstName} {emp.lastName}
                        </Link>
                        <p className="text-[10px] text-neutral-400">{emp.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="px-2 py-0.5 bg-neutral-100 text-neutral-800 text-[10px] font-bold rounded border border-neutral-200">{emp.department || 'Not Assigned'}</span>
                  </TableCell>
                  <TableCell className="text-neutral-600 font-semibold">{emp.position || 'Not Assigned'}</TableCell>
                  <TableCell><StatusBadge status={emp.status} /></TableCell>
                  <TableCell className="font-bold text-neutral-500">{emp.hireDate}</TableCell>
                  <TableCell className="text-right">
                      <DropdownMenu
                        trigger={
                          <svg className="w-6 h-6 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 5v.01M12 12v.01M12 19v.01" />
                          </svg>
                        }
                        items={[
                          {
                            label: 'View',
                            icon: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>,
                            onClick: () => { navigate(`/dashboard/employees/${emp.id}`); },
                          },
                          {
                            label: 'Delete',
                            icon: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
                            onClick: () => setDeletingEmp({ id: emp.id, name: `${emp.firstName} ${emp.lastName}` }),
                            danger: true,
                          },
                        ]}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
        )}

        <Pagination currentPage={currentPage} totalPages={employeesData?.pagination?.totalPages || 1} totalItems={employeesData?.pagination?.totalItems || 0} itemsPerPage={10} onPageChange={setCurrentPage} />
      </div>
    </div>
    </>
  );
}
