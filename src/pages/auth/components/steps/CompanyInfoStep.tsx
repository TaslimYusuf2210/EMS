import { useFormContext } from 'react-hook-form';
import type { RegisterFormValues } from '../../schemas/registerSchema';
import { statesAndLgas } from '@/constants/NigeriaGeo';

const states = Object.keys(statesAndLgas).sort();

export function CompanyInfoStep() {
  const { register, watch, setValue, formState: { errors } } = useFormContext<RegisterFormValues>();
  const selectedState = watch('state');
  const lgas = selectedState ? (statesAndLgas[selectedState] ?? []) : [];
  const { onChange: stateOnChange, ...stateRest } = register('state');

  return (
    <div className="space-y-6">
      <div className="relative group">
        <input type="text" id="companyName" placeholder="" {...register('companyName')}
          className={`peer w-full py-3 px-4 border-b-2 text-slate-800 placeholder-transparent focus:outline-none transition-all duration-200 ${
            errors.companyName ? 'border-red-400 focus:border-red-500' : 'border-slate-200 focus:border-indigo-600'
          }`}
        />
        <label htmlFor="companyName" className="absolute left-4 -top-2.5 text-xs text-slate-500 transition-all duration-200 peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-indigo-600">
          Company Name
        </label>
        {errors.companyName && <p className="text-red-500 text-xs mt-1 font-medium">{errors.companyName.message}</p>}
      </div>
      <div className="relative group">
        <select id="description" {...register('description')}
          className={`w-full py-3 px-4 border-b-2 text-slate-800 focus:outline-none transition-all duration-200 bg-transparent cursor-pointer ${
            errors.description ? 'border-red-400 focus:border-red-500' : 'border-slate-200 focus:border-indigo-600'
          }`}
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
        </select>
        <label htmlFor="description" className="absolute left-4 -top-2.5 text-xs text-slate-500 transition-all duration-200">
          Description / Organization Type
        </label>
        {errors.description && <p className="text-red-500 text-xs mt-1 font-medium">{errors.description.message}</p>}
      </div>
      <div className="relative group">
        <div className={`flex items-center border-b-2 transition-all duration-200 ${
          errors.phoneNumber ? 'border-red-400' : 'border-slate-200 focus-within:border-indigo-600'
        }`}>
          <span className="text-slate-500 text-sm font-medium pl-4 pb-3 pt-3 select-none">+234</span>
          <input
            type="text"
            id="phoneNumber"
            placeholder="812 988 7896"
            className="flex-1 py-3 pr-4 border-0 text-slate-800 placeholder-slate-400 focus:outline-none bg-transparent text-sm"
            maxLength={10}
            value={(watch('phoneNumber') || '').replace('+234', '')}
            onChange={(e) => {
              const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
              setValue('phoneNumber', `+234${digits}`);
            }}
          />
        </div>
        <label htmlFor="phoneNumber" className="absolute left-4 -top-2.5 text-xs text-slate-500 transition-all duration-200">
          Phone Number
        </label>
        {errors.phoneNumber && <p className="text-red-500 text-xs mt-1 font-medium">{errors.phoneNumber.message}</p>}
      </div>

      {/* ─── Address Section ──────────────────────────────────────── */}
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider pt-2">Address</p>

      <div className="relative group">
        <select id="state" {...stateRest} onChange={(e) => { stateOnChange(e); setValue('lga', ''); }}
          className={`w-full py-3 px-4 border-b-2 text-slate-800 focus:outline-none transition-all duration-200 bg-transparent cursor-pointer ${
            errors.state ? 'border-red-400 focus:border-red-500' : 'border-slate-200 focus:border-indigo-600'
          }`}
        >
          <option value=""></option>
          {states.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <label htmlFor="state" className="absolute left-4 -top-2.5 text-xs text-slate-500 transition-all duration-200">
          State
        </label>
        {errors.state && <p className="text-red-500 text-xs mt-1 font-medium">{errors.state.message}</p>}
      </div>

      <div className="relative group">
        <select id="lga" {...register('lga')}
          className={`w-full py-3 px-4 border-b-2 text-slate-800 focus:outline-none transition-all duration-200 bg-transparent cursor-pointer ${
            errors.lga ? 'border-red-400 focus:border-red-500' : 'border-slate-200 focus:border-indigo-600'
          }`}
        >
          <option value=""></option>
          {lgas.map((l: string) => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>
        <label htmlFor="lga" className="absolute left-4 -top-2.5 text-xs text-slate-500 transition-all duration-200">
          LGA
        </label>
        {errors.lga && <p className="text-red-500 text-xs mt-1 font-medium">{errors.lga.message}</p>}
      </div>

      <div className="relative group">
        <input type="text" id="settlement" placeholder="Wuse 2" {...register('settlement')}
          className={`w-full py-3 px-4 border-b-2 text-slate-800 placeholder-slate-400 focus:outline-none transition-all duration-200 ${
            errors.settlement ? 'border-red-400 focus:border-red-500' : 'border-slate-200 focus:border-indigo-600'
          }`}
        />
        <label htmlFor="settlement" className="absolute left-4 -top-2.5 text-xs text-slate-500 transition-all duration-200">
          Settlement / District
        </label>
        {errors.settlement && <p className="text-red-500 text-xs mt-1 font-medium">{errors.settlement.message}</p>}
      </div>

      <div className="relative group">
        <input type="text" id="streetAddress" placeholder="42 Michael Okpara Street, House 7" {...register('streetAddress')}
          className={`w-full py-3 px-4 border-b-2 text-slate-800 placeholder-slate-400 focus:outline-none transition-all duration-200 ${
            errors.streetAddress ? 'border-red-400 focus:border-red-500' : 'border-slate-200 focus:border-indigo-600'
          }`}
        />
        <label htmlFor="streetAddress" className="absolute left-4 -top-2.5 text-xs text-slate-500 transition-all duration-200">
          Street Address
        </label>
        {errors.streetAddress && <p className="text-red-500 text-xs mt-1 font-medium">{errors.streetAddress.message}</p>}
      </div>
    </div>
  );
}
