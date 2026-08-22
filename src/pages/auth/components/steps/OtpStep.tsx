import { useFormContext } from 'react-hook-form';
import type { RegisterFormValues } from '../../schemas/registerSchema';
import { AuthInput } from '../AuthInput';

export function OtpStep() {
  const { register, formState: { errors }, getValues } = useFormContext<RegisterFormValues>();
  const email = getValues('email');

  return (
    <div className="space-y-6">
      <p className="text-xs text-slate-500 text-center">
        We've sent a 6-digit verification code to <span className="font-semibold text-slate-700">{email}</span>
      </p>
      <AuthInput
        type="text"
        label="Verification Code"
        error={errors.otp?.message}
        maxLength={6}
        autoComplete="one-time-code"
        className="text-center tracking-[0.4em]"
        {...register('otp')}
      />
    </div>
  );
}
