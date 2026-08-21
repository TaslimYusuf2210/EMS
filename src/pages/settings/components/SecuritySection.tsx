import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Hourglass } from 'ldrs/react'
import 'ldrs/react/Hourglass.css'
import { PasswordStrength } from '../../auth/components/PasswordStrength';
import { useChangePassword } from '../../../hooks/useMutation/useChangePassword';
import DeleteAccountSection from './DeleteAccountSection';

const securitySchema = z
  .object({
    currentPassword: z.string().min(1, { message: 'Current password is required' }),
    newPassword: z.string()
      .min(8, { message: 'Password must be at least 8 characters long' })
      .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
      .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
      .regex(/[0-9]/, { message: 'Password must contain at least one number' })
      .regex(/[^A-Za-z0-9]/, { message: 'Password must contain at least one special character' }),
    confirmPassword: z.string().min(1, { message: 'Please confirm your new password' }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type SecurityFormValues = z.infer<typeof securitySchema>;

export default function SecuritySection() {
    const { mutateAsync: changePasswordMutation, isPending: isChangingPassword } = useChangePassword({
      onSuccess: () => reset(),
    });
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<SecurityFormValues>({
    resolver: zodResolver(securitySchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = ({ currentPassword, newPassword }: SecurityFormValues) => {
    changePasswordMutation({ currentPassword, newPassword });
  };

  return (
    <>
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <h3 className="font-extrabold text-sm text-neutral-900 uppercase tracking-wider border-b border-neutral-100 pb-3">
        Change Password
      </h3>

      <div className="space-y-4 max-w-md">
        <div>
          <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
            Current Password
          </label>
          <input
            type="password"
            {...register('currentPassword')}
            className="w-full py-2.5 px-3.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-[#ccd5ae]"
          />
          {errors.currentPassword && (
            <p className="text-red-500 text-[10px] mt-1">{errors.currentPassword.message}</p>
          )}
        </div>
        <div>
          <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
            New Password
          </label>
          <input
            type="password"
            {...register('newPassword')}
            className="w-full py-2.5 px-3.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-[#ccd5ae]"
          />
          {errors.newPassword && (
            <p className="text-red-500 text-[10px] mt-1">{errors.newPassword.message}</p>
          )}
          <PasswordStrength value={watch('newPassword')} />
        </div>
        <div>
          <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
            Confirm New Password
          </label>
          <input
            type="password"
            {...register('confirmPassword')}
            className="w-full py-2.5 px-3.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-[#ccd5ae]"
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-[10px] mt-1">{errors.confirmPassword.message}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-neutral-100">
        <button
          disabled={isChangingPassword}
          type="submit"
          className="px-4 py-2 bg-[#ccd5ae] hover:bg-[#faedcd] text-neutral-950 text-sm font-bold rounded-xl transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isChangingPassword ? (
            <>
              <Hourglass size={16} /> Updating...
            </>
          ) : (
            'Update Password'
          )}
        </button>
      </div>
      </form>
      <DeleteAccountSection />
    </>
  );
}
