// ─── Auth Types ──────────────────────────────────────────────────────

export interface LoginPayload {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterPayload {
  companyName: string;
  email: string;
  description: string;
  phone: string;
  address: {
    state: string;
    lga: string;
    settlement: string;
    street: string;
  };
  password: string;
  agreeTerms: boolean;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  profilePicture?: string;
}

export interface LoginResponse {
  token: string;
  expiresIn: number;
  user: AuthUser;
}

export interface SendOtpPayload {
  email: string;
}

export interface VerifyOtpPayload {
  email: string;
  otp: string;
}

export interface RegisterResponse {
  token: string;
  user: AuthUser;
  company: {
    id: string;
    name: string;
    description: string;
  };
}

export interface CompanyAddress {
  state: string;
  lga: string;
  settlement: string;
  street: string;
}

export interface CompanyInfo {
  id: string;
  name: string;
  email: string | null;
  phoneNumber: string | null;
  address: CompanyAddress | null;
  description: string | null;
}

export interface CurrentUserResponse {
  company: CompanyInfo | null;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface ResetPasswordPayload {
  email: string;
  newPassword: string;
  otp: string;
}