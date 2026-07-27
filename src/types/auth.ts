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

export interface CompanyInfo {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  address: {
    state: string;
    lga: string;
    settlement: string;
    street: string;
  };
  description: string;
}

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  role: string;
  profilePicture: string;
  company: CompanyInfo;
}

export interface CurrentUserResponse {
  user: CurrentUser;
  company: CompanyInfo;
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