import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { Env } from "../../config/env";
import { authenticateJWT } from "../../middlewares/authMiddleware";

const authRouter = Router();

authRouter.get("/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
  (req, res) => {
    res.json(req.user);
  }
);

authRouter.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "/" }),
    async (req, res) => {
        if (!req.user) {
            return res.redirect("/login");
        }
  
        const user = req.user as any;
  
        const token = jwt.sign(
            { userId: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET!,
            { expiresIn: "1h" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? 'none' : 'lax',
            maxAge: 3600000,
        });

        res.redirect(user.role === "ADMIN" ? `${Env.FRONTEND_URL}/admin` : `${Env.FRONTEND_URL}/profil`);


    }
);

authRouter.get("/me", authenticateJWT, (req: any, res: any) => {
    res.json({...req.user,token: req.cookies.token});
});

authRouter.post("/logout", (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        path: "/",
        domain: "localhost",
    });

    res.clearCookie("connect.sid", {
        path: "/",
    });
    
    res.status(200).json({ message: "Déconnexion réussie" });
});





export default authRouter;
