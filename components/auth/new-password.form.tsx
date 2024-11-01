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
import { useState } from "react";
import FormSuccess from "./form-success";
import FormError from "./form-error";
import { NewPasswordSchema } from "@/types/new-password.schema";
import { newPassword } from "@/server/actions/new-password";
import { useSearchParams } from "next/navigation";


const NewPasswordForm = () => {
    const token = useSearchParams().get("token")
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const form = useForm<z.infer<typeof NewPasswordSchema>>({
        resolver: zodResolver(NewPasswordSchema),
        defaultValues: {
            password: ""
        }
    })

    const { execute, status } = useAction(newPassword, {
        onSuccess({ data }) {
            if (data?.error) setError(data.error)
            if (data?.success) setSuccess(data.success)
        }
    })

    const onSubmit = (values: z.infer<typeof NewPasswordSchema>) => {
        execute({ ...values, token })
    }

    return (
        <AuthCard
            cardTitle="Enter a new Password"
            backButtonHref="/auth/login"
            backButtonLabel="Back To Login"
            showSocial
        >
            <div>
                <Form {...form}>
                    <form action="" onSubmit={form.handleSubmit(onSubmit)}>
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
                            Reset Password
                        </Button>
                    </form>
                </Form>
            </div>
        </AuthCard>
    )
}

export default NewPasswordForm;