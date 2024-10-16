import { CardWrapperProps } from '@/utils/PropType/types'
import React from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card'
import Socials from './socials'
import BackButton from './back-button'

const AuthCard = (
    {
        cardTitle,
        children,
        backButtonHref,
        backButtonLabel,
        showSocial = false
    }: CardWrapperProps
) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{cardTitle}</CardTitle>
            </CardHeader>
            <CardContent>{children}</CardContent>
            {
                showSocial && (
                    <CardFooter>
                        <Socials />
                    </CardFooter>
                )
            }
            <CardFooter>
                <BackButton href={backButtonHref} label={backButtonLabel} />
            </CardFooter>
        </Card>
    )
}

export default AuthCard