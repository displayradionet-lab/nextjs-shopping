'use client';

import { IUserSignIn } from '@/types';
import { redirect, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserSignInSchema } from '@/lib/validator';
import { signInWithCredentials } from '@/lib/actions/user.actions';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { toast } from 'react-hot-toast';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { APP_NAME } from '@/lib/constants';
import Link from 'next/link';

export interface Toast {
  title: string;
  description?: string;
  variant?: 'success' | 'info' | 'warning' | 'destructive'; // Added 'destructive'
}


const signInDefaultValues =
  process.env.NODE_ENV === 'development'
    ? {
        email: 'test@gmail.com',
        password: '123456',
      }
    : {
        email: '',
        password: '',
      };

export default function CredentialsSignInForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const form = useForm<IUserSignIn>({
    resolver: zodResolver(UserSignInSchema),
    defaultValues: signInDefaultValues,
  });

  const { control, handleSubmit } = form;

  const onSubmit = async (data: IUserSignIn) => {
    try {
      const result = await signInWithCredentials({
        email: data.email,
        password: data.password,
      });
      
      if (result) {
        redirect(callbackUrl);
      }
    } catch (error) {
      if (isRedirectError(error)) {
        throw error;
      }
      toast.error('Invalid email or password');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input type="hidden" name="callbackUrl" value={callbackUrl} />
        <div className="space-y-6">
          <FormField
            control={control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Enter email address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="password"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <Button className='border' type="submit">Sign In</Button>
          </div>
          <div className="text-xs -mb-5">
            By signing in, you agree to {APP_NAME}&apos;s{' '}
            <Link href="/page/conditions-of-use">Conditions of use</Link> and{' '}
            <Link href="/page/privacy-policy">Privacy Policy</Link>
          </div>
        </div>
      </form>
    </Form>
  );
}
