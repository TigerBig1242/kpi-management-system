import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import prisma from '../config/config';

const JWT_SECRET = process.env.ACCESS_TOKEN_SECRET
export const authenticateJWT = async (req: Request, res:Response) => {
    const authHeader = req.headers.authorization;
    
    if(!authHeader) {
        return res.sendStatus(401);
    }

    const token = authHeader.split(' ')[1];
    console.log("token", token);

    if(!token || token === '') {
        res.status(401).json({ message: "Token not found or token expired" });
    }
    
    try {
        const decoded = jwt.verify(token, JWT_SECRET!);
        console.log('decoded', decoded);
        (req as any).user = decoded;
    } catch (error) {
        return res.sendStatus(403);
    }
}

export const authorizeRoles = (requiredRoles: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const authHeader = req.headers.authorization;
        const tokenMiddleware = req.cookies
        const cookieToken = req.cookies.token;
        console.log("cookieToken", cookieToken);

        if(!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ message: "Unauthorized: No token provided" });
            return;
        }

        if(!JWT_SECRET) {
            res.status(400).json({ message: "ACCESS_TOKEN_SECRET is not defined in the environment variables" });
            return;
        }

        const token = authHeader?.split(' ')[1];
        console.log("token middleware", tokenMiddleware);
        console.log("token ", token);
        
        try {
            // const payload = jwt.verify(token, JWT_SECRET) as { id: number };
            const payload = jwt.verify(token, JWT_SECRET) as JwtPayload

            const user = await prisma.user.findUnique({ 
                where: { id: payload.id },
                include: { role: true }, 
            });    

            if(!user) {
                res.status(401).json({  message: "Unauthorized: User not found" });
                return;
            }

            if(!user.role) {
                res.status(403).json({ message: "Forbidden: role not assigned" });
                return;
            }

            if(!requiredRoles.includes(user.role.name)) {
                res.status(403).json({ 
                    message: 'Forbidden: Access denied : User role not assigned',
                    yourRole: user.role?.name,
                    requiredRoles: requiredRoles, 
                });
                return
            }

            (req as any).user = user;
            next();
        } catch (error) {
            console.error('Invalid token:', error);
            res.status(401).json({ message: 'Unauthorized: Invalid token' });
            return;
        }
    };
}