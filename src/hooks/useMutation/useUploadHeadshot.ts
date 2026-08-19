import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { uploadEmployeeHeadshot } from '../../services/dashboard/employee';

export const useUploadHeadshot = (employeeId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => uploadEmployeeHeadshot(employeeId, formData),
    onSuccess: () => {
      toast.success('Professional headshot updated!');
      queryClient.invalidateQueries({ queryKey: ['employee', employeeId] });
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to upload headshot.');
    },
  });
};
