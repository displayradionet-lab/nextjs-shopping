'use client';

import React, { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../ui/collapsible';
import useDeviceType from '@/hooks/use-device-type';
import { Button } from '../ui/button';


export default function CollapsibleOnMobile({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  const searchParams = useSearchParams();

  const deviceType = useDeviceType();
  const [open, setOpen] = React.useState(false);
  useEffect(() => {
    if (deviceType === 'mobile') setOpen(false);
    else if (deviceType === 'desktop') setOpen(true);
  }, [deviceType, searchParams]);
  if (deviceType === 'unknown') return null;
  return (
    <Collapsible open={open}>
      <CollapsibleTrigger asChild>
        {deviceType === 'mobile' && (
          <Button
            className="w-full"
            onClick={() => setOpen(!open)}
            variant={'outline'}
          >
            {title}
          </Button>
        )}
      </CollapsibleTrigger>
      <CollapsibleContent>{children}</CollapsibleContent>
    </Collapsible>
  );
}
