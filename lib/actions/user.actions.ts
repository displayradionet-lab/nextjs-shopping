'use server'
import { signIn, signOut } from '@/auth'
import { IUserSignIn, IUserSignUp } from '@/types'
import { redirect } from 'next/navigation'
import { UserSignUpSchema } from '../validator';
import { connectToDatabase } from '../db';
import User from '../db/models/user.model';
import bcrypt from 'bcryptjs';
import { formatError } from '../utils';


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

export const SignInWithGoogle = async () => {
    await signIn('google')
}


// CREATE
export async function registerUser(userSignUp: IUserSignUp) {
    try {
        const user = await UserSignUpSchema.parseAsync({
            name: userSignUp.name,
            email: userSignUp.email,
            password: userSignUp.password,
            confirmPassword: userSignUp.confirmPassword,
        })

        await connectToDatabase()
        await User.create({
            ...user,
            password: await bcrypt.hash(user.password, 5),
        })

        return { success: true, message: "User Created Successfully" }
    } catch (error) {
        return { success: false, error: formatError(error)}
    }
}