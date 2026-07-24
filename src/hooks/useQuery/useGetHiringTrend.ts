import { useQuery } from '@tanstack/react-query';
import { getReportsHiringTrend } from '../../services/dashboard/report';

export const useGetHiringTrend = () => {
  return useQuery({
    queryKey: ['hiringTrend'],
    queryFn: getReportsHiringTrend,
    select: (res) => {
      const hiringData = res.data;
      if (!hiringData) return [];
      return hiringData.labels.map((label, i) => ({
        month: label,
        employees: hiringData.data[i] ?? 0,
      }));
    },
  });
};
