import { useFormContext } from 'react-hook-form';
import type { RegisterFormValues } from '../../schemas/registerSchema';

export function OtpStep() {
  const { register, formState: { errors }, getValues } = useFormContext<RegisterFormValues>();
  const email = getValues('email');

  return (
    <div className="space-y-6">
      <p className="text-xs text-slate-500 text-center">
        We've sent a 6-digit verification code to <span className="font-semibold text-slate-700">{email}</span>
      </p>
      <div className="relative group">
        <input
          type="text" id="otp" placeholder=""
          maxLength={6}
          autoComplete="one-time-code"
          {...register('otp')}
          className={`peer w-full text-center text-2xl tracking-[0.5em] py-3 px-4 border-b-2 text-slate-800 placeholder-transparent focus:outline-none transition-all duration-200 ${
            errors.otp ? 'border-red-400 focus:border-red-500' : 'border-slate-200 focus:border-indigo-600'
          }`}
        />
        <label htmlFor="otp" className="absolute left-4 -top-2.5 text-xs text-slate-500 transition-all duration-200 peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-indigo-600">
          Verification Code
        </label>
        {errors.otp && <p className="text-red-500 text-xs mt-1 font-medium text-center">{errors.otp.message}</p>}
      </div>
    </div>
  );
}
