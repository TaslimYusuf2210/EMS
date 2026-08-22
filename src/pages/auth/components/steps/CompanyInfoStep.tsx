import { useFormContext } from 'react-hook-form';
import type { RegisterFormValues } from '../../schemas/registerSchema';
import { statesAndLgas } from '@/constants/NigeriaGeo';
import { AuthInput, AuthSelect } from '../AuthInput';

const states = Object.keys(statesAndLgas).sort();

export function CompanyInfoStep() {
  const { register, watch, setValue, formState: { errors } } = useFormContext<RegisterFormValues>();
  const selectedState = watch('state');
  const lgas = selectedState ? (statesAndLgas[selectedState] ?? []) : [];
  const { onChange: stateOnChange, ...stateRest } = register('state');

  return (
    <div className="space-y-6">
      {/* ─── Company Section ─────────────────────────────────────── */}
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider pt-2">Company</p>

      <AuthInput
        type="text"
        label="Company Name"
        error={errors.companyName?.message}
        {...register('companyName')}
      />

      <AuthSelect
        label="Description / Organization Type"
        error={errors.description?.message}
        {...register('description')}
      >
        <option value="">Select Company Description</option>
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
      </AuthSelect>

      {/* Phone Number — outlined field with +234 prefix */}
      <div className="relative">
        <div className={`flex items-center rounded-xl border bg-transparent transition-colors duration-200 ${
          errors.phoneNumber ? 'border-red-400 focus-within:border-red-500' : 'border-slate-300 focus-within:border-brand-deep'
        }`}>
          <span className="text-slate-500 text-sm font-medium pl-4 pt-5 pb-2 select-none">+234</span>
          <input
            type="text"
            id="phoneNumber"
            placeholder="812 988 7896"
            className="flex-1 pt-5 pb-2 pr-4 border-0 text-slate-800 placeholder-slate-400 focus:outline-none bg-transparent text-sm"
            maxLength={10}
            value={(watch('phoneNumber') || '').replace('+234', '')}
            onChange={(e) => {
              const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
              setValue('phoneNumber', `+234${digits}`);
            }}
          />
        </div>
        <label htmlFor="phoneNumber" className="auth-label auth-label-top">
          Phone Number
        </label>
        {errors.phoneNumber && <p className="text-red-500 text-xs mt-1 font-medium">{errors.phoneNumber.message}</p>}
      </div>

      {/* ─── Address Section ──────────────────────────────────────── */}
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider pt-2">Address</p>

      <AuthSelect
        label="State"
        error={errors.state?.message}
        {...stateRest}
        onChange={(e) => { stateOnChange(e); setValue('lga', ''); }}
      >
        <option value=""></option>
        {states.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </AuthSelect>

      <AuthSelect
        label="LGA"
        error={errors.lga?.message}
        {...register('lga')}
      >
        <option value=""></option>
        {lgas.map((l: string) => (
          <option key={l} value={l}>{l}</option>
        ))}
      </AuthSelect>

      <AuthInput
        type="text"
        label="Settlement / District"
        error={errors.settlement?.message}
        {...register('settlement')}
      />

      <AuthInput
        type="text"
        label="Street Address"
        error={errors.streetAddress?.message}
        {...register('streetAddress')}
      />
    </div>
  );
}
