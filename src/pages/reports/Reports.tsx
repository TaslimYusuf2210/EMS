import { useState } from 'react';
import { toast } from 'sonner';
import { useApp } from '../../context/AppContext';
import { EmployeeMetrics } from './components/EmployeeMetrics';
import { SalaryMetrics } from './components/SalaryMetrics';
import { HiringTrend } from './components/HiringTrend';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000/api';

export default function Reports() {
  const { employees, departments } = useApp();
  const [exportingFormat, setExportingFormat] = useState<'csv' | 'pdf' | null>(null);

  const handleExport = async (format: 'csv' | 'pdf') => {
    setExportingFormat(format);
    try {
      const token = localStorage.getItem('token') ?? sessionStorage.getItem('token');
      const res = await fetch(`${API_BASE}/reports/export?format=${format}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Export failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `staffsync-report.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success(`${format.toUpperCase()} report downloaded.`);
    } catch (err) {
      console.error('[Export] Failed:', err);
      toast.error('Export failed. Please try again.');
    } finally {
      setExportingFormat(null);
    }
  };

  return (
    <div className='space-y-6'>
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
        <div>
          <h1 className='text-3xl font-extrabold text-neutral-900 tracking-tight'>Reports</h1>
          <p className='text-sm text-neutral-500 mt-1'>Analytical overview of workforce and payroll metrics.</p>
        </div>
        <div className='flex gap-2 shrink-0'>
          <button
            onClick={() => handleExport('csv')}
            disabled={exportingFormat !== null}
            className='px-3 py-2 bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 rounded-xl text-xs font-bold text-neutral-700 transition-all cursor-pointer disabled:opacity-50'
          >
            {exportingFormat === 'csv' ? 'Exporting...' : 'Export CSV'}
          </button>
          <button
            onClick={() => handleExport('pdf')}
            disabled={exportingFormat !== null}
            className='px-3 py-2 bg-[#ccd5ae] hover:bg-[#faedcd] text-neutral-950 rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-50'
          >
            {exportingFormat === 'pdf' ? 'Exporting...' : 'Export PDF'}
          </button>
        </div>
      </div>

      <EmployeeMetrics employees={employees} departments={departments} />
      <SalaryMetrics />
      <HiringTrend />
    </div>
  );
}
