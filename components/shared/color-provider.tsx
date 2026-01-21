'use client'

import * as React from 'react'
import { useTheme } from 'next-themes'
import useColorStore from '@/hooks/use-color-store'

export function ColorProvider({
    children,
}: {
    children: React.ReactNode
}) {
    const { theme } = useTheme()
    const { color, updateCssVariables } = useColorStore(theme)
    
    React.useEffect(() => {    
        // Add a small delay to ensure theme is applied first
        const timer = setTimeout(() => {
            updateCssVariables()
        }, 100)
        return () => clearTimeout(timer)
    }, [theme, color])
    
    React.useEffect(() => {
        // Initial application
        updateCssVariables()
    }, [])
    
    // Also apply immediately when theme changes
    React.useEffect(() => {
        updateCssVariables()
    }, [theme])
    
    return <>{children}</>
}
