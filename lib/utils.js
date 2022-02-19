import JWT from 'jsonwebtoken';

export function decodeToken(token) {
    return JWT.verify(token, process.env.JWT_SECRET);
}