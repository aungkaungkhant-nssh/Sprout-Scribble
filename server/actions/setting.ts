"use server"
import { SettingsSchema } from "@/types/settings-schema";
import { createSafeActionClient } from "next-safe-action";
import { auth } from "../auth";
import { db } from "..";
import { eq } from "drizzle-orm";
import { users } from "../schema";
import bcrypt from 'bcrypt'
import { revalidatePath } from "next/cache";
const actionClient = createSafeActionClient()


export const settings = actionClient
    .schema(SettingsSchema)
    .action(async ({ parsedInput: { name, image, isTwoFactorEnabled, email, password, newPassword } }) => {
        const user = await auth();
        if (!user) return { error: "User not found" }
        const dbUser = await db.query.users.findFirst({
            where: eq(users.id, user.user.id)
        })
        if (!dbUser) return { error: "User not found" }
        if (user.user.isOAuth) {
            email = undefined;
            password = undefined;
            newPassword = undefined;
            isTwoFactorEnabled = undefined
        }

        if (password && newPassword && dbUser.password) {
            const passwordMatch = await bcrypt.compare(password, dbUser.password)
            if (!passwordMatch) {
                return { error: "Password doesn't match" }
            }
            const samePassword = await bcrypt.compare(newPassword, dbUser.password)
            if (samePassword) {
                return { error: "New password is the same as the old password" }
            }
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            password = hashedPassword;
            newPassword = undefined;
        }

        await db.update(users)
            .set({
                twoFactorEnabled: isTwoFactorEnabled,
                name,
                email,
                password,
                image
            }).where(eq(users.id, dbUser.id))

        revalidatePath("/dashboard/settings")
        return { success: "Settings updated" }
    })