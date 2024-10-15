import {auth} from '@/server/auth';
import { UserButton } from './user-button';
import { Button } from '../ui/button';
import Link from 'next/link';
import { LogIn } from 'lucide-react';

export default async function Nav(){
    const session = await auth();

    return(
        <header className='bg-slate-500 p-4'>
            <ul className='flex justify-between'>
                <li>Logo</li>
                {
                    !session 
                    ? (
                        <li>
                            <Button asChild>
                                <Link className="flex gap-2" href="auth/login">
                                    <LogIn />
                                    <span>Login</span>
                                </Link>
                            </Button>
                        </li>
                    ) 
                    :(
                        <li>
                             <UserButton user={session.user} expires={session.expires} />
                        </li>
                    )
                }
              
            </ul>
        </header>
    )
}
