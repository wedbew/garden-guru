'use client'

import { useTheme } from "next-themes"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Moon, Sun, Laptop, Check } from "lucide-react"
import { useTranslation } from '@/app/i18n/client'

export default function ThemeSwitcher({ 
  lng 
}: { 
  lng: string 
}) {
  const { theme, setTheme } = useTheme()
  const { t } = useTranslation(lng, 'common')

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="w-9 px-0">
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem 
          className="gap-2 cursor-pointer" 
          onClick={() => setTheme("light")}
        >
          <Sun className="h-4 w-4" />
          <span>{t('theme.light')}</span>
          {theme === "light" && (
            <Check className="h-4 w-4 ml-auto" />
          )}
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="gap-2 cursor-pointer" 
          onClick={() => setTheme("dark")}
        >
          <Moon className="h-4 w-4" />
          <span>{t('theme.dark')}</span>
          {theme === "dark" && (
            <Check className="h-4 w-4 ml-auto" />
          )}
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="gap-2 cursor-pointer" 
          onClick={() => setTheme("system")}
        >
          <Laptop className="h-4 w-4" />
          <span>{t('theme.system')}</span>
          {theme === "system" && (
            <Check className="h-4 w-4 ml-auto" />
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}