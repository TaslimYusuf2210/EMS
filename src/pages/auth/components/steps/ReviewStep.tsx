import { useFormContext } from 'react-hook-form';
import type { RegisterFormValues } from '../../schemas/registerSchema';

export function ReviewStep() {
  const { getValues, register, formState: { errors } } = useFormContext<RegisterFormValues>();
  const data = getValues();
  return (
    <div className="space-y-5">
      <div className="bg-slate-50 rounded-xl p-4 space-y-3 text-sm">
        <div>
          <span className="text-slate-400 text-xs font-medium">EMAIL</span>
          <p className="text-slate-800 font-medium">{data.email}</p>
        </div>
        <div className="border-t border-slate-200 pt-3">
          <span className="text-slate-400 text-xs font-medium">COMPANY</span>
          <p className="text-slate-800 font-medium">{data.companyName}</p>
          <p className="text-slate-500 text-xs">{data.description}</p>
          <p className="text-slate-500 text-xs mt-1">{data.phoneNumber}</p>
          <p className="text-slate-500 text-xs">{data.streetAddress}, {data.settlement}</p>
          <p className="text-slate-500 text-xs">{data.lga} LGA, {data.state}</p>
        </div>
      </div>
      <div className="flex flex-col gap-1 text-sm">
        <label className="flex items-center text-slate-600 font-medium cursor-pointer">
          <input type="checkbox" {...register('agreeTerms')}
            className="w-4 h-4 rounded text-brand-deep border-slate-300 focus:ring-brand-deep mr-2"
          />
          I agree to the Terms & Conditions
        </label>
        {errors.agreeTerms && <p className="text-red-500 text-xs font-medium">{errors.agreeTerms.message}</p>}
      </div>
    </div>
  );
}
