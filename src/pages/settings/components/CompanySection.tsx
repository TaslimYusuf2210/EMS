import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useGetCurrentUser } from '../../../hooks/useQuery/useGetCurrentUser';
import { statesAndLgas } from '@/constants/NigeriaGeo';
import { Hourglass } from 'ldrs/react'
import 'ldrs/react/Hourglass.css'
import { useUpdateSettings } from '../../../hooks/useMutation/useUpdateSettings';

const states: string[] = Object.keys(statesAndLgas).sort();

const phoneRegex = /^\+234(?:70[1-9]|80[2-9]|81[0-8]|90[1-9]|91[1-356]|702[5-9])\d{7}$/;

const companySchema = z.object({
  companyName: z.string().min(2, { message: 'Company name must be at least 2 characters' }),
  companyEmail: z.string().email({ message: 'Please enter a valid email address' }),
  companyPhone: z.string().regex(phoneRegex, { message: 'Please enter a valid Nigerian phone number' }),
  companyDescription: z.string().min(1, { message: 'Please select a company description / type' }),
  companyState: z.string().min(1, { message: 'Please select your state' }),
  companyLga: z.string().min(1, { message: 'Please select your LGA' }),
  companySettlement: z.string().min(1, { message: 'Please enter your settlement' }),
  companyStreet: z.string().min(1, { message: 'Please enter your street address' }),
});

type CompanyFormValues = z.infer<typeof companySchema>;

function formatPhone(phone: string | undefined | null): string {
  if (!phone) return '';
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('234')) return `+234${digits.slice(3)}`;
  if (digits.startsWith('0')) return `+234${digits.slice(1)}`;
  return phone.startsWith('+') ? phone : `+234${digits}`;
}

export default function CompanySection() {
  const { mutateAsync: updateSettingsMutation, isPending: isUpdatingSettings } = useUpdateSettings();
  const { data: currentUser } = useGetCurrentUser();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CompanyFormValues>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      companyName: currentUser?.data?.company?.name ?? '',
      companyEmail: currentUser?.data?.company?.email ?? '',
      companyPhone: formatPhone(currentUser?.data?.company?.phoneNumber),
      companyDescription: currentUser?.data?.company?.description ?? '',
      companyState: currentUser?.data?.company?.address?.state ?? '',
      companyLga:  currentUser?.data?.company?.address?.lga ?? '',
      companySettlement: currentUser?.data?.company?.address?.settlement ?? '',
      companyStreet: currentUser?.data?.company?.address?.street ?? '',
    },
  });

  const selectedState = watch('companyState');
  const lgas: string[] = selectedState ? (statesAndLgas[selectedState] ?? []) : [];
  const phoneValue = watch('companyPhone');

  const onSubmit = async (data: CompanyFormValues) => {
    const payload = {
      companyName: data.companyName,
      email: data.companyEmail,
      phoneNumber: data.companyPhone,
      description: data.companyDescription,
      address: {
        state: data.companyState,
        lga: data.companyLga,
        settlement: data.companySettlement,
        street: data.companyStreet,
      },
    };
    await updateSettingsMutation(payload);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <h3 className="font-extrabold text-sm text-neutral-900 uppercase tracking-wider border-b border-neutral-100 pb-3">
        Company Information
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
            Company Name
          </label>
          <input
            type="text"
            {...register('companyName')}
            className="w-full py-2.5 px-3.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-[#ccd5ae]"
          />
          {errors.companyName && (
            <p className="text-red-500 text-[10px] mt-1">{errors.companyName.message}</p>
          )}
        </div>
        <div>
          <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
            Company Email
          </label>
          <input
            type="email"
            {...register('companyEmail')}
            className="w-full py-2.5 px-3.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-[#ccd5ae]"
          />
          {errors.companyEmail && (
            <p className="text-red-500 text-[10px] mt-1">{errors.companyEmail.message}</p>
          )}
        </div>
        <div>
          <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
            Phone Number
          </label>
          <div className="flex items-center border border-neutral-200 rounded-xl focus-within:border-[#ccd5ae] transition-colors">
            <span className="pl-3.5 py-2.5 text-sm text-neutral-500 font-medium select-none">+234</span>
            <input
              type="text"
              placeholder="812 988 7896"
              className="flex-1 py-2.5 pr-3.5 border-0 focus:outline-none text-sm bg-transparent rounded-r-xl"
              maxLength={10}
              value={(phoneValue || '').replace('+234', '')}
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
                setValue('companyPhone', `+234${digits}`, { shouldValidate: true });
              }}
            />
          </div>
          {errors.companyPhone && (
            <p className="text-red-500 text-[10px] mt-1">{errors.companyPhone.message}</p>
          )}
        </div>
        <div>
          <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
            <span className="sm:hidden">Organization Type</span>
            <span className="hidden sm:inline">Description / Organization Type</span>
          </label>
          <select
            {...register('companyDescription')}
            className="w-full py-2.5 px-3.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-[#ccd5ae] bg-white cursor-pointer"
          >
            <option value="">Select type</option>
            <option value="Corporate Headquarters">Corporate Headquarters</option>
            <option value="Branch Office">Branch Office</option>
            <option value="Regional Office">Regional Office</option>
            <option value="Startup">Startup</option>
            <option value="Small & Medium Enterprise (SME)">Small & Medium Enterprise (SME)</option>
            <option value="Large Enterprise">Large Enterprise</option>
            <option value="Multinational Company">Multinational Company</option>
            <option value="Government Agency">Government Agency</option>
            <option value="Non-Profit Organization">Non-Profit Organization</option>
            <option value="Educational Institution">Educational Institution</option>
            <option value="Healthcare Facility">Healthcare Facility</option>
            <option value="Remote / Distributed Team">Remote / Distributed Team</option>
            <option value="Agency / Consulting Firm">Agency / Consulting Firm</option>
            <option value="Manufacturing Plant">Manufacturing Plant</option>
            <option value="Retail Chain">Retail Chain</option>
            <option value="Other">Other</option>
          </select>
          {errors.companyDescription && (
            <p className="text-red-500 text-[10px] mt-1">{errors.companyDescription.message}</p>
          )}
        </div>
      </div>

      {/* ─── Address Section ──────────────────────────────────────── */}
      <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider pt-2">Address</p>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
            State
          </label>
          <select
            {...register('companyState', { onChange: () => setValue('companyLga', '') })}
            className="w-full py-2.5 px-3.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-[#ccd5ae] bg-white cursor-pointer"
          >
            <option value=""></option>
            {states.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          {errors.companyState && (
            <p className="text-red-500 text-[10px] mt-1">{errors.companyState.message}</p>
          )}
        </div>
        <div>
          <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
            LGA
          </label>
          <select
            {...register('companyLga')}
            className="w-full py-2.5 px-3.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-[#ccd5ae] bg-white cursor-pointer"
          >
            <option value=""></option>
            {lgas.map((l: string) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
          {errors.companyLga && (
            <p className="text-red-500 text-[10px] mt-1">{errors.companyLga.message}</p>
          )}
        </div>
        <div>
          <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
            Settlement / District
          </label>
          <input
            type="text"
            {...register('companySettlement')}
            placeholder="Wuse 2"
            className="w-full py-2.5 px-3.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-[#ccd5ae]"
          />
          {errors.companySettlement && (
            <p className="text-red-500 text-[10px] mt-1">{errors.companySettlement.message}</p>
          )}
        </div>
        <div className="col-span-2">
          <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
            Street Address
          </label>
          <input
            type="text"
            {...register('companyStreet')}
            placeholder="42 Michael Okpara Street, House 7"
            className="w-full py-2.5 px-3.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-[#ccd5ae]"
          />
          {errors.companyStreet && (
            <p className="text-red-500 text-[10px] mt-1">{errors.companyStreet.message}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-neutral-100">
        <button
          disabled={isUpdatingSettings}
          type="submit"
          className="px-4 py-2 bg-[#ccd5ae] hover:bg-[#faedcd] text-neutral-950 text-sm font-bold rounded-xl transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isUpdatingSettings ? (
            <>
              <Hourglass size={16} /> Updating...
            </>
          ) : (
            'Save Company'
          )}
        </button>
      </div>
    </form>
  );
}
