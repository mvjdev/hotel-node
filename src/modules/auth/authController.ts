import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { Env } from "../../config/env";

const authRouter = Router();

authRouter.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
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

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // En prod, utiliser Secure
            sameSite: "strict",
            maxAge: 3600000,
        });

        res.redirect(`${Env.FRONTEND_URL}/profile`);
    }
);

authRouter.get("/me", (req: any, res: any) => {
    console.log("Cookies:", req.cookies); // 🔍 Vérifie si les cookies sont présents
    console.log("req" + req);
    
    const token = req.cookies?.token; // 🛠️ Ajoute une vérification de sécurité

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        res.json(decoded);
    } catch {
        res.status(403).json({ message: "Forbidden" });
    }
});


export default authRouter;
