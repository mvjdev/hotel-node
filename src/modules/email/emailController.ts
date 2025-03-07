import { Router } from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const emailRouter = Router();

const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.user,
    pass: process.env.pass,  
}
});


// Interface pour la requête email
interface EmailRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
  recipient?: string;
}

emailRouter.post("/send-email", async (req: any, res: any) => {
    try {
      const { name, email, subject, message, recipient }: EmailRequest = req.body;
  
      // Validation plus stricte des données
      if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
        return res.status(400).json({ 
          error: "Tous les champs sont requis et doivent contenir des valeurs valides" 
        });
      }
  
      // Validation de l'email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ 
          error: "L'adresse email n'est pas valide" 
        });
      }
  
      const mailOptions = {
        from: `${name} <${email}>`,
        to: recipient || "maria625toavina@gmail.com",
        subject: `Message de contact de ${name}: ${subject}`,
        text: message,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px;">
            <h2 style="color: #333;">Nouveau message de contact</h2>
            <p><strong>Nom:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Sujet:</strong> ${subject}</p>
            <div style="margin-top: 20px; padding: 15px; background-color: #f9f9f9; border-radius: 4px;">
              <p><strong>Message:</strong></p>
              <p>${message.replace(/\n/g, "<br>")}</p>
            </div>
          </div>
        `,
      };
  
      // Ajout de timeout pour gérer les problèmes de connexion
      await new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) reject(error);
          else resolve(info);
        });
      });
  
      res.status(200).json({
        success: true,
        message: "Email envoyé avec succès",
        details: mailOptions
      });
    } catch (error) {
      console.error('Erreur détaillée:', error);
      
      // Gestion des erreurs spécifiques à Nodemailer
      let errorMessage;
      if ((error as any).responseCode === 421) {
        errorMessage = "Serveur SMTP indisponible";
      } else if ((error as any).code === 'EAUTH') {
        errorMessage = "Erreur d'authentification du serveur email";
      } else if ((error as any).code === 'ENOTFOUND' || (error as any).code === 'ETIMEDOUT') {
        errorMessage = "Erreur de connexion au serveur SMTP";
      } else {
        errorMessage = (error as Error).message || "Erreur lors de l'envoi de l'email";
      }
  
      res.status(500).json({ 
        success: false,
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  });

export default emailRouter;
