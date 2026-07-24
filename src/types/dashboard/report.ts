export interface SalaryByDepartment {
  department: string;
  averageSalary: number;
  totalPayroll: number;
  employeeCount: number;
}

export interface SalarySummary {
  totalMonthlyPayroll: number;
  averageCompensation: number;
  highestPaid: number;
  salaryDistributionByDepartment: SalaryByDepartment[];
}

export interface DepartmentEmployeeCount {
  department: string;
  employeeCount: number;
}

export interface EmployeeCountResponse {
  departments: DepartmentEmployeeCount[];
}

export interface HiringTrendResponse {
  labels: string[];
  data: number[];
}
