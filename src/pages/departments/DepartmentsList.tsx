import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { Department } from "../../types/dashboard/department";
import { useGetDepartments } from "../../hooks/useQuery/useGetDepartments";
import { AddDepartmentDialog } from "./components/AddDepartmentDialog";
import { EditDepartmentDialog } from "./components/EditDepartmentDialog";
import { DeleteDepartmentDialog } from "./components/DeleteDepartmentDialog";
import { DropdownMenu } from "../../components/ui/dropdown-menu";
import { EmptyState } from "../../components/EmptyState";

export default function DepartmentsList() {
  const navigate = useNavigate();
  const { data: departmentsData, isLoading: isDepartmentsLoading, isError: isDepartmentsError } = useGetDepartments();
  const departments = departmentsData ?? [];
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingDep, setEditingDep] = useState<Department | null>(null);
  const [deletingDep, setDeletingDep] = useState<Department | null>(null);
  return (
    <div className="space-y-6">
      {" "}
      {/* Header */}{" "}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {" "}
        <div>
          {" "}
          <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">
            Departments
          </h1>{" "}
          <p className="text-sm text-neutral-500 mt-1">
            Manage departmental divisions, heads, and employee placements.
          </p>{" "}
        </div>{" "}
        {!showAddDialog && !editingDep && (
          <button
            onClick={() => setShowAddDialog(true)}
            className="px-4 py-2.5 bg-[#ccd5ae] hover:bg-[#faedcd] text-neutral-950 font-bold rounded-xl text-sm transition-all shadow-sm shrink-0 flex items-center justify-center gap-2 cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            Create Department
          </button>
        )}
      </div>

      <AddDepartmentDialog open={showAddDialog} onClose={() => setShowAddDialog(false)} />
      <EditDepartmentDialog department={editingDep} onClose={() => setEditingDep(null)} />
      {deletingDep && (
        <DeleteDepartmentDialog
          departmentId={deletingDep.id}
          departmentName={deletingDep.name}
          memberCount={deletingDep.employeeCount}
          onClose={() => setDeletingDep(null)}
        />
      )}

      {/* DEPARTMENTS TABLE */}{" "}
      <div className="bg-white border border-neutral-200 rounded-2xl shadow-sm">
        {" "}
        {isDepartmentsLoading ? (
          <div className="p-6 space-y-4 animate-pulse">
            <div className="h-4 bg-neutral-200 rounded w-1/4" />
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex gap-4">
                  <div className="h-10 bg-neutral-100 rounded flex-1" />
                  <div className="h-10 bg-neutral-100 rounded flex-1" />
                  <div className="h-10 bg-neutral-100 rounded w-24" />
                  <div className="h-10 bg-neutral-100 rounded w-28" />
                  <div className="h-10 bg-neutral-100 rounded w-32" />
                </div>
              ))}
            </div>
          </div>
        ) : isDepartmentsError ? (
          <div className="p-8 text-center">
            <p className="text-neutral-400 text-sm">Failed to load department data</p>
          </div>
        ) : departments.length === 0 ? (
          <EmptyState
            icon={
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-full h-full">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            }
            title="No department found"
            description="Departments help organize your team. Try creating a new department to get started."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-neutral-100 text-neutral-400 font-bold uppercase tracking-wider">
                  <th className="p-4 font-semibold">S/N</th>
                  <th className="p-4 font-semibold">ID</th>
                  <th className="p-4 font-semibold">Department Name</th>
                  <th className="p-4 font-semibold">Department Head</th>
                  <th className="p-4 font-semibold">Employee Count</th>
                  <th className="p-4 font-semibold">Date Created</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {departments.map((dep, index) => {
                  return (
                    <tr
                      key={dep.id}
                      className="hover:bg-neutral-50/50 transition-all"
                    >
                      <td className="p-4 text-neutral-500 font-bold text-center">{index + 1}</td>
                      <td className="p-4 text-neutral-400 text-[10px] font-mono">{dep.id}</td>
                      <td className="p-4 font-bold text-neutral-900">
                        <Link
                          to={`/dashboard/departments/${dep.id}`}
                          className="hover:underline"
                        >
                          {dep.name}
                        </Link>
                        <p className="text-[10px] text-neutral-400 font-medium normal-case mt-0.5">
                          {dep.description}
                        </p>
                      </td>
                      <td className="p-4 text-neutral-700 font-bold">
                        {dep.head || <span className="text-neutral-400 font-medium">Not assigned</span>}
                      </td>
                      <td className="p-4 font-black text-neutral-900">
                        {dep.employeeCount} members
                      </td>
                      <td className="p-4 font-bold text-neutral-500">
                        {dep.dateCreated}
                      </td>
                      <td className="p-4 text-right">
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
                              onClick: () => navigate(`/dashboard/departments/${dep.id}`),
                            },
                            {
                              label: 'Edit',
                              icon: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>,
                              onClick: () => setEditingDep(dep),
                            },
                            {
                              label: 'Delete',
                              icon: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
                              onClick: () => setDeletingDep(dep),
                              danger: true,
                            },
                          ]}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}{" "}
      </div>{" "}
    </div>
  );
}
