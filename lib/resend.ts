import { Resend } from 'resend';

// This pulls the key you just put in your .env.local
export const resend = new Resend(process.env.RESEND_API_KEY);