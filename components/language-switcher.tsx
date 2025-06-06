'use client'

import { useState, useEffect } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { GlobeIcon, Check } from "lucide-react"
import { useTranslation } from '@/app/i18n/client'
import { languages } from '@/app/i18n/settings'
import { useRouter } from 'next/navigation'

export default function LanguageSwitcher({ 
  lng 
}: { 
  lng: string 
}) {
  const router = useRouter()
  const { t, i18n } = useTranslation(lng, 'common')
  const [currentLang, setCurrentLang] = useState(lng)

  useEffect(() => {
    setCurrentLang(lng)
  }, [lng])

  const handleLanguageChange = (language: string) => {
    setCurrentLang(language)
    i18n.changeLanguage(language)
    router.push(`/${language}`)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <GlobeIcon className="h-4 w-4" />
          <span className="hidden sm:inline-block">
            {t(`languages.${currentLang}`)}
          </span>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-44">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language}
            className="gap-2 cursor-pointer"
            onClick={() => handleLanguageChange(language)}
          >
            <span>{t(`languages.${language}`)}</span>
            {language === currentLang && (
              <Check className="h-4 w-4 ml-auto" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}