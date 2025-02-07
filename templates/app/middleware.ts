import NextAuth from 'next-auth';
import authConfig from '@/auth.config';
import { NextResponse } from 'next/server';

const { auth: middleware } = NextAuth(authConfig);

const publicRoutes = ['/auth/login', '/auth/register', '/'];

export default middleware((req) => {
  const { nextUrl, auth } = req;
  const isLoggedIn = !!auth?.user;
  const url = req.nextUrl.clone();

  if (!publicRoutes.includes(nextUrl.pathname) && !isLoggedIn) {
    url.pathname = '/auth/login';
    url.searchParams.set('callbackUrl', req.nextUrl.pathname);
    return NextResponse.redirect(url);
    // return NextResponse.redirect(new URL('/auth/login', nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
