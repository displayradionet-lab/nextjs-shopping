
'use client';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { updateUserName } from '@/lib/actions/user.actions';
import { UserNameSchema } from '@/lib/validator';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';
import { Input } from '@/components/ui/input';

export const ProfileForm = () => {
  const router = useRouter();
  const { data: session, update } = useSession();
  const form = useForm<z.infer<typeof UserNameSchema>>({
    resolver: zodResolver(UserNameSchema),
    defaultValues: {
      name: session?.user?.name!,
    },
  });

  async function onSubmit(values: z.infer<typeof UserNameSchema>) {
    const res = await updateUserName(values);
    if (!res.success) {
      return toast.error(res.error || 'An unexpected error occurred');
    }

    const { data } = res;
    const newSession = {
      ...session,
      user: {
        ...session?.user,
        name: data?.name,
      },
    };
    await update(newSession);
    toast.success('User updated successfully');
    router.push('/account/manage');
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-5"
      >
        <div className="flex flex-col gap-5">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="font-bold">Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Name"
                    className="input-field"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <Button 
        type='submit'
        size='lg'
        className='w-full button col-span-2'
        disabled={form.formState.isSubmitting}
        >
            {form.formState.isSubmitting ? 'Updating...' : 'Updated'}
        </Button>
      </form>
    </Form>
  );
};
