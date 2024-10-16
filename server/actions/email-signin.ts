"use server"
import { createSafeActionClient } from "next-safe-action";
import { LoginSchema } from "@/types/login-schema";
import { db } from "..";
import { eq } from "drizzle-orm";
import { users } from "../schema";


export const actionClient = createSafeActionClient();

export const emailSignIn = actionClient
    .schema(LoginSchema)
    .action(async ({ parsedInput: { email, password, code } }) => {
        const existingUser = await db.query.users.findFirst({
            where: eq(users.email, email)
        })

        if (existingUser?.email !== email) {
            return { error: "Email not found" }
        }

        return { success: email }
    })