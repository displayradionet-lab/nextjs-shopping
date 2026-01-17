'use server'
import { signIn, signOut } from '@/auth'
import { IUserSignIn } from '@/types'
import { redirect } from 'next/navigation'


export async function signInWithCredentials(user: IUserSignIn, callbackUrl?: string) {
    console.log('Attempting sign in with:', user.email);
    
    const result = await signIn('credentials', {
        ...user,
        redirect: false,
    });
    
    console.log('Sign in result:', result);
    
    if (result?.error) {
        console.log('Sign in error:', result.error);
        throw new Error('Invalid email or password');
    }
    
    console.log('Sign in successful, redirecting to:', callbackUrl || '/');
    // Handle redirect manually
    redirect(callbackUrl || '/');
}

export const SignOut = async () => {
  const redirectTo = await signOut({ redirect: false })
  redirect(redirectTo.redirect0)
}


