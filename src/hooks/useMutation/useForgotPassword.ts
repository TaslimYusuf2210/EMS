import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { forgotPassword, type ForgotPasswordPayload } from '../../services/auth';

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (payload: ForgotPasswordPayload) => forgotPassword(payload),
    onSuccess: (data) => {
      console.log('[ForgotPassword] Response:', data);
      toast.success('OTP has been sent to your email.');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to send OTP.');
    },
  });
};
