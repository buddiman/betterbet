import jwt_decode from 'jwt-decode';

export function getUserIdFromJwtToken(token: string) {
    const decodedToken: { userId: string } = jwt_decode(token);
    return parseInt(decodedToken.userId)
}