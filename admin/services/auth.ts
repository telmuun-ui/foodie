import { apiFetch } from "@/lib/api";

const COOKIE_NAME = "auth_token";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

const setAuthCookie = (token: string): void => {
  document.cookie = `${COOKIE_NAME}=${token}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
};

const clearAuthCookie = (): void => {
  document.cookie = `${COOKIE_NAME}=; path=/; max-age=0`;
};

const persistAuth = (token: string): void => {
  localStorage.setItem("accessToken", token);
  setAuthCookie(token);
};

export const login = async (payload: AuthPayload): Promise<AuthResponse> => {
  const data = await apiFetch<AuthResponse>("/api/auth/signin", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (data.accessToken) persistAuth(data.accessToken);

  return data;
};

export const signup = async (payload: SignupPayload): Promise<SignupResponse> => {
  return apiFetch<SignupResponse>("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const verifyEmail = async (payload: {
  userId: string;
  otp: string;
}): Promise<AuthResponse> => {
  const data = await apiFetch<AuthResponse>("/api/auth/verify-email", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (data.accessToken) persistAuth(data.accessToken);

  return data;
};

export const logout = (): void => {
  localStorage.removeItem("accessToken");
  clearAuthCookie();
};
