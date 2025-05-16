import { Request, Response, NextFunction } from 'express';
import { RequestHandler } from "express";
import registerUser from '../service/authService';
import { loginUser } from '../service/authService';
import jwt from 'jsonwebtoken';
import { isTokenValid, removeToken, saveToken } from '../../token.store';
import { generateAccessToken } from '../utils/token-utils';

// Register user function
export const register: RequestHandler = async(req: Request, res: Response) => {
    try {
        const user = await registerUser(req.body);
        res.status(201).json({
            "message": "Created successfully",
            "data": user
        });
    } catch (error) {
        console.error(error);
        // next(error);
        res.status(400).json({ message: "Email or Username is already" })   
    }
}

// Login user function
const ACCESS_TOKEN = process.env.ACCESS_TOKEN_SECRET
const REFRESH_TOKEN = process.env.REFRESH_TOKEN_SECRET
export const login = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;
        if(!email || !password) {
            res.status(400).json({ message: "Email and Password is require" });
            return;
        }
        const result = await loginUser(email, password)
        if(!result) {
            res.status(401).json({
                message: "Email or password invalid"
            });
            return;
        }

        // const { token, user } = result;
        const { user, accessToken, refreshToken } = result;

        saveToken(refreshToken);
        res.cookie("refresh_token", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'development',
            sameSite: 'strict',
            maxAge: 10 * 60 * 1000,
        });
        // res.cookie("token", token, {
        //     httpOnly: true,
        //     secure: process.env.NODE_ENV === 'development',
        //     sameSite: 'strict',
        //     maxAge: 1 * 60 * 1000,
        // });
        
        res.status(200).json({
            message: 'Login Successfully',
            accessToken,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role?.name,
                token: result.accessToken,
            }
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
}

export const Dashboard = (req: Request, res: Response) => {
    const user = (req as any).user;

    res.status(200).json({
        message: `Welcome to the dashboard, ${user.username}`,
        user: user.username,
        role: user.role.name
    });
    return
}

export const adminDashboard = (req: Request, res: Response) => {
    const user = (req as any).user;

    res.status(200).json({
        message: `Welcome to the admin dashboard, ${user.username}`,
        user: user.username,
        role: user.role.name
    });
    return
}

export const logout = (req: Request, res: Response) => {
    const token = req.cookies['refresh_token'];
    console.log("refresh_token :", token);
    
    if(token) {
        removeToken(token);
    }

    if(!token || !isTokenValid(token)) {
        res.status(400).json({ message: "Refresh token not found or already invalid" });
        return;
    }

    // if(generateAccessToken)

    res.clearCookie('refresh_token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'development',
        sameSite: 'strict'
    });
    // res.clearCookie('token', {
    //     httpOnly: true,
    //     secure: process.env.NODE_ENV === 'development',
    //     sameSite: 'strict'
    // });

    res.status(200).json({ message: "Logout successfully" });
}

export const refreshToken = (req: Request, res: Response) => {
    const token= req.cookies['refresh_token'];

    if(!token) {
        res.status(401).json({ message: "No token provided" });
    }

    if(!isTokenValid(token)) {
        res.status(403).json({ message: "Invalid or revoked refresh" });
    }

    jwt.verify(token, REFRESH_TOKEN!, (err: Error | null, user: any) => {
        if(err) {
            res.status(403).json({ message: 'Invalid token' });
        }

        const newAccessToken = generateAccessToken({ 
            id: user.id,
                username: user.username,
                role: user.role?.name,
                token: user.newAccessToken,
        });

        res.status(200).json({ accessToken: newAccessToken });
    });
}