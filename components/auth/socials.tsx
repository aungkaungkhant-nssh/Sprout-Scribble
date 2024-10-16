import { signIn } from 'next-auth/react'
import React from 'react'
import { Button } from '../ui/button'
import { FcGoogle } from 'react-icons/fc'
import { FaGithub } from 'react-icons/fa'

const Socials = () => {
  return (
    <div className='flex flex-col items-center w-full gap-4'>
        <Button 
        variant={'outline'}
        className='flex gap-4 w-full'
        onClick={()=>signIn("google",{
          redirect:false,
          callbackUrl: "/"
        })}>
          Sign In with Google
          <FcGoogle className='w-5 h-5' />
        </Button>

        <Button 
         variant={'outline'}
         className='flex gap-4 w-full'
        onClick={()=>signIn("github",{
          redirect:false,
          callbackUrl: "/"
        })}>
          Sign In With Github
          <FaGithub className='w-5 h-5' />
        </Button>
    </div>
  )
}

export default Socials