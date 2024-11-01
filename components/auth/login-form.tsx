"use client"
import { useForm } from "react-hook-form";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp"
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
import { useState } from "react";
import FormError from "./form-error";
import { useRouter } from 'next/navigation';
import { signIn } from "next-auth/react";

const LoginForm = () => {
    const router = useRouter()
    const [error, setError] = useState('');
    const [showTwoFactor, setShowTwoFactor] = useState(false);
    const form = useForm({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: "",
            code: ""
        },
        mode: "onChange"
    })



    const { execute, status } = useAction(emailSignIn, {
        onSuccess({ data }) {
            if (data?.error) setError(data.error)
            if (data?.twoFactor) setShowTwoFactor(true)
            if (data?.success) {
                (async () => {
                    const result = await signIn("credentials", {
                        email: form.getValues().email,
                        password: form.getValues().password,
                        redirect: false
                    });
                    if (result?.error) {
                        switch (result.error) {
                            case "CredentialsSignin":
                                setError("The password you entered is incorrect.");
                                break;
                            default:
                                setError("Something went wrong. Please try again.");
                                break;
                        }
                    } else {
                        router.push("/");
                    }
                })();
            }
        }
    })

    const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
        execute(values)
    };


    return (
        <AuthCard
            cardTitle="Welcome back!"
            backButtonHref="/auth/register"
            backButtonLabel="Create a new Account"
            showSocial={!showTwoFactor}
        >
            <div>
                <Form {...form}>
                    <form action="" onSubmit={form.handleSubmit(onSubmit)}>
                        {
                            showTwoFactor && (
                                <FormField
                                    control={form.control}
                                    name="code"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                We&apos;ve sent you a two factor code to your email.
                                            </FormLabel>
                                            <FormControl>
                                                <InputOTP
                                                    disabled={status === "executing"}
                                                    {...field}
                                                    maxLength={6}
                                                >
                                                    <InputOTPGroup>
                                                        <InputOTPSlot index={0} />
                                                        <InputOTPSlot index={1} />
                                                        <InputOTPSlot index={2} />
                                                        <InputOTPSlot index={3} />
                                                        <InputOTPSlot index={4} />
                                                        <InputOTPSlot index={5} />
                                                    </InputOTPGroup>
                                                </InputOTP>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )
                        }

                        {
                            !showTwoFactor && (
                                <>
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
                                </>
                            )
                        }
                        <Button asChild variant={"link"}>
                            <Link href="/auth/reset">Forgot your password</Link>
                        </Button>


                        <FormError message={error} />

                        <Button
                            type="submit"
                            className={cn(
                                "w-full my-4",
                                status === "executing" ? "animate-pulse" : ""
                            )}
                        >
                            {showTwoFactor ? "Verify" : "Sign In"}
                        </Button>
                    </form>
                </Form>
            </div>
        </AuthCard>
    )
}

export default LoginForm;