import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

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
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET!,
            { expiresIn: "1h" }
        );
  
        res.redirect(`http://localhost:3000/dashboard?token=${token}`);
    }
);
  

export default authRouter;
