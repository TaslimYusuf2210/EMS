import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { resetPassword } from '../../services/auth';
import type { ResetPasswordPayload } from '../../types/auth';

export const useResetPassword = () => {
  return useMutation({
    mutationFn: (payload: ResetPasswordPayload) => resetPassword(payload),
    onSuccess: () => {
      toast.success('Password reset successfully. You can now log in.');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to reset password.');
    },
  });
};
