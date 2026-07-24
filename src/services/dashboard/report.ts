import { request } from '../api';
import type { SalarySummary, EmployeeCountResponse, HiringTrendResponse } from '../../types/dashboard/report';

export const getSalarySummary = () =>
  request<SalarySummary>('/reports/salary-summary', {
    method: 'GET',
  });

export const getEmployeeCount = () =>
  request<EmployeeCountResponse>('/departments/employee-count', {
    method: 'GET',
  });

export const getReportsHiringTrend = () =>
  request<HiringTrendResponse>('/reports/hiring-trend', {
    method: 'GET',
  });

export const exportReport = (format: 'csv' | 'pdf' = 'csv') =>
  request<any>('/reports/export', {
    method: 'GET',
    params: { format },
  });
