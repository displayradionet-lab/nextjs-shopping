import Link from 'next/link';
import { X, ChevronRight, UserCircle, MenuIcon } from 'lucide-react';
import { auth } from '@/auth';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { SignOut } from '@/lib/actions/user.actions';

export default async function Sidebar({
  categories,
}: {
  categories: string[];
}) {
  const session = await auth();
  return (      
    <Drawer direction="left">
      <DrawerTrigger className="header-button flex items-center !p-2">
        <MenuIcon className="h-5 w-5 mr-1" />
        All
      </DrawerTrigger>
      <DrawerContent className="w-[350px] mt-0 top-0">
        <div className="flex flex-col h-full">
          {/* User Sign In Section */}
          <div className="dark bg-gray-800 text-foreground flex items-center justify-between">
            <DrawerHeader>
              <DrawerTitle className="flex items-center">
                <UserCircle className="h-6 w-6 mr-2 "/>
                {session ? (
                  <DrawerClose asChild>
                    <Link href="/account">
                      <span className="text-lg font-semibold">
                        Hello, {session.user.name}
                      </span>
                    </Link>
                  </DrawerClose>
                ) : (
                  <DrawerClose asChild>
                    <Link href="/sign-in">
                      <span className="text-lg text-red-500 font-semibold">
                        Hello, Sign In
                      </span>
                    </Link>
                  </DrawerClose>
                )}
              </DrawerTitle>
              <DrawerDescription></DrawerDescription>
            </DrawerHeader>
            <DrawerClose asChild>
              <Button variant="default" size="icon" className="mr-2">
                <X className="h-5 w-5" />
                <span className="sr-only">Close</span>
              </Button>
            </DrawerClose>
          </div>

          {/* Shop by category */}
          <div className="flex-1 overflow-auto">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">Shop by Department</h2>
            </div>
            <nav className="flex flex-col">
              {categories.map((category) => (
                <DrawerClose asChild key={category}>
                  <Link
                    href={`/search?category=${category}`}
                    className={`flex items-center justify-between item-button`}
                  >
                    <span>{category}</span>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </DrawerClose>
              ))}
            </nav>
          </div>

          {/* Setting and help */}
          <div className="border-t flex flex-col">
            <div className="p-4">
              <h2 className="text-lg font-semibold">Setting and help</h2>
            </div>
            <DrawerClose asChild>
              <Link href="/account" className="item-button">
                Your Account
              </Link>
            </DrawerClose>{' '}
            <DrawerClose asChild>
              <Link href="/page/customer-service" className="item-button">
                Customer Service
              </Link>
            </DrawerClose>
            {session ? (
              <form action={SignOut} className="w-full">
                <Button
                  variant="ghost"
                  className="w-full justify-start item-button text-base"
                >
                  Sign Out
                </Button>
              </form>
            ) : (
              <Link href="/sign-in" className="item-button">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
    
  );
}
