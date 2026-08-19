import { request } from '../api';
import type { EmployeesResponse, SingleEmployeeResponse, EmployeeQueryParams, CreateEmployeePayload, UpdateEmployeePayload, Education, UpdateSalaryPayload, EmployeeBankAccount } from '../../types/dashboard/employee';

export const getEmployees = (params?: EmployeeQueryParams) =>
  request<EmployeesResponse>('/employees', {
    method: 'GET',
    params: params as Record<string, unknown>,
  });

export const getEmployeeById = (id: string) =>
  request<SingleEmployeeResponse>(`/employees/${id}`, {
    method: 'GET',
  });

export const createEmployee = (payload: CreateEmployeePayload) =>
  request<any>('/employees', {
    method: 'POST',
    data: payload,
  });

export const deleteEmployee = (id: string) =>
  request<any>(`/employees/${id}`, {
    method: 'DELETE',
  });

export const addEmployeeEducation = (id: string, payload: Omit<Education, 'id'>) =>
  request<any>(`/employees/${id}/education`, {
    method: 'POST',
    data: payload,
  });

export const updateEmployee = (id: string, payload: UpdateEmployeePayload) =>
  request<any>(`/employees/${id}`, {
    method: 'PUT',
    data: payload,
  });

export const updateEmployeeSalary = (id: string, payload: UpdateSalaryPayload) =>
  request<any>(`/employees/${id}/salary`, {
    method: 'PUT',
    data: payload,
  });

export const updateEmployeeBank = (id: string, payload: EmployeeBankAccount) => 
  request<any>(`/employees/${id}/bank`, {
    method: 'PUT',
    data: payload,
  });

export const addEmployeeDocument = (id: string, formData: FormData) =>
  request<any>(`/employees/${id}/documents`, {
    method: 'POST',
    data: formData,
  });

export const deleteEmployeeDocument = (employeeId: string, documentId: string) =>
  request<any>(`/employees/${employeeId}/documents/${documentId}`, {
    method: 'DELETE',
  });

export type AddNotePayload = { title: string; text: string };

export const addNote = (employeeId: string, payload: AddNotePayload) =>
  request<any>(`/employees/${employeeId}/notes`, {
    method: 'POST',
    data: payload,
  });

export const deleteNote = (employeeId: string, noteId: string) =>
  request<any>(`/employees/${employeeId}/notes/${noteId}`, {
    method: 'DELETE',
  });