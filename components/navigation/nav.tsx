import { auth } from '@/server/auth';
import { UserButton } from './user-button';
import { Button } from '../ui/button';
import Link from 'next/link';
import { LogIn } from 'lucide-react';
import Logo from './logo';
import CartDrawer from '../cart/cart-drawer';

export default async function Nav() {
    const session = await auth();

    return (
        <header className='py-8'>
            <ul className='flex justify-between items-center gap-4'>
                <li className='flex flex-1'>
                    <Link href="/" aria-label='sprout and scribble logo'>
                        <Logo />
                    </Link>
                </li>
                <li className='relative flex items-center hover:bg-muted'>
                    <CartDrawer />
                </li>
                {
                    !session
                        ? (
                            <li className="flex items-center justify-center">
                                <Button asChild className='bg-primary'>
                                    <Link className="flex gap-2" href="auth/login">
                                        <LogIn />
                                        <span>Login</span>
                                    </Link>
                                </Button>
                            </li>
                        )
                        : (
                            <li>
                                <UserButton user={session.user} expires={session.expires} />
                            </li>
                        )
                }

            </ul>
        </header>
    )
}
