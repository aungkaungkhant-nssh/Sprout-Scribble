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
import FormError from "./form-error";
import { ResetSchema } from "@/types/reset-schema";
import FormSuccess from "./form-success";
import { reset } from "@/server/actions/password-reset";

const ResetForm = () => {
    const [success, setSuccess] = useState('')
    const [error, setError] = useState('')
    const form = useForm<z.infer<typeof ResetSchema>>({
        resolver: zodResolver(ResetSchema),
        defaultValues: {
            email: "",
        }
    })

    const { execute, status } = useAction(reset, {
        onSuccess({ data }) {
            if (data?.error) setError(data.error)
            if (data?.success) setSuccess(data.success)
        }
    })

    const onSubmit = async (values: z.infer<typeof ResetSchema>) => {
        execute(values)
    };


    return (
        <AuthCard
            cardTitle="Forgot your password?"
            backButtonHref="/auth/login"
            backButtonLabel="Back To Login"
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

export default ResetForm;