import express, { Router, Request, Response } from "express";
import { register, login, Dashboard, adminDashboard, logout, refreshToken, users } from './../controller/authController';
import { getAllRole } from "../controller/getRoleController";
import { authorizeRoles } from "../middleware/middleware";

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout)
router.post('/refresh-token', refreshToken);
router.get('/getroles', getAllRole);
// router.get('/getroles', (req: Request, res: Response) => {
//     getAllRole(res, req);
// });
router.get('/getusers', users);
router.get('/dashboard', authorizeRoles(['admin']), adminDashboard
    // (req, res) => { res.json({ message: "This is admin only content." }) }
);

// router.get('/user-or-admin', authorizeRoles(['admin', 'user']), Dashboard
//     // (req, res) => { res.json({ message: "User or Admin access this." }) }
// );

router.get('/user-or-admin', authorizeRoles(['admin', 'user']), async (req: Request, res: Response) => {
    const user = (req as any).user;

    res.json({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role.name
    });
});

export default router;