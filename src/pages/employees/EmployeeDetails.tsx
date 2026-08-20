import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import type { TabType } from '../../types/dashboard/employee';
import { StatusBadge } from '../../components/StatusBadge';
import { DeleteEmployeeDialog } from './components/DeleteEmployeeDialog';
import { PersonalTab } from './components/PersonalTab';
import { EmploymentTab } from './components/EmploymentTab';
import { SalaryTab } from './components/SalaryTab';
import { BankTab } from './components/BankTab';
import { EducationSection } from './components/EducationSection';
import { DocumentsSection } from './components/DocumentsSection';
import { NotesSection } from './components/NotesSection';
import { useGetEmployeeById } from '../../hooks/useQuery/useGetEmployeeById';
import { ProfileHeadshot } from './components/ProfileHeadshot';

const TABS: { key: TabType; label: string }[] = [
  { key: 'personal', label: 'personal' },
  { key: 'employment', label: 'employment' },
  { key: 'education', label: 'education' },
  { key: 'salary', label: 'salary' },
  { key: 'bank', label: 'Bank Account' },
  { key: 'documents', label: 'documents' },
  { key: 'notes', label: 'notes' },
];

export default function EmployeeDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<TabType>('personal');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { data: employee, isLoading: isEmployeeLoading } = useGetEmployeeById(id);

  if (isEmployeeLoading) {
    return (
      <div className="py-12 flex justify-center">
        <div className="space-y-4 w-full max-w-2xl animate-pulse">
          <div className="h-6 bg-neutral-100 rounded w-48" />
          <div className="h-4 bg-neutral-100 rounded w-32" />
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="py-12 text-center">
        <h3 className="font-extrabold text-neutral-800 text-lg">Employee not found</h3>
        <p className="text-sm text-neutral-500 mt-1">The requested profile does not exist in the database.</p>
        <Link to="/dashboard/employees" className="mt-4 inline-block px-4 py-2 bg-surface-muted text-neutral-950 rounded-xl font-bold text-xs">
          Return to roster
        </Link>
      </div>
    );
  }

  

  return (
    <div className="space-y-6">

      {/* Back link */}
      <Link
        to="/dashboard/employees"
        className="text-xs font-bold text-neutral-500 hover:text-neutral-900 transition-colors flex items-center gap-1"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Employees
      </Link>

      {/* Profile summary header */}
      <div className="bg-white border border-neutral-200 rounded-3xl p-6 shadow-sm">
        <div className="flex flex-col xl:flex-row xl:items-stretch gap-6">
          <ProfileHeadshot employee={employee} />

          <div className="flex-1 flex flex-col justify-between">
            <div>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-semibold text-indigo-600 uppercase tracking-[0.32em]">Employee profile</p>
                  <h1 className="text-3xl font-black text-neutral-950 mt-2">{employee.firstName} {employee.lastName}</h1>
                  <div className="mt-2 flex items-center gap-3">
                    <span className="text-sm font-semibold text-neutral-950">{employee.position}</span>
                    <span className="text-[11px] uppercase tracking-[0.3em] text-neutral-400">{employee.department}</span>
                  </div>
                </div>
                <StatusBadge status={employee.status} className="self-start" />
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-neutral-100 text-neutral-700 px-3 py-1 text-xs font-semibold">ID: {employee.id}</span>
                <span className="rounded-full bg-neutral-100 text-neutral-700 px-3 py-1 text-xs font-semibold">Joined {employee.hireDate}</span>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={() => setShowDeleteDialog(true)}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100"
                title="Delete employee"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 xl:grid-cols-5 gap-4">
          <div className="rounded-3xl bg-surface-subtle border border-neutral-100 p-5 min-w-0">
            <p className="text-[11px] uppercase tracking-[0.24em] text-neutral-400">Email</p>
            <p className="mt-3 text-sm font-semibold text-neutral-950 break-words">{employee.email}</p>
          </div>
          <div className="rounded-3xl bg-surface-subtle border border-neutral-100 p-5 min-w-0">
            <p className="text-[11px] uppercase tracking-[0.24em] text-neutral-400">Phone</p>
            <p className="mt-3 text-sm font-semibold text-neutral-950 break-words">{employee.phoneNumber}</p>
          </div>
          <div className="rounded-3xl bg-surface-subtle border border-neutral-100 p-5 min-w-0">
            <p className="text-[11px] uppercase tracking-[0.24em] text-neutral-400">Employment type</p>
            <p className="mt-3 text-sm font-semibold text-neutral-950 break-words">{employee.employmentType}</p>
          </div>
          <div className="rounded-3xl bg-surface-subtle border border-neutral-100 p-5 min-w-0">
            <p className="text-[11px] uppercase tracking-[0.24em] text-neutral-400">Hire date</p>
            <p className="mt-3 text-sm font-semibold text-neutral-950 break-words">{employee.hireDate}</p>
          </div>
          <div className="rounded-3xl bg-surface-subtle border border-neutral-100 p-5 min-w-0">
            <p className="text-[11px] uppercase tracking-[0.24em] text-neutral-400">Manager</p>
            <p className="mt-3 text-sm font-semibold text-neutral-950 break-words">{employee.reportingManager || 'Not assigned'}</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="rounded-3xl border border-neutral-100 p-5 bg-neutral-50 min-w-0">
            <p className="text-[11px] uppercase tracking-[0.24em] text-neutral-400">Address</p>
            <p className="mt-3 text-sm font-semibold text-neutral-950 break-words">{employee.address || 'No address provided'}</p>
          </div>
          <div className="rounded-3xl border border-neutral-100 p-5 bg-neutral-50 min-w-0">
            <p className="text-[11px] uppercase tracking-[0.24em] text-neutral-400">Emergency contact</p>
            <p className="mt-3 text-sm font-semibold text-neutral-950 break-words">{employee.emergencyContact || 'Not available'}</p>
          </div>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="border-b border-neutral-200 flex overflow-x-auto gap-2 scrollbar-none">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`py-3 px-4 text-xs font-bold border-b-2 capitalize whitespace-nowrap transition-all cursor-pointer ${
              activeTab === tab.key ? 'border-neutral-950 text-neutral-950' : 'border-transparent text-neutral-400 hover:text-neutral-950'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tabs content */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-6 md:p-8 shadow-sm">
        {activeTab === 'personal' && <PersonalTab employee={employee} />}
        {activeTab === 'employment' && <EmploymentTab employee={employee} />}
        {activeTab === 'education' && <EducationSection education={employee.Education} employeeId={employee.id} />}
        {activeTab === 'salary' && <SalaryTab employee={employee} />}
        {activeTab === 'bank' && <BankTab employee={employee}/>}
        {activeTab === 'documents' && <DocumentsSection documents={employee.Documents} employeeId={employee.id} />}
        {activeTab === 'notes' && <NotesSection notes={employee.Notes} employeeId={employee.id} />}
      </div>

      {showDeleteDialog && (
        <DeleteEmployeeDialog
          employeeId={employee.id}
          employeeName={`${employee.firstName} ${employee.lastName}`}
          onSuccess={() => navigate('/dashboard/employees')}
          onClose={() => setShowDeleteDialog(false)}
        />
      )}
    </div>
  );
}

