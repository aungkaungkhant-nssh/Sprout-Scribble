"use server"
import { createSafeActionClient } from "next-safe-action";
import { db } from "..";
import { eq } from "drizzle-orm";
import { ResetSchema } from "@/types/reset-schema";
import { users } from "../schema";
import { generatePasswordResetToken } from "./tokens";
import { sendPasswordResetEmail } from "./emails";


const actionClient = createSafeActionClient();

export const reset = actionClient
    .schema(ResetSchema)
    .action(async ({ parsedInput: { email } }) => {
        const existingUser = await db.query.users.findFirst({
            where: eq(users.email, email)
        })

        if (!existingUser) {
            return { error: "User not found" }
        }

        const passwordResetToken = await generatePasswordResetToken(email);

        if (!passwordResetToken) {
            return { error: "Token not found" }
        }

        await sendPasswordResetEmail(passwordResetToken[0].email, passwordResetToken[0].token)
        return { success: "Reset Email Sent" }
    })