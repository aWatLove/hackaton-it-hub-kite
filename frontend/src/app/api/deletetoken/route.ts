import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { setContext } from '@/shared/lib/axios/instance';

export const DELETE = async (req: NextRequest, res: NextResponse) => {
    try {
        // res.cookies.delete('token');
        cookies().delete('token');
        // CookieService.delete('token');
        //@ts-ignore
        setContext({ cookie: undefined });
        return NextResponse.json({ message: 'token deleted' }, { status: 200 });
    } catch (e) {
        return NextResponse.json({ message: "token wasn't delete" }, { status: 404 });
    }
};
