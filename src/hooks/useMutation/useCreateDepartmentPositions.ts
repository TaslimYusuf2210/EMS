import {useMutation, useQueryClient} from '@tanstack/react-query';
import {toast} from 'sonner';
import {createDepartmentPositions} from '../../services/dashboard/department';
import type { CreateDepartmentPositionItem } from '@/types/dashboard/department';

export const useCreateDepartmentPositions = (departmentId: string, options?: { onSuccess?: () => void }) => {
  const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (payload: CreateDepartmentPositionItem) => createDepartmentPositions(departmentId, payload),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['departmentPositions', departmentId] });
        options?.onSuccess?.();
        toast.success('Department position(s) created successfully!');
      },
      onError: () => {
        toast.error('Failed to create department position(s). Please try again.');
      }
    });
};