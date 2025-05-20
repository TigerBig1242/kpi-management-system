import { Response, Request } from 'express';
import { getRole } from "../service/getRoleService";
import { RequestHandler } from 'express';

export const getAllRole: RequestHandler = async(_req: Request, res: Response) => {
    try {
        const roles = await getRole();
        if(!roles) {
            res.status(401).json({ message: "Error roles not found or empty" });
            return;
        }
        res.status(200).json({ roles: roles });
        return;
    } catch (error) {
        res.status(500).json({ message: error });
        return;
    }
}