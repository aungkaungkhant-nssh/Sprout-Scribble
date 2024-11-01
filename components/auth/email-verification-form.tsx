"use client"
import { newVerificationToken } from "@/server/actions/tokens";
import { useSearchParams, useRouter } from "next/navigation"
import { useCallback, useEffect, useState } from "react";
import AuthCard from "./auth-card";
import FormSuccess from "./form-success";
import FormError from "./form-error";

export const EmailVerification = () => {
    const token = useSearchParams().get("token")
    const router = useRouter();
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleVerification = useCallback(() => {
        if (error || success) return
        if (!token) {
            setError("No token found")
            return
        }
        newVerificationToken(token).then((data) => {
            if (data.error) setError(data.error)
            if (data.success) {
                setSuccess(data.success)
                router.push('/auth/login')
            }
        })
    }, [])

    useEffect(() => {
        handleVerification()
    }, [])

    return (
        <AuthCard cardTitle="Verify your account." backButtonLabel="Back to login" backButtonHref="/auth/login">
            <div className="flex items-center flex-col w-full justify-center">
                <p>{!success && !error ? "Verifying email...." : null}</p>
                <FormSuccess message={success} />
                <FormError message={error} />
            </div>

        </AuthCard>
    )

}