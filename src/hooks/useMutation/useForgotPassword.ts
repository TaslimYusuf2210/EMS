import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { forgotPassword, type ForgotPasswordPayload } from '../../services/auth';

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (payload: ForgotPasswordPayload) => forgotPassword(payload),
    onSuccess: () => {
      toast.success('Password reset link sent to your email.');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to send reset link.');
    },
  });
};
