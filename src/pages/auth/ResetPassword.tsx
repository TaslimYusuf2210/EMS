import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import workTimeSvg from '../../assets/work_time.svg';
import { Hourglass } from 'ldrs/react'
import 'ldrs/react/Hourglass.css'
import { useResetPassword } from '../../hooks/useMutation/useResetPassword';
import { AuthInput } from './components/AuthInput';

const resetSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  otp: z.string().min(1, { message: 'OTP is required' }),
  newPassword: z.string().min(8, { message: 'Password must be at least 8 characters' }),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type ResetFormValues = z.infer<typeof resetSchema>;

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const emailFromState = (location.state as { email?: string })?.email ?? '';

  useEffect(() => {
    if (!emailFromState) {
      navigate('/forgot-password', { replace: true });
    }
  }, [emailFromState, navigate]);

  const [showPassword, setShowPassword] = useState(false);
  const { mutate: resetPassword, isPending, isSuccess } = useResetPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: { email: emailFromState, otp: '', newPassword: '', confirmPassword: '' },
  });

  if (!emailFromState) return null;

  const onSubmit = (data: ResetFormValues) => {
    resetPassword({
      email: data.email,
      otp: data.otp,
      newPassword: data.newPassword,
    });
  };

  return (
    <div className="flex h-screen">

      {/* Left column: SVG Illustration */}
      <div className="w-1/2 bg-indigo-50/50 p-8 md:pr-16 flex flex-col items-center justify-center relative overflow-hidden border-r border-slate-100">
        <div className="absolute top-8 left-8 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#faedcd] flex items-center justify-center text-neutral-950 font-bold text-lg">
            S
          </div>
          <span className="font-bold text-slate-800 text-lg tracking-tight">StaffSync</span>
        </div>

        <div className="w-full max-w-sm aspect-square flex items-center justify-center mt-8">
          <img
            src={workTimeSvg}
            alt="Work Time Illustration"
            className="w-full h-auto object-contain animate-fade-in hover:scale-105 transition-transform duration-500"
          />
        </div>

        <div className="mt-8 text-center hidden md:block">
          <h3 className="font-semibold text-slate-800 text-lg">Set New Password</h3>
          <p className="text-slate-500 text-sm mt-1 max-w-xs mx-auto">
            Enter the OTP sent to your email and choose a new password.
          </p>
        </div>
      </div>

      {/* Right column: Form */}
      <div className="w-1/2 p-8 md:py-12 md:pr-12 md:pl-20 flex flex-col justify-center">
        <div className="my-auto">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Reset password</h2>
          <p className="text-slate-500 text-sm mb-8">Enter the OTP from your email and a new password.</p>

          {isSuccess ? (
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-bold text-green-800 text-sm">Password reset successfully!</h3>
                <p className="text-green-600 text-xs mt-1">You can now log in with your new password.</p>
              </div>
              <button
                onClick={() => navigate('/login')}
                className="btn-brand w-full py-3 text-sm cursor-pointer"
              >
                Go to Login
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Email */}
              <AuthInput
                type="email"
                label="Email Address"
                readOnly
                className="auth-input-muted"
                {...register('email')}
              />

              {/* OTP */}
              <AuthInput
                type="text"
                label="OTP Code"
                error={errors.otp?.message}
                {...register('otp')}
              />

              {/* New Password */}
              <AuthInput
                type={showPassword ? 'text' : 'password'}
                label="New Password"
                error={errors.newPassword?.message}
                trailing={
                  showPassword ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  )
                }
                trailingAction={() => setShowPassword(!showPassword)}
                {...register('newPassword')}
              />

              {/* Confirm Password */}
              <AuthInput
                type={showPassword ? 'text' : 'password'}
                label="Confirm New Password"
                error={errors.confirmPassword?.message}
                {...register('confirmPassword')}
              />

              <button
                type="submit"
                disabled={isPending}
                className="btn-brand w-full py-3 text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
              >
                {isPending ? <><Hourglass size={16} color="white" /> Resetting...</> : 'Reset Password'}
              </button>

              <div className="text-center">
                <Link to="/login" className="text-sm text-brand-deep hover:text-brand font-medium transition-colors">
                  ← Back to Login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
