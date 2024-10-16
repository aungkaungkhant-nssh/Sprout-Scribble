"use client"
import { useForm } from "react-hook-form";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import AuthCard from "./auth-card";
import { zodResolver } from '@hookform/resolvers/zod'
import { LoginSchema } from "@/types/login-schema";
import * as z from 'zod'
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Link from "next/link";
import { useAction } from 'next-safe-action/hooks'
import { emailSignIn } from "@/server/actions/email-signin";
import { cn } from "@/lib/utils";


const LoginForm = () => {
    const form = useForm({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    })

    const { execute, status } = useAction(emailSignIn, {})

    const onSubmit = (values: z.infer<typeof LoginSchema>) => {
        console.log('work')
        execute(values)
    }

    return (
        <AuthCard
            cardTitle="Welcome back!"
            backButtonHref="/auth/register"
            backButtonLabel="Create a new Account"
            showSocial
        >
            <div>
                <Form {...form}>
                    <form action="" onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="example@gmail.com" />
                                    </FormControl>
                                    <FormDescription />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="*********" type="password" />
                                    </FormControl>
                                    <FormDescription />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button asChild variant={"link"}>
                            <Link href="/auth/reset">Forgot your password</Link>
                        </Button>
                        <Button type="submit" className={cn("w-full", status === "executing" ? 'animate-pulse' : '')}>
                            Login
                        </Button>
                    </form>
                </Form>
            </div>
        </AuthCard>
    )
}

export default LoginForm;