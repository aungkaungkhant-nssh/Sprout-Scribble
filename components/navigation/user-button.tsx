// import { Session } from 'next-auth'
"use client"

import { Session } from 'next-auth'
import { signOut } from 'next-auth/react'
import React from 'react'

export const UserButton = ({ user }:Session) => {
  return (
    <div>
        <h1>{ user?.email }</h1>
        <button onClick={()=>signOut()}>Sign Out</button>
    </div>
  )
}
