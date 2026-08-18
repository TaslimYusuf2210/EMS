import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect } from 'react';
import { Dialog } from '../../../components/ui/dialog';
import { useGetEmployees } from '../../../hooks/useQuery/useGetEmployees';
import { useCreateDepartment } from '@/hooks/useMutation/useCreateDepartment';
import { Hourglass } from 'ldrs/react'
import 'ldrs/react/Hourglass.css'

const addSchema = z.object({
  name: z.string().min(2, { message: 'Department name must be at least 2 characters' }),
  description: z.string().min(1, { message: 'Description is required' }),
  head: z.string().optional(),
});

type AddFormValues = z.infer<typeof addSchema>;

interface AddDepartmentDialogProps {
  open: boolean;
  onClose: () => void;
}

export function AddDepartmentDialog({ open, onClose }: AddDepartmentDialogProps) {
  const [headSearch, setHeadSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [validatedHead, setValidatedHead] = useState('');
  const [validatedHeadId, setValidatedHeadId] = useState<string | null>(null);
  const { data: employeesData, isLoading: isSearching } = useGetEmployees(
    headSearch.length > 0 ? { search: headSearch, limit: 10 } : undefined
  );
  const { mutate: addDepartmentMutation, isPending: isAddingDepartment } = useCreateDepartment({
    onSuccess: () => {
      reset();
      onClose();
    },
  });
  const employeeList = employeesData?.employees ?? [];

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    setError,
    formState: { errors },
  } = useForm<AddFormValues>({
    resolver: zodResolver(addSchema),
    defaultValues: { name: '', description: '', head: '' },
  });

  useEffect(() => {
    setHeadSearch('');
    setShowDropdown(false);
    setValidatedHead('');
    setValidatedHeadId(null);
  }, [open]);

  const selectEmployee = (employee: { id: string; name: string }) => {
    setValidatedHead(employee.name);
    setValidatedHeadId(employee.id);
    setValue('head', employee.name);
    setHeadSearch('');
    setShowDropdown(false);
  };

  const onSubmit = (data: AddFormValues) => {
    if (data.head && data.head !== validatedHead) {
      setError('head', { message: 'Please select a valid employee from the list, or leave it empty for no department head' });
      return;
    }
    addDepartmentMutation({
      name: data.name,
      description: data.description,
      head: data.head || undefined,
      headId: data.head ? validatedHeadId : null,
    });
  };

  const handleClose = () => {
    reset();
    setHeadSearch('');
    setShowDropdown(false);
    setValidatedHead('');
    setValidatedHeadId(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <h3 className="font-extrabold text-sm text-neutral-900 uppercase tracking-wider pb-2 border-b border-neutral-100">
          Create Department
        </h3>
        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">Department Name</label>
            <input type="text" {...register('name')} className="w-full py-2 px-3 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:border-[#ccd5ae]" />
            {errors.name && <p className="text-red-500 text-[10px] mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">Department Head / Manager</label>
            <div
              className="relative"
              onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget)) {
                  setShowDropdown(false);
                }
              }}
            >
              <input
              placeholder="Search employee..."
              type="text"
              {...register('head', {
                onChange: (e) => {
                  setValidatedHead('');
                  setHeadSearch(e.target.value);
                  if (e.target.value) setShowDropdown(true);
                },
              })}
              onFocus={() => headSearch && setShowDropdown(true)}
              className="w-full py-2 px-3 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:border-[#ccd5ae]" />
              {errors.head && <p className="text-red-500 text-[10px] mt-1">{errors.head.message}</p>}

              {showDropdown && headSearch.length > 0 && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-neutral-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                  {isSearching ? (
                    <div className="p-3 text-xs text-neutral-400 text-center">Searching...</div>
                  ) : employeeList.length === 0 ? (
                    <div className="p-3 text-xs text-neutral-400 text-center">No employees found</div>
                  ) : (
                    employeeList.map((emp) => (
                      <button
                        key={emp.id}
                        type="button"
                        onMouseDown={() => selectEmployee({ id: emp.id, name: `${emp.firstName} ${emp.lastName}` })}
                        className="w-full text-left px-3 py-2 hover:bg-neutral-50 text-xs transition-colors cursor-pointer"
                      >
                        <span className="font-bold text-neutral-900">{emp.firstName} {emp.lastName}</span>
                        <span className="block text-[10px] text-neutral-400">{emp.department} &middot; {emp.position}</span>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
          <div>
            <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">Description</label>
            <input type="text" {...register('description')} className="w-full py-2 px-3 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:border-[#ccd5ae]" />
            {errors.description && <p className="text-red-500 text-[10px] mt-1">{errors.description.message}</p>}
          </div>
        </div>
        <div className="flex gap-2 justify-end pt-2">
          <button type="button" onClick={handleClose} className="px-3.5 py-2 bg-neutral-100 hover:bg-neutral-200 text-xs font-bold rounded-xl cursor-pointer">Cancel</button>
          <button
            type="submit"
            disabled={isAddingDepartment}
            className="px-3.5 py-2 bg-[#ccd5ae] hover:bg-[#faedcd] text-neutral-950 text-xs font-bold rounded-xl cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isAddingDepartment ? (
              <><Hourglass size={14} /> Creating...</>
            ) : (
              'Create Department'
            )}
          </button>
        </div>
      </form>
    </Dialog>
  );
}
