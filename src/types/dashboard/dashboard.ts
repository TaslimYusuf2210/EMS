// ─── Dashboard Page Types ────────────────────────────────────────────

export interface StatusDistribution {
  active: number;
  inactive: number;
  probation: number;
  onLeave: number;
  resigned: number;
  terminated: number;
}

export interface RecentEmployee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  department: string;
  position: string;
  employmentType: string;
  status: string;
  hireDate: string;
  photoUrl: string | null;
}

export interface DepartmentOverview {
  id: string;
  name: string;
  abbreviation: string;
  employeeCount: number;
  head: string;
}

export interface RecentActivity {
  id: string;
  action: string;
  timestamp: string;
  type: 'note' | 'document' | 'department' | 'department_edit' | 'employee' | 'employee_delete' | 'education' | 'salary';
}

export interface DashboardStats {
  totalEmployees: number;
  activeEmployees: number;
  inactiveEmployees: number;
  totalDepartments: number;
  newEmployeesThisMonth: number;
  statusDistribution: StatusDistribution;
  recentEmployees: RecentEmployee[];
  departmentOverview: DepartmentOverview[];
  recentActivity: RecentActivity[];
}
