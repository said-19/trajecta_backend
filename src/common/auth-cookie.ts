import type { CookieOptions, Request, Response } from 'express';

export const AUTH_COOKIE = 'trajecta_token';
export const AUTH_COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

export function isProduction() {
  return process.env.NODE_ENV === 'production';
}

export function authCookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    secure: isProduction(),
    sameSite: 'lax',
    path: '/',
    maxAge: AUTH_COOKIE_MAX_AGE_MS,
  };
}

export function extractAuthToken(req: Request): string | undefined {
  const header = req.headers.authorization;
  if (typeof header === 'string' && header.startsWith('Bearer ')) {
    const bearer = header.slice(7).trim();
    if (bearer) return bearer;
  }

  const raw = req.headers.cookie;
  if (!raw) return undefined;

  for (const part of raw.split(';')) {
    const [key, ...rest] = part.trim().split('=');
    if (key === AUTH_COOKIE) {
      try {
        return decodeURIComponent(rest.join('='));
      } catch {
        return rest.join('=');
      }
    }
  }
  return undefined;
}

export function setAuthCookie(res: Response, token: string) {
  res.cookie(AUTH_COOKIE, token, authCookieOptions());
}

export function clearAuthCookie(res: Response) {
  res.cookie(AUTH_COOKIE, '', { ...authCookieOptions(), maxAge: 0 });
}
