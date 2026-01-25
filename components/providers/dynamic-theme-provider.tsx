"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes"
import { usePathname } from "next/navigation"

export function DynamicThemeProvider({ children, ...props }: ThemeProviderProps) {
    const pathname = usePathname();
    const isAdmin = pathname?.startsWith("/admin");

    // If in admin, allow theme switching (inherit props).
    // If public, force light theme.
    const forcedTheme = isAdmin ? undefined : "light";

    return (
        <NextThemesProvider {...props} forcedTheme={forcedTheme}>
            {children}
        </NextThemesProvider>
    )
}
