"use client"
import { BackButtonType } from '@/utils/PropType/types'
import React from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'


const BackButton = (
    {
        href,
        label
    }:BackButtonType
    ) => {
    return (
        <Button className='font-medium w-full'>
            <Link href={href} aria-label={label}>{label}</Link>
        </Button>
    )
}

export default BackButton