import cookie from 'cookie';

export function setCookie(key, value) {
    return cookie.serialize(key, value, {
        // expires: new Date() + (7 * 24 * 60 * 60 * 1000),
        maxAge: 60 * 60 * 24 * 7, // 1 week
        secure: process.env.ENVIRONMENT === 'production',
        path: '/'
    });


}

export function clearCookie(key) {
    return cookie.serialize(key, "", {
        maxAge: -1,
        path: "/",
    });
}