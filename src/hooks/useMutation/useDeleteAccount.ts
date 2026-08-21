import { useMutation } from '@tanstack/react-query';
import { deleteAccount } from '../../services/auth';
import { toast } from 'sonner';

export const useDeleteAccount = () => {
  return useMutation({
    mutationFn: (payload: { password: string }) => deleteAccount(payload),
    onSuccess: () => {
      toast.success('Account deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'An error occurred. Please try again.');
    },
  });
};
