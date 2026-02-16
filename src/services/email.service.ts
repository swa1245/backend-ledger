import nodemailer from "nodemailer";
import { env } from "../config/env.js";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: env.EMAIL_USER,
    clientId: env.CLIENT_ID,
    clientSecret: env.CLIENT_SECRET,
    refreshToken: env.REFRESH_TOKEN,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error("Error connecting to email server:", error);
  } else {
    console.log("Email server is ready to send messages");
  }
});

// Function to send email
export const sendEmail = async (to: string, subject: string, text: string, html: string) => {
  try {
    const info = await transporter.sendMail({
      from: `"Backend ledger" <${env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

export async function sendRegisterEmail(userEmail: string, name: string) {
  const subject = "Welcome to Backend Ledger";
  const text = `Hello ${name}`;
  const html = `<h1>Welcome to Backend Ledger</h1>`;
  await sendEmail(userEmail, subject, text, html);
}

export async function sendTransactionEmail(userEmail: string, name: string, amount: number, type: string, toAccount: string, fromAccount: string) {

  const subject = "Transaction completed";
  const text = `Hello ${name} you have received ${amount} from ${fromAccount}`;
  const html = `<h1>Transaction completed ${type} ${amount} from ${fromAccount} to ${toAccount}</h1> `;
  await sendEmail(userEmail, subject, text, html);
}
