'use client'

import { Button } from "@/components/ui/button"
import { useFormStatus } from "react-dom"
import { SignInWithGoogle } from '@/lib/actions/user.actions'


export function GoogleSignInForm() {
    const SignInButton = () => {
        const { pending } = useFormStatus()
        return (
            <Button disabled={pending} className="w-full" variant='outline'>
                {pending ? 'Redirecting to Google...' : 'Sign in with Google'}
            </Button>
        )
    }
    return (
        <form action={SignInWithGoogle}>
            <SignInButton />
        </form>
    )
}