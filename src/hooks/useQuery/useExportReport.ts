import { useQuery } from '@tanstack/react-query';
import { exportReport } from '../../services/dashboard/report';

export const useExportReport = (format: 'csv' | 'pdf' = 'csv') => {
  return useQuery({
    queryKey: ['exportReport', format],
    queryFn: () => exportReport(format),
    enabled: false,
    refetchOnWindowFocus: false,
  });
};
