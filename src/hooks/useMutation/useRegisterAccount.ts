import { useMutation } from '@tanstack/react-query';
import { registerAccount } from '../../services/auth';
import { toast } from 'sonner';

export const useRegisterAccount = (options?: { onSuccess?: () => void }) => {
  return useMutation({
    mutationFn: registerAccount,
    onSuccess: () => {
      toast.success('Account created successfully!');
      options?.onSuccess?.();
    },
    onError: (error: any) => {
      toast.error(error?.message || 'An error occurred. Please try again.');
    },
  });
};
