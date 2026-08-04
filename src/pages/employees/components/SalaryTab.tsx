import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Hourglass } from 'ldrs/react';
import 'ldrs/react/Hourglass.css';
import { Dialog } from '../../../components/ui/dialog';
import type { Employee } from '../../../types/dashboard/employee';
import { useUpdateSalary } from '@/hooks/useMutation/useUpdateSalary';

interface SalaryTabProps {
  employee: Employee;
}

const salarySchema = z.object({
  baseSalary: z.coerce.number().optional(),
  bonus: z.coerce.number().optional(),
  allowances: z.coerce.number().optional(),
});

type SalaryFormValues = z.infer<typeof salarySchema>;

export function SalaryTab({ employee }: SalaryTabProps) {
  const { mutateAsync: updateSalary, isPending: isUpdatingSalary } = useUpdateSalary(employee.id);
  const [showDialog, setShowDialog] = useState(false);
  const s = employee.Salary ?? { baseSalary: 0, bonus: 0, allowances: 0 };
  const total = (Number(s.baseSalary) || 0) + (Number(s.bonus) || 0) + (Number(s.allowances) || 0);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<SalaryFormValues>({
    resolver: zodResolver(salarySchema) as any,
    defaultValues: {
      baseSalary: s.baseSalary ?? 0,
      bonus: s.bonus ?? 0,
      allowances: s.allowances ?? 0,
    },
  });

  const watchedValues = watch();
  const formTotal = (Number(watchedValues.baseSalary) || 0) + (Number(watchedValues.bonus) || 0) + (Number(watchedValues.allowances) || 0);

  const onSubmit = async (data: SalaryFormValues) => {
    const hasValues = Object.values(data).some((v) => v !== undefined && v !== 0);
    if (!hasValues) return;
    await updateSalary({
      baseSalary: data.baseSalary ?? 0,
      bonus: data.bonus ?? 0,
      allowances: data.allowances ?? 0,
    });
    reset(data);
    setShowDialog(false);
  };

  return (
    <>
      <Dialog open={showDialog} onClose={() => setShowDialog(false)}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <h3 className="font-bold text-sm text-neutral-900 uppercase tracking-wider border-b border-neutral-100 pb-3">Adjust Compensation</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {(['baseSalary', 'bonus', 'allowances'] as const).map((field) => (
              <div key={field}>
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                  {field === 'baseSalary' ? 'Base Salary (₦)' : field === 'bonus' ? 'Bonus (₦)' : 'Allowances (₦)'}
                </label>
                <input type="number" {...register(field)} className="w-full py-2 px-3 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:border-[#ccd5ae]" />
                {errors[field] && <p className="text-red-500 text-[10px] mt-1">{errors[field]?.message}</p>}
              </div>
            ))}
          </div>
          <div className="bg-neutral-50 border border-neutral-100 p-3 rounded-xl">
            <span className="text-neutral-400 font-bold block text-xs">Total Compensation</span>
            <p className="font-black text-neutral-950 text-lg mt-1">₦{formTotal.toLocaleString()}</p>
          </div>
          <div className="flex gap-2 justify-end pt-2">
            <button type="button" onClick={() => setShowDialog(false)} className="px-3.5 py-2 bg-neutral-100 hover:bg-neutral-200 text-xs font-bold rounded-xl cursor-pointer">Cancel</button>
            <button type="submit" disabled={isUpdatingSalary} className="px-3.5 py-2 bg-[#ccd5ae] hover:bg-[#faedcd] text-neutral-950 text-xs font-bold rounded-xl cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
              {isUpdatingSalary ? <><Hourglass size={14} /> Saving...</> : 'Save Changes'}
            </button>
          </div>
        </form>
      </Dialog>

      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
          <h3 className="font-bold text-sm text-neutral-900 uppercase tracking-wider">Salary Information</h3>
          <button onClick={() => { reset(); setShowDialog(true); }} className="px-3 py-1.5 bg-[#ccd5ae] hover:bg-[#faedcd] text-neutral-950 text-xs font-bold rounded-xl transition-all cursor-pointer inline-flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Adjust Compensation
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-xs">
          <div>
            <span className="text-neutral-400 font-bold block mb-1">Base Salary</span>
            <p className="font-bold text-neutral-900 text-base">₦{Number(s.baseSalary || 0).toLocaleString()}</p>
          </div>
          <div>
            <span className="text-neutral-400 font-bold block mb-1">Bonus</span>
            <p className="font-bold text-neutral-900 text-base">₦{Number(s.bonus || 0).toLocaleString()}</p>
          </div>
          <div>
            <span className="text-neutral-400 font-bold block mb-1">Allowances</span>
            <p className="font-bold text-neutral-900 text-base">₦{Number(s.allowances || 0).toLocaleString()}</p>
          </div>
          <div className="bg-neutral-50 border border-neutral-100 p-3 rounded-xl">
            <span className="text-neutral-400 font-bold block">Total Compensation</span>
            <p className="font-black text-neutral-950 text-lg mt-1">₦{total.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </>
  );
}
