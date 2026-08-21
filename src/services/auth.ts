import { request } from './api';
import type { CurrentUserResponse, LoginPayload, LoginResponse, RegisterPayload, RegisterResponse, SendOtpPayload, VerifyOtpPayload, ChangePasswordPayload, ResetPasswordPayload } from '../types/auth';

export const registerAccount = (payload: RegisterPayload) =>
  request<RegisterResponse>('/auth/register', {
    method: 'POST',
    data: payload,
  });

export const sendOtp = (payload: SendOtpPayload) =>
  request<{ message: string }>('/auth/send-otp', {
    method: 'POST',
    data: payload,
  });

export const verifyOtp = (payload: VerifyOtpPayload) =>
  request<{ message: string }>('/auth/verify-otp', {
    method: 'POST',
    data: payload,
  });

export const login = (payload: LoginPayload) =>
  request<LoginResponse>('/auth/login', {
    method: 'POST',
    data: payload,
  });

export const getCurrentUser = () =>
  request<CurrentUserResponse>('/auth/me', {
    method: 'GET',
  });

export const changePassword = (payload: ChangePasswordPayload) =>
  request<{ message: string }>('/auth/change-password', {
    method: 'PUT',
    data: payload,
});

export const deleteAccount = (payload: { password: string }) =>
  request<{ message: string }>('/auth/account', {
    method: 'DELETE',
    data: payload,
  });

export type ForgotPasswordPayload = { email: string };

export const forgotPassword = (payload: ForgotPasswordPayload) => 
   request<{ message: string }>('/auth/forgot-password', {
    method: 'POST',
    data: payload,
  });

export const resetPassword = (payload: ResetPasswordPayload ) =>
   request<any>('/auth/reset-password', {
    method: 'POST',
    data: payload,
  });
