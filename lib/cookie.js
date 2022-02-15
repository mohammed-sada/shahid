import cookie from 'cookie';

export function setCookie(key, value) {
    const setCookie = cookie.serialize(key, value, {
        // expires: new Date() + (7 * 24 * 60 * 60 * 1000),
        maxAge: 60 * 60 * 24 * 7, // 1 week
        secure: process.env.ENVIRONMENT === 'production',
        path: '/'
    });
    return setCookie;
}