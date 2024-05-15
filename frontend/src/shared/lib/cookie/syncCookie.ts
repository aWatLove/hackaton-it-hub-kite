import { NextPageContext } from 'next';
import { CookieService } from '@/shared/lib/cookie/CookieService';

export const syncCookies = (serverName: string, clientName: string, ctx?: NextPageContext) => {
    const serverCookie = CookieService.get(serverName, ctx);
    const clientCookie = CookieService.get(clientName, ctx);
    if (!serverCookie && !clientCookie) return;

    if (!serverCookie || serverCookie !== clientCookie) {
        CookieService.set(serverName, clientCookie!, { httpOnly: true, ...ctx });
    }

    if (!clientCookie) {
        CookieService.set(clientName, serverCookie!, ctx);
    }
};
