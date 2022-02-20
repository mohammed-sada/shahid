import { NextResponse } from 'next/server';
import JWT from 'jsonwebtoken';

export function middleware(req, ev) {
  const token = req ? req.cookies?.token : null;
  const decodedToken = token
    ? JWT.verify(token, process.env.JWT_SECRET)
    : null;
  const { pathname } = req.nextUrl;

  console.log(pathname);
  if (pathname.includes('/api/login') || pathname === '/login' || decodedToken && decodedToken.issuer || pathname.includes('/static')) {
    return NextResponse.next();
  }

  return NextResponse.redirect('http://localhost:3000/login');

}
