import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import type { RegisterFormValues } from '../../schemas/registerSchema';
import { PasswordStrength } from '../PasswordStrength';

export function PasswordStep() {
  const { register, formState: { errors }, watch } = useFormContext<RegisterFormValues>();
  const passwordValue = watch('password') ?? '';
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const EyeIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );

  const EyeOffIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  );

  return (
    <div className="space-y-6">
      <div className="relative group">
        <input type={showPassword ? 'text' : 'password'} id="password" placeholder="" {...register('password')}
          className={`peer w-full py-3 px-10 border-b-2 text-slate-800 placeholder-transparent focus:outline-none transition-all duration-200 ${
            errors.password ? 'border-red-400 focus:border-red-500' : 'border-slate-200 focus:border-indigo-600'
          }`}
        />
        <label htmlFor="password" className="absolute left-4 -top-2.5 text-xs text-slate-500 transition-all duration-200 peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-indigo-600">
          Password
        </label>
        <button type="button" onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
        >
          {showPassword ? <EyeOffIcon /> : <EyeIcon />}
        </button>
        {errors.password && <p className="text-red-500 text-xs mt-1 font-medium">{errors.password.message}</p>}
        <PasswordStrength value={passwordValue} />
      </div>
      <div className="relative group">
        <input type={showConfirm ? 'text' : 'password'} id="confirmPassword" placeholder="" {...register('confirmPassword')}
          className={`peer w-full py-3 px-10 border-b-2 text-slate-800 placeholder-transparent focus:outline-none transition-all duration-200 ${
            errors.confirmPassword ? 'border-red-400 focus:border-red-500' : 'border-slate-200 focus:border-indigo-600'
          }`}
        />
        <label htmlFor="confirmPassword" className="absolute left-4 -top-2.5 text-xs text-slate-500 transition-all duration-200 peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-indigo-600">
          Confirm Password
        </label>
        <button type="button" onClick={() => setShowConfirm(!showConfirm)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
        >
          {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
        </button>
        {errors.confirmPassword && <p className="text-red-500 text-xs mt-1 font-medium">{errors.confirmPassword.message}</p>}
      </div>
    </div>
  );
}
