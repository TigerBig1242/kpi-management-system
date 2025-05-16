import prisma from "../config/config";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import { generateAccessToken, generateRefreshToken } from "../utils/token-utils";
import { saveToken } from "../../token.store";

export interface Register {
    username: string;
    email: string;
    password: string;
    roleId: number;
}

// Register user function
export default async function registerUser(data: Register) {
        const { username, email, password, roleId } = data;
        const salt = await bcrypt.genSalt(10);
        const passwordHashed = await bcrypt.hash(password, salt);

        // Check field is require
        if(!username || !email || !password || !roleId) {
            throw new Error("All field is require");
        }

        // Find username and email 
        const userExist = await prisma.user.findFirst({
            where: {
                OR: [
                    { username: username },
                    { email: email }
                ]
            }
        })

        // Check username and email is exist
        if(userExist) {
            throw new Error("Username or Email already exist");
        }

        const createUser = await prisma.user.create({ 
            data: { username, email, passwordHash: passwordHashed, roleId, } 
        });

        return createUser
}

// Log in user function
export const loginUser = async(email: string, password: string) => {
    const user = await prisma.user.findUnique({ 
        where: { email },
        include: { 
            role: {
                select: {
                    // id: true,
                    name: true,
                }
            } 
        },
    });
    if(!user) {
        return null;
    }
    const comparePassword = await bcrypt.compare(password, user.passwordHash);
    if(!comparePassword) {
        return null;
    }

    if(!process.env.ACCESS_TOKEN_SECRET) {
        throw new Error("ACCESS_TOKEN_SECRET is not defined in the environment variables");
    }
    
    // const token = jwt.sign(
    //     { 
    //         id: user.id, 
    //         role: user.roleId,
    //         user: user.username,
    //         role_name: user.role?.name,
    //     },
    //     process.env.JWT_SECRET!,
    //     { expiresIn: '1m', }
    // );

    const payload = {
        id: user.id, 
        role: user.roleId,
        email: user.email,
        user: user.username,
        role_name: user.role?.name,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken({ id: user.id });

    saveToken(refreshToken);
    return { user, accessToken, refreshToken, }
    // return { user, token };
}