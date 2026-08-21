import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useGetDepartmentById } from "@/hooks/useQuery/useGetDepartmentById";
import { DeleteDepartmentDialog } from "./components/DeleteDepartmentDialog";
import { Avatar } from "../../components/ui/avatar";

export default function DepartmentDetails() {
  const { id } = useParams<{ id: string | undefined }>();
  const navigate = useNavigate();
  const { data: departmentData, isLoading: isDeptLoading } = useGetDepartmentById(id);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const handleDeletionSuccess = () => {
    navigate('/dashboard/departments');
  };
  const department = departmentData?.data?.department;
  const members = departmentData?.data?.members || [];

  if (isDeptLoading) {
    return (
      <div className="py-12 flex justify-center">
        <div className="space-y-4 w-full max-w-2xl animate-pulse">
          <div className="h-6 bg-neutral-100 rounded w-48" />
          <div className="h-4 bg-neutral-100 rounded w-32" />
        </div>
      </div>
    );
  }

  if (!department) {
    return (
      <div className="py-12 text-center">
                <h3 className="font-extrabold text-neutral-800 text-lg">
          Department not found
        </h3>        <p className="text-sm text-neutral-500 mt-1">
          The requested department does not exist.
        </p>        <Link
          to="/dashboard/departments"
          className="mt-4 inline-block px-4 py-2 bg-[#e9edc9] text-neutral-950 rounded-xl font-bold text-xs"
        >
                    Back to Departments        </Link>      </div>
    );
  }
  
  return (
    <div className="space-y-6">
            {/* Back link */}      <Link
        to="/dashboard/departments"
        className="text-xs font-bold text-neutral-500 hover:text-neutral-900 transition-colors flex items-center gap-1"
      >
                <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>        Back to Departments      </Link>      {/* Department Header */}      <div className="bg-whitebg-surface-muted border border-neutral-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-neutral-900 tracking-tight">
            {department.name}
          </h1>          <p className="text-sm text-neutral-500 mt-1 max-w-lg">
            {department.description}
          </p>        </div>        <div className="flex items-start gap-3 shrink-0">
          <div className="grid grid-cols-2 gap-4">
                        <div className="bg-neutral-50 border border-neutral-100 p-4 rounded-xl text-center">
                            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                Head
              </span>              <p className="font-extrabold text-neutral-950 text-sm mt-1">
                {department.head}
              </p>            </div>            <div className="bg-neutral-50 border border-neutral-100 p-4 rounded-xl text-center">
                            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                Members
              </span>              <p className="font-black text-neutral-950 text-xl mt-1">
                {members.length}
              </p>            </div>          </div>
          <button
            onClick={() => setShowDeleteDialog(true)}
            className="p-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-colors cursor-pointer shrink-0"
            title="Delete department"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>      </div>      {/* Employees in this Department */}      <div className="bg-whitebg-surface-muted border border-neutral-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-neutral-100">
                    <h3 className="font-bold text-base text-neutral-900">
            Department Members
          </h3>          <p className="text-xs text-neutral-500 mt-0.5">
            All employees currently assigned to {department.name}.
          </p>        </div>        {members.length === 0 ? (
          <div className="p-12 text-center text-neutral-400 text-sm">
                        No employees assigned to this department yet.          </div>
        ) : (
          <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                            <thead>
                                <tr className="border-b border-neutral-100 text-neutral-400 font-bold uppercase tracking-wider">
                                    <th className="p-4 font-semibold">Employee</th>                  <th className="p-4 font-semibold">Position</th>                  <th className="p-4 font-semibold">Status</th>                  <th className="p-4 font-semibold">Hire Date</th>                  <th className="p-4 font-semibold text-right">Action</th>                </tr>              </thead>              <tbody className="divide-y divide-neutral-100">
                                {members.map((emp) => (
                  <tr
                    key={emp.id}
                    className="hover:bg-neutral-50/50hover:bg-surface-warm/30 transition-all"
                  >
                                        <td className="p-4 flex items-center gap-3">
                                            <Avatar firstName={emp.firstName} lastName={emp.lastName} photoUrl={emp.photoUrl} professionalHeadshot={emp.professionalHeadshot} />
                      <div>
                                                <p className="font-bold text-neutral-900">
                          {emp.firstName} {emp.lastName}
                        </p>                        <p className="text-[10px] text-neutral-400">
                          {emp.email}
                        </p>                      </div>                    </td>                    <td className="p-4 text-neutral-600 font-semibold">
                      {emp.position}
                    </td>                    <td className="p-4">
                                            <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${emp.status === "Active" ? "bg-[#ccd5ae] text-neutral-950 " : "bg-neutral-100bg-surface-warm text-neutral-600 "}`}
                      >
                                                {emp.status}                      </span>                    </td>                    <td className="p-4 font-bold text-neutral-500">
                      {emp.hireDate}
                    </td>                    <td className="p-4 text-right">
                                            <Link
                        to={`/dashboard/employees/${emp.id}`}
                        className="px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200bg-surface-warm text-[10px] font-bold rounded-lg text-neutral-800 transition-all"
                      >
                                                <span className="md:hidden">View</span><span className="hidden md:inline">View Profile</span>                      </Link>                    </td>                  </tr>
                ))}              </tbody>            </table>          </div>
        )}      </div>
      {showDeleteDialog && (
        <DeleteDepartmentDialog
          departmentId={department.id}
          departmentName={department.name}
          memberCount={members.length}
          onSuccess={handleDeletionSuccess}
          onClose={() => setShowDeleteDialog(false)}
        />
      )}
    </div>
  );
}
