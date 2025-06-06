'use client'

import { ThemeProvider as NextThemesProvider } from "next-themes"
import { ReactNode } from 'react'
import { TooltipProvider } from "@/components/ui/tooltip";

export function Providers({ children, ...props } : { children: ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      {...props}
    >
      <TooltipProvider>
        {children}
      </TooltipProvider>
    </NextThemesProvider>
  )
}