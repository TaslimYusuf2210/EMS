import { useFormContext } from 'react-hook-form';
import type { RegisterFormValues } from '../../schemas/registerSchema';

export function EmailStep() {
  const { register, formState: { errors } } = useFormContext<RegisterFormValues>();
  return (
    <div className="relative group">
      <input
        type="email" id="email" placeholder="" {...register('email')}
        className={`peer w-full py-3 px-4 border-b-2 text-slate-800 placeholder-transparent focus:outline-none transition-all duration-200 ${
          errors.email ? 'border-red-400 focus:border-red-500' : 'border-slate-200 focus:border-indigo-600'
        }`}
      />
      <label htmlFor="email" className="absolute left-4 -top-2.5 text-xs text-slate-500 transition-all duration-200 peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-indigo-600">
        Email Address
      </label>
      {errors.email && <p className="text-red-500 text-xs mt-1 font-medium">{errors.email.message}</p>}
    </div>
  );
}
