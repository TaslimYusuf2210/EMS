import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Hourglass } from 'ldrs/react';
import 'ldrs/react/Hourglass.css';
import { Dialog } from '../../../components/ui/dialog';
import type { Employee } from '../../../types/dashboard/employee';
import { useUpdateEmployee } from '@/hooks/useMutation/useUpdateEmployee';
import { useGetDepartments } from '@/hooks/useQuery/useGetDepartments';
import { useGetDepartmentPositions } from '@/hooks/useQuery/useGetDepartmentPositions';
import { useGetEmployees } from '@/hooks/useQuery/useGetEmployees';

interface EmploymentTabProps {
  employee: Employee;
  
}

const employmentSchema = z.object({
  department: z.string().optional().or(z.literal('')),
  position: z.string().optional().or(z.literal('')),
  employmentType: z.string().optional().or(z.literal('')),
  hireDate: z.string().optional().or(z.literal('')),
  reportingManager: z.string().optional().or(z.literal('')),
  status: z.string().optional().or(z.literal('')),
});

type EmploymentFormValues = z.infer<typeof employmentSchema>;

export function EmploymentTab({ employee }: EmploymentTabProps) {
  const { mutateAsync: updateEmployee, isPending: isUpdatingEmployee } = useUpdateEmployee(employee.id);
  const { data: departments } = useGetDepartments();
  const [headSearch, setHeadSearch] = useState('');
  const [showHeadDropdown, setShowHeadDropdown] = useState(false);
  const [validatedManagerId, setValidatedManagerId] = useState<string | null>(employee.reportingManagerId ?? null);
  const { data: employees } = useGetEmployees(
    employee.departmentId ? { departmentId: employee.departmentId } : undefined
  );
  const { data: positions } = useGetDepartmentPositions(employee.departmentId ?? undefined);
  const [showDialog, setShowDialog] = useState(false);
  const employeeList = (employees?.employees ?? []).filter((e) => e.id !== employee.id);

  const fields = [
    { label: 'Employee ID', value: employee.id, name: 'id', readOnly: true },
    { label: 'Department', name: 'department' as const, type: 'select' as const, options: (departments ?? []).map((d) => d.name) },
    { label: 'Position', name: 'position' as const, type: 'select' as const, options: (positions ?? []).map((p) => p.title) },
    { label: 'Employment Type', name: 'employmentType' as const, type: 'select' as const, options: ['Full-time', 'Part-time', 'Contract', 'Intern', 'Remote'] },
    { label: 'Hire Date', name: 'hireDate' as const, type: 'date' },
    { label: 'Reporting Manager', name: 'reportingManager' as const, readOnly: true },
    { label: 'Employment Status', name: 'status' as const, type: 'select' as const, options: ['Active', 'Inactive', 'Probation', 'Resigned', 'Terminated', 'OnLeave'] },
  ];

  const editableFields = fields.filter((f) => !f.readOnly);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<EmploymentFormValues>({
    resolver: zodResolver(employmentSchema),
    defaultValues: {
      department: employee.department,
      position: employee.position,
      employmentType: employee.employmentType,
      hireDate: employee.hireDate,
      reportingManager: employee.reportingManager || '',
      status: employee.status,
    },
  });

  const selectEmployee = (employee: { id: string; name: string }) => {
    setValue('reportingManager', employee.name);
    setValidatedManagerId(employee.id);
    setHeadSearch('');
    setShowHeadDropdown(false);
  };

  const onSubmit = async (data: EmploymentFormValues) => {
    const values = Object.values(data).filter(Boolean);
    if (values.length === 0) return;
    const selectedDept = (departments ?? []).find((d) => d.name === data.department);
    const selectedPosition = (positions ?? []).find((p) => p.title === data.position);
    await updateEmployee({
      ...data,
      departmentId: data.department ? selectedDept?.id ?? null : null,
      positionId: data.position ? selectedPosition?.id ?? null : null,
      reportingManagerId: data.reportingManager ? validatedManagerId : null,
    });
    reset(data);
    setShowDialog(false);
  };

  return (
    <>
      <Dialog open={showDialog} onClose={() => setShowDialog(false)}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <h3 className="font-bold text-sm text-neutral-900 uppercase tracking-wider border-b border-neutral-100 pb-3">Edit Employment Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[40rem] overflow-y-auto pr-6">
            {editableFields.map((f) => {
              const fieldName = f.name as keyof EmploymentFormValues;
              return (
                <div key={f.name}>
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">{f.label}</label>
                  {f.type === 'select' ? (
                    <select {...register(fieldName)} className="w-full py-2 px-3 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:border-[#ccd5ae]">
                      {f.options?.map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                  ) : (
                    <input type={f.type ?? 'text'} {...register(fieldName)} className="w-full py-2 px-3 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:border-[#ccd5ae]" />
                  )}
                  {errors[fieldName] && <p className="text-red-500 text-[10px] mt-1">{errors[fieldName]?.message}</p>}
                </div>
              );
            })}

            {/* Reporting Manager - searchable */}
            <div>
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">Reporting Manager</label>
              <div
                className="relative"
                onBlur={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget)) {
                    setShowHeadDropdown(false);
                  }
                }}
              >
                <input
                  placeholder="Search employee..."
                  type="text"
                  {...register('reportingManager', {
                    onChange: (e) => {
                      setValidatedManagerId(null);
                      setHeadSearch(e.target.value);
                      if (e.target.value) setShowHeadDropdown(true);
                    },
                  })}
                  onFocus={() => headSearch && setShowHeadDropdown(true)}
                  className="w-full py-2 px-3 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:border-[#ccd5ae]"
                />
                {errors.reportingManager && <p className="text-red-500 text-[10px] mt-1">{errors.reportingManager.message}</p>}

                {showHeadDropdown && headSearch.length > 0 && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-neutral-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                    {employeeList.length === 0 ? (
                      <div className="p-3 text-xs text-neutral-400 text-center">No employees found</div>
                    ) : (
                      employeeList
                        .filter((e) =>
                          `${e.firstName} ${e.lastName}`.toLowerCase().includes(headSearch.toLowerCase())
                        )
                        .map((e) => (
                          <button
                            key={e.id}
                            type="button"
                            onMouseDown={() => selectEmployee({ id: e.id, name: `${e.firstName} ${e.lastName}` })}
                            className="w-full text-left px-3 py-2 hover:bg-neutral-50 text-xs transition-colors cursor-pointer"
                          >
                            <span className="font-bold text-neutral-900">{e.firstName} {e.lastName}</span>
                            <span className="block text-[10px] text-neutral-400">{e.department} &middot; {e.position}</span>
                          </button>
                        ))
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-2 justify-end pt-2">
            <button type="button" onClick={() => setShowDialog(false)} className="px-3.5 py-2 bg-neutral-100 hover:bg-neutral-200 text-xs font-bold rounded-xl cursor-pointer">Cancel</button>
            <button type="submit" disabled={isUpdatingEmployee} className="px-3.5 py-2 bg-[#ccd5ae] hover:bg-[#faedcd] text-neutral-950 text-xs font-bold rounded-xl cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
              {isUpdatingEmployee ? <><Hourglass size={14} /> Saving...</> : 'Save Changes'}
            </button>
          </div>
        </form>
      </Dialog>

      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
          <h3 className="font-bold text-sm text-neutral-900 uppercase tracking-wider">Employment Information</h3>
          <button onClick={() => { reset(); setValidatedManagerId(employee.reportingManagerId ?? null); setShowDialog(true); }} className="px-3 py-1.5 bg-[#ccd5ae] hover:bg-[#faedcd] text-neutral-950 text-xs font-bold rounded-xl transition-all cursor-pointer inline-flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
            Edit
          </button>
        </div>
        {/* Mobile (sm and below) grouped layout */}
        <div className="grid grid-cols-2 gap-6 text-xs sm:hidden">
          <div className="min-w-0">
            <span className="text-neutral-400 font-bold block mb-1">Employee ID</span>
            <p className="font-bold text-neutral-900 text-sm break-words">{employee.id}</p>
          </div>
          <div className="min-w-0">
            <span className="text-neutral-400 font-bold block mb-1">Department</span>
            <p className="font-bold text-neutral-900 text-sm break-words">{employee.department || 'Not set'}</p>
          </div>
          <div className="col-span-2">
            <div className="grid grid-cols-3 gap-6">
              <div className="min-w-0">
                <span className="text-neutral-400 font-bold block mb-1">Position</span>
                <p className="font-bold text-neutral-900 text-sm break-words">{employee.position || 'Not set'}</p>
              </div>
              <div className="min-w-0">
                <span className="text-neutral-400 font-bold block mb-1">Employment Type</span>
                <p className="font-bold text-neutral-900 text-sm break-words">{employee.employmentType || 'Not set'}</p>
              </div>
              <div className="min-w-0">
                <span className="text-neutral-400 font-bold block mb-1">Hire Date</span>
                <p className="font-bold text-neutral-900 text-sm break-words">{employee.hireDate || 'Not set'}</p>
              </div>
            </div>
          </div>
          <div className="col-span-1 min-w-0">
            <span className="text-neutral-400 font-bold block mb-1">Reporting Manager</span>
            <p className="font-bold text-neutral-900 text-sm break-words">{employee.reportingManager || 'Not set'}</p>
          </div>
          <div className="col-span-1 min-w-0">
            <span className="text-neutral-400 font-bold block mb-1">Employment Status</span>
            <p className="font-bold text-neutral-900 text-sm">{employee.status || 'Not set'}</p>
          </div>
        </div>

        {/* sm and above */}
        <div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-3 gap-6 text-xs">
          {fields.map((f) => (
            <div key={f.name}>
              <span className="text-neutral-400 font-bold block mb-1">{f.label}</span>
              <p className="font-bold text-neutral-900 text-sm">{'value' in f ? f.value : (employee[f.name as keyof Employee] as string) || 'Not set'}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
