"use server"
import { createSafeActionClient } from "next-safe-action";
import { LoginSchema } from "@/types/login-schema";
import { db } from "..";
import { eq } from "drizzle-orm";
import { twoFactorTokens, users } from "../schema";
import { generateEmailVerificationToken, generateTwoFactorToken, getTwoFactorTokenByEmail } from "./tokens";
import { sendEmailVerification, sendTwoFactorTokenByEmail } from "./emails";
import { AuthError } from "next-auth";


const actionClient = createSafeActionClient();

export const emailSignIn = actionClient
    .schema(LoginSchema)
    .action(async ({ parsedInput: { email, code } }) => {

        try {
            const existingUser = await db.query.users.findFirst({
                where: eq(users.email, email)
            })

            if (existingUser?.email !== email) {
                return { error: "Email not found" }
            }

            if (!existingUser.emailVerified) {
                const verificationToken = await generateEmailVerificationToken(email);
                await sendEmailVerification(email, verificationToken[0].token);
                return { success: "Confirmation Email Sent" }
            }


            if (existingUser.twoFactorEnabled && existingUser.email) {
                if (code) {
                    const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);
                    if (!twoFactorToken) {
                        return { error: "Invalid Token" }
                    }
                    if (twoFactorToken.token !== code) {
                        return { error: "Invalid Code" }
                    }
                    const hasExpired = new Date(twoFactorToken.expires) < new Date()
                    if (hasExpired) {
                        return { error: "Token has expired" }
                    }
                    await db
                        .delete(twoFactorTokens)
                        .where(eq(twoFactorTokens.id, twoFactorToken.id))
                } else {
                    const token = await generateTwoFactorToken(existingUser.email);
                    if (!token) {
                        return { error: "Token not generated" }
                    }

                    await sendTwoFactorTokenByEmail(token[0].email, token[0].token);
                    return { twoFactor: "Two Factor Token Sent!" }
                }
            }

            return { success: email }
        } catch (error) {
            if (error instanceof AuthError) {
                switch (error.type) {
                    case "CredentialsSignin":
                        return { error: error.message }
                    case "AccessDenied":
                        return { error: error.message }
                    case "OAuthSignInError":
                        return { error: error.message }
                    default:
                        return { error: "Something went wrong" }
                }
            }
        }



    })