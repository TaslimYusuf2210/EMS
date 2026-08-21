// ─── Department Domain Types ─────────────────────────────────────────

export interface  DepartmentPosition {
  id: string;
  title: string;
  description?: string;
  departmentId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Department {
  id: string;
  name: string;
  description: string;
  head: string;
  headId?: string | null;
  dateCreated: string;
  employeeCount: number;
  positions: DepartmentPosition[];
}

export interface DepartmentsResponse {
  departments: Department[];
}

export interface CreateDepartmentPayload {
  name: string;
  description: string;
  head?: string;
  headId?: string | null;
}

export interface UpdateDepartmentPayload {
  name?: string;
  description?: string;
  head?: string;
  headId?: string | null;
  positions?: DepartmentPosition[];
}

// ─── Single Department Response (GET /departments/:id) ──────────────

export interface DepartmentMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  position: string;
  status: string;
  hireDate: string;
  photoUrl?: string;
  professionalHeadshot?: string;
}

export interface SingleDepartmentData {
  department: Department;
  members: DepartmentMember[];
}

// ─── Create Department Positions Payload ────────────────────────────

export interface CreateDepartmentPositionItem {
  title: string;
  description?: string;
}

// ─── Department Positions Response (GET /departments/:id/positions) ─

export interface DepartmentPositionsData {
  positions: DepartmentPosition[];
}
