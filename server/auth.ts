import NextAuth from "next-auth"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { db } from '@/server'
import Google from 'next-auth/providers/google'
import Github from "next-auth/providers/github"
import { LoginSchema } from "@/types/login-schema"
import { eq } from "drizzle-orm"
import Credentials from "next-auth/providers/credentials"
import { accounts, users } from "./schema"
import bcrypt from 'bcrypt'
import Stripe from "stripe"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db),
  secret: process.env.AUTH_SECRET,
  session: { strategy: 'jwt' },
  events: {
    createUser: async ({ user }) => {
      const stripe = new Stripe(process.env.STRIPE_SECRET!)
      const customer = await stripe.customers.create({
        email: user.email!,
        name: user.name!
      })
      console.log("sork")
      await db
        .update(users)
        .set({ customerId: customer.id })
        .where(eq(users.id, user.id!))
    }
  },
  callbacks: {
    async session({ session, token }) {
      if (session && token.sub) {
        session.user.id = token.sub
      }
      if (session.user && token.role) {
        session.user.role = token.role as string
      }
      if (session.user) {
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean
        session.user.name = token.name
        session.user.email = token.email as string
        session.user.isOAuth = token.isOAuth as boolean
        session.user.image = token.image as string
      }

      return session
    },
    async jwt({ token }) {
      if (!token.sub) return token;
      const existingUser = await db.query.users.findFirst({
        where: eq(users.id, token.sub)
      })

      if (!existingUser) return token;
      const existingAccount = await db.query.accounts.findFirst({
        where: eq(accounts.userId, existingUser.id)
      })
      token.isOAuth = !!existingAccount;
      token.name = existingUser.name;
      token.email = existingUser.email;
      token.role = existingUser.role;
      token.isTwoFactorEnabled = existingUser.twoFactorEnabled;
      token.image = existingUser.image
      return token;
    }
  },
  providers: [
    Google(
      {
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        allowDangerousEmailAccountLinking: true
      }
    ),
    Github(
      {
        clientId: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        allowDangerousEmailAccountLinking: true
      }
    ),
    Credentials({
      credentials: {
        email: {},
        password: {}
      },

      authorize: async (credential) => {
        const { email, password } = await LoginSchema.parseAsync(credential);

        const user = await db.query.users.findFirst({
          where: eq(users.email, email)
        });

        if (!user || !user.password) {
          return null
        }



        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
          return null
        }

        return user;
      }
    }
    )
  ],
})