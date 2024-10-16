"use client"
import { useForm } from "react-hook-form";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import AuthCard from "./auth-card";
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useAction } from 'next-safe-action/hooks'
import { cn } from "@/lib/utils";
import { RegisterSchema } from "@/types/register-schema";
import { emailRegister } from "@/server/actions/email-register";
import { useState } from "react";
import FormSuccess from "./form-success";
import FormError from "./form-error";


const RegisterForm = () => {
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const form = useForm({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            email: "",
            password: "",
            name: ""
        }
    })

    const { execute, status } = useAction(emailRegister, {
        onSuccess({ data }) {
            if (data?.error) setError(data.error)
            if (data?.success) setSuccess(data.success)
        }
    })

    const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
        execute(values)
    }

    return (
        <AuthCard
            cardTitle="Create an account"
            backButtonHref="/auth/login"
            backButtonLabel="Already have an account?"
        >
            <div>
                <Form {...form}>
                    <form action="" onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="JhonDoh" />
                                    </FormControl>
                                    <FormDescription />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
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
                        <FormSuccess message={success} />
                        <FormError message={error} />
                        <Button type="submit" className={cn("w-full", status === "executing" ? 'animate-pulse' : '')}>
                            Register
                        </Button>
                    </form>
                </Form>
            </div>
        </AuthCard>
    )
}

export default RegisterForm;