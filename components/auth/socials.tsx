import { signIn } from 'next-auth/react'
import React from 'react'

const Socials = () => {
  return (
    <div>
        <button onClick={()=>signIn("google",{
          redirect:false,
          callbackUrl: "/"
        })}>
          Sign In with Google
        </button>
        <button onClick={()=>signIn("github",{
          redirect:false,
          callbackUrl: "/"
        })}>
          Sign In With Github
        </button>
    </div>
  )
}

export default Socials