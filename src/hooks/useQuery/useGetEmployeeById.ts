import { useQuery } from '@tanstack/react-query';
import { getEmployeeById } from '@/services/dashboard/employee';
import type { Employee } from '@/types/dashboard/employee';

export const useGetEmployeeById = (id: string | undefined) => {
  return useQuery({
    queryKey: ['employee', id],
    queryFn: () => getEmployeeById(id!),
    enabled: !!id,
    select: (res) => {
      if (!res.data?.employee) return undefined;
      return {
        ...res.data.employee,
        Salary: res.data.Salary ?? res.data.employee.Salary,
        BankAccount: res.data.BankAccount ?? res.data.employee.BankAccount,
        Education: res.data.Education ?? res.data.employee.Education,
        Documents: res.data.Documents ?? res.data.employee.Documents,
        Notes: res.data.Notes ?? res.data.employee.Notes,
      } as Employee;
    },
    refetchOnMount: true,
  });
}

export type UseGetEmployeeByIdData = Employee | undefined;