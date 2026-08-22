import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import workTimeSvg from '../../assets/work_time.svg';
import { Hourglass } from 'ldrs/react'
import 'ldrs/react/Hourglass.css'
import { useLogin } from '../../hooks/useMutation/useLogin';
import { AuthInput } from './components/AuthInput';

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: loginUser, isPending: isLoggingIn } = useLogin({
    onSuccess: () => {
      navigate('/dashboard', { replace: true });
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    loginUser({
      email: data.email,
      password: data.password,
      rememberMe: data.rememberMe,
    });
  };

  return (
    <div className="flex h-screen">

      {/* Left column: SVG Illustration */}
      <div className="hidden md:flex w-1/2 bg-indigo-50/50 p-8 md:pr-6 lg:pr-16 flex-col items-center justify-center relative overflow-hidden border-r border-slate-100">
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
            <h3 className="font-semibold text-slate-800 text-lg">Optimizing Workspace Dynamics</h3>
            <p className="text-slate-500 text-sm mt-1 max-w-xs mx-auto">
              Manage personnel schedules, tracks, and team metrics effortlessly.
            </p>
          </div>
        </div>

        {/* Right column: Form details */}
        <div className="w-full md:w-1/2 p-8 sm:p-4 md:py-12 md:pr-6 md:pl-10 lg:pr-12 lg:pl-20 flex flex-col sm:items-center justify-center">
          <div className="w-full sm:w-[75%] md:w-full sm:bg-white md:bg-transparent rounded-none sm:rounded-3xl md:rounded-none shadow-none sm:shadow-xl md:shadow-none px-0 sm:px-6 md:px-0 py-0 sm:py-10 md:py-0">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Hello,</h2>
            <h1 className="text-4xl font-extrabold text-indigo-950 tracking-tight mb-8">Welcome back</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Email Field */}
              <AuthInput
                type="email"
                label="Email Address"
                error={errors.email?.message}
                {...register('email')}
              />

              {/* Password Field */}
              <AuthInput
                type={showPassword ? 'text' : 'password'}
                label="Password"
                error={errors.password?.message}
                trailing={
                  showPassword ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )
                }
                trailingAction={() => setShowPassword(!showPassword)}
                {...register('password')}
              />

              {/* Remember me & Forgot password */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center text-slate-600 font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('rememberMe')}
                    className="w-4 h-4 rounded text-brand-deep border-slate-300 focus:ring-brand-deep mr-2"
                  />
                  Remember me
                </label>
                <Link to="/forgot-password" className="text-brand-deep hover:text-brand font-semibold hover:underline">
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoggingIn}
                className="btn-brand w-full py-3.5 px-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
              >
                {isLoggingIn ? <Hourglass size="18" color="white" /> : 'Login'}
              </button>
            </form>

            <div className="mt-8 text-center text-sm text-slate-600">
              Don't have an account?{' '}
              <Link to="/create-account" className="text-brand-deep hover:text-brand font-bold hover:underline">
                Click here
              </Link>
            </div>
          </div>

        </div>
    </div>
  );
}
