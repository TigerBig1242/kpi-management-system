import jwt from 'jsonwebtoken';

export const generateAccessToken = (payload: any) => {
    const access_token = process.env.ACCESS_TOKEN_SECRET;
    if(!access_token) {
        throw new Error("ACCESS_TOKEN_SECRET is not define in .env");
    }
    return jwt.sign(
        payload,
        access_token, { expiresIn: '10m'}
    );
}

export const generateRefreshToken = (payload: any) => {
    const refresh_token = process.env.REFRESH_TOKEN_SECRET;
    if(!refresh_token) {
        throw new Error("REFRESH is not define in .env");
    }
    return jwt.sign(
        payload,
        refresh_token, { expiresIn: '7d' }
    );
}