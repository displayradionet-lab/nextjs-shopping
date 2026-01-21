'use client'

import * as React from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { ColorProvider } from './color-provider'

export function ThemeProvider({
    children,
    ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
    return (
        <ColorProvider>
            <NextThemesProvider {...props}>
                {children}
            </NextThemesProvider>
        </ColorProvider>
    )
}