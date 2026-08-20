import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import workTimeSvg from '../../assets/work_time.svg';
import { Hourglass } from 'ldrs/react'
import 'ldrs/react/Hourglass.css'
import { useForgotPassword } from '../../hooks/useMutation/useForgotPassword';

const forgotSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
});

type ForgotFormValues = z.infer<typeof forgotSchema>;

export default function ForgotPassword() {
  const navigate = useNavigate();
  const { mutateAsync: sendResetLink, isPending, isSuccess } = useForgotPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotFormValues>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (data: ForgotFormValues) => {
    await sendResetLink({ email: data.email });
    navigate('/reset-password', { state: { email: data.email } });
  };

  return (
    <div className="flex h-screen">

      {/* Left column: SVG Illustration */}
      <div className="hidden md:flex w-1/2 bg-indigo-50/50 p-8 md:pr-16 flex-col items-center justify-center relative overflow-hidden border-r border-slate-100">
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
          <h3 className="font-semibold text-slate-800 text-lg">Password Recovery</h3>
          <p className="text-slate-500 text-sm mt-1 max-w-xs mx-auto">
            Enter your email and we'll send you a reset link.
          </p>
        </div>
      </div>

      {/* Right column: Form */}
      <div className="w-full md:w-1/2 p-8 md:py-12 md:pr-12 md:pl-20 flex flex-col justify-center">
        <div className="my-auto">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Forgot password?</h2>
          <p className="text-slate-500 text-sm mb-8">No worries, we'll send you reset instructions.</p>

          {isSuccess ? (
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-bold text-green-800 text-sm">Check your email</h3>
                <p className="text-green-600 text-xs mt-1">We've sent an OTP to your email address.</p>
              </div>
              <Link
                to="/reset-password"
                className="block w-full text-center py-3 bg-[#ccd5ae] hover:bg-[#faedcd] text-neutral-950 font-bold rounded-xl transition-all text-sm"
              >
                Reset Password
              </Link>
              <div className="text-center">
                <Link
                  to="/login"
                  className="text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
                >
                  ← Back to Login
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="relative group">
                <input
                  type="email"
                  id="email"
                  placeholder=""
                  {...register('email')}
                  className={`peer w-full py-3 px-4 border-b-2 text-slate-800 placeholder-transparent focus:outline-none transition-all duration-200 ${
                    errors.email
                      ? 'border-red-400 focus:border-red-500'
                      : 'border-slate-200 focus:border-indigo-600'
                  }`}
                />
                <label
                  htmlFor="email"
                  className="absolute left-4 -top-2.5 text-xs text-slate-500 transition-all duration-200 peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-indigo-600"
                >
                  Email Address
                </label>
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1 font-medium">{errors.email.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full py-3 bg-[#ccd5ae] hover:bg-[#faedcd] text-neutral-950 font-bold rounded-xl transition-all text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isPending ? (
                  <><Hourglass size={16} /> Sending...</>
                ) : (
                  'Send Reset Link'
                )}
              </button>

              <div className="text-center">
                <Link
                  to="/login"
                  className="text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
                >
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
