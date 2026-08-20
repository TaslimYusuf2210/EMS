import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Hourglass } from 'ldrs/react';
import 'ldrs/react/Hourglass.css';
import { toast } from 'sonner';
import { Dialog } from '../../../components/ui/dialog';
import type { Employee } from '../../../types/dashboard/employee';
import { useUpdateBank } from '@/hooks/useMutation/useUpdateBank';
import banks from '@/constants/NigeriaBanks';

interface BankTabProps {
  employee: Employee;
}

const bankSchema = z.object({
  bankName: z.string().optional().or(z.literal('')),
  firstName: z.string().min(1, { message: 'First name is required' }).optional().or(z.literal('')),
  lastName: z.string().min(1, { message: 'Last name is required' }).optional().or(z.literal('')),
  accountNumber: z.string().length(10, { message: 'Account number must be exactly 10 digits' }).optional().or(z.literal('')),
});

type BankFormValues = z.infer<typeof bankSchema>;

export function BankTab({ employee }: BankTabProps) {
  const { mutateAsync: updateBank, isPending: isUpdatingBank } = useUpdateBank(employee.id);
  const [showDialog, setShowDialog] = useState(false);
  const [bankSearch, setBankSearch] = useState('');
  const [showBankDropdown, setShowBankDropdown] = useState(false);
  const b = employee.BankAccount ?? { bankName: '', accountName: '', accountNumber: '' };
  const nameParts = b.accountName ? b.accountName.trim().split(/\s+/) : [];
  const defaultFirstName = nameParts[0] || '';
  const defaultLastName = nameParts.slice(1).join(' ') || '';

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<BankFormValues>({
    resolver: zodResolver(bankSchema),
    defaultValues: {
      bankName: b.bankName,
      firstName: defaultFirstName,
      lastName: defaultLastName,
      accountNumber: b.accountNumber,
    },
  });

  const filteredBanks = banks.filter((bank) =>
    bank.name.toLowerCase().includes(bankSearch.toLowerCase())
  );

  const selectBank = (name: string) => {
    setValue('bankName', name);
    setBankSearch('');
    setShowBankDropdown(false);
  };

  const onSubmit = async (data: BankFormValues) => {
    const values = [data.bankName, data.firstName, data.lastName, data.accountNumber].filter(Boolean);
    if (values.length < 4) {
      toast.error('All bank fields are required. Please fill in all details.');
      return;
    }
    await updateBank({
      bankName: data.bankName ?? '',
      accountName: `${data.firstName ?? ''} ${data.lastName ?? ''}`.trim(),
      accountNumber: data.accountNumber ?? '',
    });
    reset(data);
    setShowDialog(false);
  };

  return (
    <>
      <Dialog open={showDialog} onClose={() => setShowDialog(false)}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <h3 className="font-bold text-sm text-neutral-900 uppercase tracking-wider border-b border-neutral-100 pb-3">Configure Bank Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Bank Name - searchable dropdown */}
            <div>
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">Bank Name</label>
              <div
                className="relative"
                onBlur={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget)) {
                    setShowBankDropdown(false);
                  }
                }}
              >
                <input
                  placeholder="Search bank..."
                  type="text"
                  {...register('bankName', {
                    onChange: (e) => {
                      setBankSearch(e.target.value);
                      if (e.target.value) setShowBankDropdown(true);
                    },
                  })}
                  onFocus={() => bankSearch && setShowBankDropdown(true)}
                  className="w-full py-2 px-3 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:border-[#ccd5ae]"
                />
                {errors.bankName && <p className="text-red-500 text-[10px] mt-1">{errors.bankName.message}</p>}

                {showBankDropdown && bankSearch.length > 0 && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-neutral-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                    {filteredBanks.length === 0 ? (
                      <div className="p-3 text-xs text-neutral-400 text-center">No banks found</div>
                    ) : (
                      filteredBanks.map((bank) => (
                        <button
                          key={bank.value}
                          type="button"
                          onMouseDown={() => selectBank(bank.name)}
                          className="w-full text-left px-3 py-2 hover:bg-neutral-50 text-xs transition-colors cursor-pointer"
                        >
                          <span className="font-bold text-neutral-900">{bank.name}</span>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Account Name group */}
            <div className="sm:col-span-2">
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-2 border-b border-neutral-100 pb-1.5">
                Account Name
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">First Name</label>
                  <input type="text" {...register('firstName')} placeholder="e.g. Brooklyn" className="w-full py-2 px-3 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:border-[#ccd5ae]" />
                  {errors.firstName && <p className="text-red-500 text-[10px] mt-1">{errors.firstName.message}</p>}
                </div>
                <div>
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">Last Name</label>
                  <input type="text" {...register('lastName')} placeholder="e.g. Simmons" className="w-full py-2 px-3 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:border-[#ccd5ae]" />
                  {errors.lastName && <p className="text-red-500 text-[10px] mt-1">{errors.lastName.message}</p>}
                </div>
              </div>
            </div>

            {/* Account Number */}
            <div>
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">Account Number</label>
              <input type="text" {...register('accountNumber')} placeholder="e.g. 1234567890" className="w-full py-2 px-3 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:border-[#ccd5ae]" />
              {errors.accountNumber && <p className="text-red-500 text-[10px] mt-1">{errors.accountNumber.message}</p>}
            </div>
          </div>
          <div className="flex gap-2 justify-end pt-2">
            <button type="button" onClick={() => setShowDialog(false)} className="px-3.5 py-2 bg-neutral-100 hover:bg-neutral-200 text-xs font-bold rounded-xl cursor-pointer">Cancel</button>
            <button type="submit" disabled={isUpdatingBank} className="px-3.5 py-2 bg-[#ccd5ae] hover:bg-[#faedcd] text-neutral-950 text-xs font-bold rounded-xl cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
              {isUpdatingBank ? <><Hourglass size={14} /> Saving...</> : 'Save Changes'}
            </button>
          </div>
        </form>
      </Dialog>

      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
          <h3 className="font-bold text-sm text-neutral-900 uppercase tracking-wider">Bank Details</h3>
          <button onClick={() => { reset(); setShowDialog(true); }} className="px-3 py-1.5 bg-[#ccd5ae] hover:bg-[#faedcd] text-neutral-950 text-xs font-bold rounded-xl transition-all cursor-pointer inline-flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
            Configure Bank Account
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-xs">
          <div className="min-w-0">
            <span className="text-neutral-400 font-bold block mb-1">Bank Name</span>
            <p className="font-bold text-neutral-900 text-sm break-words">{b.bankName || 'Not configured'}</p>
          </div>
          <div className="min-w-0">
            <span className="text-neutral-400 font-bold block mb-1">Account Number</span>
            <p className="font-bold text-neutral-900 text-sm break-words">{b.accountNumber || 'Not configured'}</p>
          </div>
          <div className="col-span-2 sm:col-span-1 min-w-0">
            <span className="text-neutral-400 font-bold block mb-1">Account Name</span>
            <p className="font-bold text-neutral-900 text-sm break-words">{b.accountName || 'Not configured'}</p>
          </div>
        </div>
      </div>
    </>
  );
}
