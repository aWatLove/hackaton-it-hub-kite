import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { setContext } from '@/shared/lib/axios/instance';

// Define the POST handler for the file upload
export const POST = async (req: NextRequest, res: NextResponse) => {
    const body = await req.formData();
    //@ts-ignore
    const token = body.get('token') as string;
    setContext({ token, cookie: cookies() });
    cookies().set('token', token);
    const response = NextResponse.json({
        token: token,
    });
    response.cookies.set('token', token);
    return response;
};
