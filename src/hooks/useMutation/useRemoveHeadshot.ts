import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { removeEmployeeHeadshot } from '../../services/dashboard/employee';

export const useRemoveHeadshot = (employeeId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => removeEmployeeHeadshot(employeeId),
    onSuccess: () => {
      toast.success('Professional headshot removed.');
      queryClient.invalidateQueries({ queryKey: ['employee', employeeId] });
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to remove headshot.');
    },
  });
};
