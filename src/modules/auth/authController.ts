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
  
        console.log("User after Google login:", user);
  
        const token = jwt.sign(
            { userId: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET!,
            { expiresIn: "1h" }
        );
        console.log("Token généré:", token);

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "none",
            maxAge: 3600000,
        });

        console.log("DEBUG 1");
console.log({
    httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "none",
            maxAge: 3600000
});
console.log("DEBUG 2");
        res.redirect(`${Env.FRONTEND_URL}/profil`);

    }
);

authRouter.get("/me", authenticateJWT, (req: any, res: any) => {
    res.json({...req.user,token: req.cookies.token});
});


export default authRouter;
