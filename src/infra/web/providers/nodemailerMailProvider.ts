import nodemailer from "nodemailer";
import { MailProvider } from "./mailProvider";

export class NodemailerMailProvider implements MailProvider {
    private transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        tls: {
            rejectUnauthorized: false, // ignora erro de certificado, pelo amor de deus, lembrar de tirar isso em produção
        },
    });

    async sendVerificationEmail(to: string, token: string): Promise<void> {
        const verifyUrl = `http://localhost:3000/auth/verify-email?token=${token}`;

        const html = `
            <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 30px;">
            <table width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: auto; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
                <tr>
                <td style="background: #255ab4ff; color: #fff; text-align: center; padding: 20px; font-size: 24px; font-weight: bold;">
                    Valugar
                </td>
                </tr>
                <tr>
                <td style="padding: 30px; color: #333; font-size: 16px; line-height: 1.5;">
                    <p>Olá,</p>
                    <p>Obrigado por se cadastrar! Para confirmar seu endereço de e-mail, clique no botão abaixo:</p>
                    <div style="text-align: center; margin: 30px 0;">
                    <a href="${verifyUrl}" 
                        style="background: #255ab4ff; color: #fff; padding: 14px 24px; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: bold; display: inline-block;">
                        Verificar E-mail
                    </a>
                    </div>
                    <p>Se você não solicitou este cadastro, pode ignorar este e-mail.</p>
                    <p style="margin-top: 40px; font-size: 14px; color: #888;">Atenciosamente,<br>Equipe Valugar</p>
                </td>
                </tr>
            </table>
            </div>
        `;

        await this.transporter.sendMail({
            from: `"Não responder - Equipe Valugar" <${process.env.EMAIL_USER}>`,
            to,
            subject: "Verifique seu e-mail",
            html,
        });
    }

    async sendLoginNotification(to: string, date: Date): Promise<void> {
        const formattedDate = date.toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
        const html = `
            <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 30px;">
            <table width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: auto; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
                <tr>
                <td style="background: #255ab4ff; color: #fff; text-align: center; padding: 20px; font-size: 24px; font-weight: bold;">
                    Valugar
                </td>
                </tr>
                <tr>
                <td style="padding: 30px; color: #333; font-size: 16px; line-height: 1.5;">
                    <p>Olá,</p>
                    <p>Uma tentativa de login foi realizada em sua conta Valugar em <strong>${formattedDate}</strong>.</p>
                    <p>Se foi você, pode desconsiderar este e-mail. Caso contrário, recomendamos alterar sua senha imediatamente.</p>
                    <p style="margin-top: 40px; font-size: 14px; color: #888;">Atenciosamente,<br>Equipe Valugar</p>
                </td>
                </tr>
            </table>
            </div>
        `;

        await this.transporter.sendMail({
            from: `"Não responder - Equipe Valugar" <${process.env.EMAIL_USER}>`,
            to,
            subject: "Notificação de login na sua conta",
            html,
        });
    }
}