export interface AuthToken {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
}

/** Build from an API JSON response (login/register/refresh). */
export function authTokenFromJson(json: Record<string, unknown>): AuthToken {
  const expiresIn = typeof json.expiresIn === 'number' ? json.expiresIn : 3600;
  const expiresAt = new Date(Date.now() + expiresIn * 1000).toISOString();
  return {
    accessToken: json.accessToken as string,
    refreshToken: json.refreshToken as string,
    expiresAt,
  };
}

/** True when the access token has expired, with a 60-second buffer — matches Flutter. */
export function isTokenExpired(token: AuthToken): boolean {
  const expiryWithBuffer = new Date(token.expiresAt).getTime() - 60_000;
  return Date.now() > expiryWithBuffer;
}

export interface User {
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
  premium?: boolean;
  profilePictureUrl?: string;
}

export function userFromJson(json: Record<string, unknown>): User {
  return {
    id: json.id as string | undefined,
    name: json.name as string | undefined,
    email: json.email as string | undefined,
    phone: json.phone as string | undefined,
    premium: json.premium as boolean | undefined,
    profilePictureUrl: json.profilePictureUrl as string | undefined,
  };
}