'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function SignOutButton() {
  return (
    <Link href="/api/auth/signout" className="w-full">
      <Button
        className="w-full py-4 px-2 h-4 justify-start"
        variant="ghost"
        onClick={() => console.log('SignOut button clicked')}
      >
        Sign Out
      </Button>
    </Link>
  )
}
