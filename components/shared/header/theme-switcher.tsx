'use client';

import * as React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import useColorStore from '@/hooks/use-color-store';
import useIsMounted from '@/hooks/use-is-mounted';
import { ChevronDownIcon, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const { availableColors, color, setColor } = useColorStore(theme);
  const changeTheme = (value: string) => {
    setTheme(value);
  };
  const isMounted = useIsMounted();
 
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="header-button h-[41px]">
        {theme === 'dark' && isMounted ? (
          <div className="flex items-center gap-2">
            <Moon className="h-4 w-4" /> Dark <ChevronDownIcon />
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Sun className="h-4 w-4" /> Light <ChevronDownIcon />
          </div>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56 bg-white/90 text-black">
        <DropdownMenuLabel>Theme</DropdownMenuLabel>

        <DropdownMenuRadioGroup value={theme} onValueChange={changeTheme}>
          <DropdownMenuRadioItem value="dark">
            <Moon className='h-4 w-4 mr-1'/> Dark
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="light">
            <Sun className='h-4 w-4 mr-1'/> Light
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />

        <DropdownMenuLabel>Color</DropdownMenuLabel>

        <DropdownMenuRadioGroup
          value={color.name}
          onValueChange={(value) => setColor(value, true)}
          >
            {availableColors.map((c) => (
                <DropdownMenuRadioItem key={c.name} value={c.name}>
                    <div
                    style={{ backgroundColor: c.root['--primary'].startsWith('oklch') ? c.root['--primary'] : `hsl(${c.root['--primary']})` }}
                    className="w-4 h-4 rounded-full mr-1"
                    ></div>
                    {c.name}
                </DropdownMenuRadioItem>
            ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
