"use server"

import getBaseUrl from '@/lib/base-url';
import { Resend } from 'resend'
const resend = new Resend(process.env.RESENT_API_KEY);
const domain = getBaseUrl();

export const sendEmailVerification = async (email: string, token: string) => {
    const confirmLink = `${domain}/auth/new-verification?token=${token}`;

    const { data, error } = await resend.emails.send({
        from: 'Acme <onboarding@resend.dev>',
        to: email,
        subject: 'Sprout and Scribble - Confirmation Email',
        html: `<p>Click to <a href='${confirmLink}'>confirm you email</a></p>`
    });
    if (error) return console.log(error);
    return data;
}

export const sendPasswordResetEmail = async (email: string, token: string) => {
    const confirmLink = `${domain}/auth/new-password?token=${token}`;

    const { data, error } = await resend.emails.send({
        from: 'Acme <onboarding@resend.dev>',
        to: email,
        subject: 'Sprout and Scribble - Reset Password',
        html: `<p>Click to <a href='${confirmLink}'>confirm you email</a></p>`
    });
    if (error) return console.log(error);
    return data;
}


export const sendTwoFactorTokenByEmail = async (email: string, token: string) => {
    const { data, error } = await resend.emails.send({
        from: 'Acme <onboarding@resend.dev>',
        to: email,
        subject: 'Sprout and Scribble - Your 2 Factor Token',
        html: `<p>Your Confirmation Code: ${token}</p>`,
    });
    if (error) return console.log(error);
    return data;
}