import { deleteCookie, getCookie, getCookies, setCookie } from 'cookies-next';
import type { IncomingMessage, ServerResponse } from 'http';
import type { NextRequest, NextResponse } from 'next/server';

export type CookieOptions = {
    expires: Date;
    maxAge: number; // in seconds
    secure: boolean;
    path: string;
    domain: string;
    sameSite: boolean | 'lax' | 'none' | 'strict';
    httpOnly: boolean;
};

type CookieObject =
    | {
          [key: string]: string;
      }
    | Partial<{
          [key: string]: string;
      }>;

type NextCookies = typeof import('next/headers').cookies;
type Ctx =
    | {
          req?: Request | NextRequest;
          res?: Response | NextResponse;
      }
    | {
          res?: ServerResponse;
          req?: IncomingMessage & {
              cookies?: CookieObject;
          };
      }
    | {
          cookies: NextCookies;
      };

const defaultOptions: Partial<CookieOptions> = {
    expires: new Date(new Date().getTime() + 60 * 60 * 24 * 365 * 1000), // a year
    secure: true,
    sameSite: 'lax',
};

/**
 * - Mind the default options.
 * - If value to be set is object, pass it as is.
 * - No need to apply uri decode/encode and json stringify, it may cause issues.
 * - httpOnly option is server-side only
 */
export class CookieService {
    static get(key: string, ctx?: Ctx): string | undefined {
        return getCookie(key, ctx);
    }

    static getAll(ctx?: Ctx): CookieObject {
        return getCookies(ctx);
    }

    static set(key: string, value: string, options?: Partial<CookieOptions> & Partial<Ctx>) {
        setCookie(key, value, { ...defaultOptions, ...options });
    }

    static delete(key: string, options?: Partial<Pick<CookieOptions, 'path' | 'domain'>> & Partial<Ctx>) {
        deleteCookie(key, options);
    }
}
