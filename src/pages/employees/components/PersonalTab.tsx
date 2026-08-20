import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Hourglass } from 'ldrs/react';
import 'ldrs/react/Hourglass.css';
import { Dialog } from '../../../components/ui/dialog';
import type { Employee } from '../../../types/dashboard/employee';
import { useUpdateEmployee } from '@/hooks/useMutation/useUpdateEmployee';


interface PersonalTabProps {
  employee: Employee;
}

const phoneRegex = /^(?:\+234|0)(?:70[1-9]|80[2-9]|81[0-8]|90[1-9]|91[1-356]|702[5-9])\d{7}$/;

const personalSchema = z.object({
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().min(1, { message: 'Last name is required' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  phoneNumber: z.string().regex(phoneRegex, { message: 'Please enter a valid Nigerian phone number' }),
  gender: z.string().optional().or(z.literal('')),
  dob: z.string().optional().or(z.literal('')),
  address: z.string().optional().or(z.literal('')),
  emergencyContact: z.string().regex(phoneRegex, { message: 'Please enter a valid Nigerian phone number' }).optional().or(z.literal('')),
});

type PersonalFormValues = z.infer<typeof personalSchema>;

export function PersonalTab({ employee }: PersonalTabProps) {
  const { mutateAsync: updateEmployee, isPending: isUpdatingEmployee } = useUpdateEmployee(employee.id);
  const [showDialog, setShowDialog] = useState(false);

  const fields = [
    { label: 'First Name', name: 'firstName' as const },
    { label: 'Last Name', name: 'lastName' as const },
    { label: 'Email Address', name: 'email' as const, type: 'email' },
    { label: 'Phone Number', name: 'phoneNumber' as const },
    { label: 'Gender', name: 'gender' as const, type: 'select' as const, options: ['Male', 'Female', 'Other'] },
    { label: 'Date of Birth', name: 'dob' as const, type: 'date' },
    { label: 'Home Address', name: 'address' as const, colSpan: true },
    { label: 'Emergency Contact', name: 'emergencyContact' as const },
  ];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PersonalFormValues>({
    resolver: zodResolver(personalSchema),
    defaultValues: {
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      phoneNumber: employee.phoneNumber,
      gender: employee.gender,
      dob: employee.dob || '',
      address: employee.address || '',
      emergencyContact: employee.emergencyContact || '',
    },
  });

  const onSubmit = async (data: PersonalFormValues) => {
    const values = Object.values(data).filter(Boolean);
    if (values.length === 0) return;
    await updateEmployee(data);
    reset(data);
    setShowDialog(false);
  };

  return (
    <>
      <Dialog open={showDialog} onClose={() => setShowDialog(false)}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <h3 className="font-bold text-sm text-neutral-900 uppercase tracking-wider border-b border-neutral-100 pb-3">Edit Personal Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[40rem] overflow-y-auto pr-6">
            {fields.map((f) => (
              <div key={f.name} className={f.colSpan ? 'sm:col-span-2' : ''}>
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                  {f.label}
                </label>
                {f.type === 'select' ? (
                  <select {...register(f.name)} className="w-full py-2 px-3 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:border-[#ccd5ae]">
                    {f.options?.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                ) : (
                  <input
                    type={f.type ?? 'text'}
                    {...register(f.name)}
                    className="w-full py-2 px-3 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:border-[#ccd5ae]"
                  />
                )}
                {errors[f.name] && <p className="text-red-500 text-[10px] mt-1">{errors[f.name]?.message}</p>}
              </div>
            ))}
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
          <h3 className="font-bold text-sm text-neutral-900 uppercase tracking-wider">Details</h3>
          <button onClick={() => { reset(); setShowDialog(true); }} className="px-3 py-1.5 bg-[#ccd5ae] hover:bg-[#faedcd] text-neutral-950 text-xs font-bold rounded-xl transition-all cursor-pointer inline-flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
            Edit Info
          </button>
        </div>
        {/* Mobile (sm and below) grouped layout */}
        <div className="grid grid-cols-2 gap-6 text-xs sm:hidden">
          <div>
            <span className="text-neutral-400 font-bold block mb-1">First Name</span>
            <p className="font-bold text-neutral-900 text-sm break-words">{employee.firstName || 'Not set'}</p>
          </div>
          <div>
            <span className="text-neutral-400 font-bold block mb-1">Last Name</span>
            <p className="font-bold text-neutral-900 text-sm break-words">{employee.lastName || 'Not set'}</p>
          </div>
          <div className="col-span-2">
            <span className="text-neutral-400 font-bold block mb-1">Email Address</span>
            <p className="font-bold text-neutral-900 text-sm break-words">{employee.email || 'Not set'}</p>
          </div>
          <div className="col-span-2">
            <div className="grid grid-cols-3 gap-6">
              <div className="min-w-0">
                <span className="text-neutral-400 font-bold block mb-1">Phone</span>
                <p className="font-bold text-neutral-900 text-sm break-words">{employee.phoneNumber || 'Not set'}</p>
              </div>
              <div>
                <span className="text-neutral-400 font-bold block mb-1">Gender</span>
                <p className="font-bold text-neutral-900 text-sm">{employee.gender || 'Not set'}</p>
              </div>
              <div>
                <span className="text-neutral-400 font-bold block mb-1">Date of Birth</span>
                <p className="font-bold text-neutral-900 text-sm break-words">{employee.dob || 'Not set'}</p>
              </div>
            </div>
          </div>
          <div className="col-span-1 min-w-0">
            <span className="text-neutral-400 font-bold block mb-1">Home Address</span>
            <p className="font-bold text-neutral-900 text-sm break-words">{employee.address || 'Not set'}</p>
          </div>
          <div className="col-span-1 min-w-0">
            <span className="text-neutral-400 font-bold block mb-1">Emergency Contact</span>
            <p className="font-bold text-neutral-900 text-sm break-words">{employee.emergencyContact || 'Not set'}</p>
          </div>
        </div>

        {/* sm and above */}
        <div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-3 gap-6 text-xs">
          {fields.map((f) => (
            <div key={f.name} className={f.colSpan ? 'sm:col-span-2' : ''}>
              <span className="text-neutral-400 font-bold block mb-1">{f.label}</span>
              <p className="font-bold text-neutral-900 text-sm">{employee[f.name] || 'Not set'}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
