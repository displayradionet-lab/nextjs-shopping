'use server'
import { signIn, signOut } from '@/auth'
import { IUserSignIn } from '@/types'
import { redirect } from 'next/navigation'


export async function signInWithCredentials(user: IUserSignIn) {
    try {
        const result = await signIn('credentials', {
            ...user,
            redirect: false
        });
        
        if (result?.error) {
            throw new Error(result.error);
        }
        
        return result;
    } catch (error) {
        throw error;
    }
}

export const SignOut = async () => {
    const redirectTo = await signOut({ redirect: false })
    redirect(redirectTo.redirect)
}

