
"use client"
import FormError from "@/components/auth/form-error";
import FormSuccess from "@/components/auth/form-success";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField, FormControl, FormItem, FormLabel, FormDescription, FormMessage, Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { settings } from "@/server/actions/setting";
import { SettingsSchema } from "@/types/settings-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Session } from "next-auth";
import { useAction } from "next-safe-action/hooks";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from 'zod'
import { UploadButton } from "@/app/api/uploadthing/upload"

type SettingsForm = {
    session: Session
}


export default function SettingCard(session: SettingsForm) {
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [avatarUploading, setAvatarUploading] = useState(false);
    const { execute, status } = useAction(settings, {
        onSuccess({ data }) {
            if (data?.error) setError(data.error);
            if (data?.success) setSuccess(data.success)
        }
    })
    const form = useForm({
        resolver: zodResolver(SettingsSchema),
        defaultValues: {
            password: undefined,
            newPassword: undefined,
            name: session.session.user?.name || undefined,
            email: session.session.user?.email || undefined,
            image: session.session.user?.image || undefined,
            isTwoFactorEnabled: session.session.user.isTwoFactorEnabled || undefined,
            isOAuth: session.session.user.isOAuth || undefined
        }
    })

    const onSubmit = async (values: z.infer<typeof SettingsSchema>) => {
        execute(values)
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Your Settings</CardTitle>
                <CardDescription>Update your account settings</CardDescription>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="John Doe"
                                                disabled={status === "executing"}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            This is your public display name.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="image"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Avatar</FormLabel>
                                        <div className="flex items-center gap-4">
                                            {
                                                !form.getValues("image") && (
                                                    <div className="font-bold">
                                                        {session.session.user?.name?.charAt(0).toUpperCase()}
                                                    </div>
                                                )
                                            }
                                            {
                                                form.getValues("image") && (
                                                    <Image
                                                        src={form.getValues("image")!}
                                                        width={42}
                                                        height={42}
                                                        className="rounded-full"
                                                        alt="User Image"
                                                    />
                                                )
                                            }
                                            <UploadButton
                                                className="scale-75 ut-button:ring-primary  ut-label:bg-red-50  ut-button:bg-primary/75  hover:ut-button:bg-primary/100 ut:button:transition-all ut-button:duration-500  ut-label:hidden ut-allowed-content:hidden"
                                                endpoint="avatarUploader"
                                                onUploadBegin={() => {
                                                    setAvatarUploading(true)
                                                }}
                                                onClientUploadComplete={(res) => {
                                                    // Do something with the response
                                                    form.setValue("image", res[0].url)
                                                    setAvatarUploading(false)
                                                    return
                                                }}
                                                onUploadError={(error: Error) => {
                                                    form.setError("image", {
                                                        type: "validate",
                                                        message: error.message,
                                                    })
                                                    setAvatarUploading(false)
                                                    return
                                                }}
                                                content={{
                                                    button({ ready }) {
                                                        if (ready) return <div>Change Avatar</div>
                                                        return <div>Uploading...</div>
                                                    },
                                                }}
                                            />
                                        </div>

                                        <FormControl>
                                            <Input
                                                placeholder="User Image"
                                                type="hidden"
                                                disabled={status === "executing"}
                                                {...field}
                                            />
                                        </FormControl>
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
                                            <Input
                                                type="password"
                                                placeholder="*********"
                                                disabled={
                                                    status === "executing" || session?.session.user.isOAuth
                                                }
                                                {...field}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}

                                name="newPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>New Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                placeholder="*********"
                                                disabled={
                                                    status === "executing" || session?.session.user.isOAuth
                                                }
                                                {...field}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="isTwoFactorEnabled"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Two Factor Authentication</FormLabel>
                                        <FormDescription>
                                            Enable two factor authentication for your account
                                        </FormDescription>
                                        <FormControl>
                                            <Switch
                                                disabled={
                                                    status === "executing" || session?.session.user.isOAuth
                                                }
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormError message={error} />
                            <FormSuccess message={success} />
                            <Button
                                type="submit"
                                disabled={status === "executing" || avatarUploading}
                            >
                                Update your settings
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </CardHeader>
        </Card>
    )
}