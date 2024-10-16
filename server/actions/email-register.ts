"use server"
import { createSafeActionClient } from "next-safe-action";
import { users } from "../schema";
import { RegisterSchema } from "@/types/register-schema";
import bcrypt from 'bcrypt'
import { db } from "..";
import { eq } from "drizzle-orm";
import { generateEmailVerificationToken } from "./tokens";
import { sendEmailVerification } from "./emails";

const actionClient = createSafeActionClient();

export const emailRegister = actionClient
    .schema(RegisterSchema)
    .action(async ({ parsedInput: { email, password, name } }) => {
        const hashedPassword = await bcrypt.hash(password, 10);
        const existingUser = await db.query.users.findFirst({
            where: eq(users.email, email)
        })
        if (existingUser) {
            if (!existingUser.emailVerified) {
                const verificationToken = await generateEmailVerificationToken(email);
                await sendEmailVerification(email, verificationToken[0].token);
                return { success: "Email confirmation resent" }
            }
            return { error: "Email already in use" }
        }

        await db.insert(users).values({
            email,
            name,
            password: hashedPassword
        })
        const verificationToken = await generateEmailVerificationToken(email);
        await sendEmailVerification(email, verificationToken[0].token);
        return { success: "Email Confirmation resent" }
    })