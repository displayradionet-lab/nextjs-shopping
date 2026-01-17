import { APP_NAME } from '@/lib/constants';
import Link from 'next/link';
import React from 'react';

export default function CheckoutFooter() {
  return (
    <div className="border-t-2 space-y-2 my-4 py-4">
      <p>
        Need Help? Check our <Link href="/page/help">Help Center</Link> or{' '}
        <Link href="/page/contact-us">Contact Us</Link>
      </p>
      <p>
        For an item ordered from {APP_NAME}: When you click the &apos;Place Your
        Order&apos; button, we will send you an email acknowledging receipt of
        your order. Your contract to purchase an item will not be complete until
        we send you an email notifying you that the item has shipped. by placing
        your order, you agree to {APP_NAME} &apos;s{' '}
        <Link href="/page/privacy-policy">privacy notice</Link>
        and <Link href="/page/terms-of-use">terms of use</Link>.
      </p>
      <p>
        Within 30 days of delivery, you may return new, unopened merchandise in
        its original condition. Exception and restrictions apply.{' '}
        <Link href="/page/returns-policy">
          See {APP_NAME} &apos;s Returns policy.
        </Link>
      </p>
    </div>
  );
}
