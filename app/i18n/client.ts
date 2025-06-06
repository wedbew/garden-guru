// app/i18n/client.ts
'use client'

import { useEffect, useState } from 'react'
import i18next, { FlatNamespace, KeyPrefix } from 'i18next'
import { 
  initReactI18next, 
  useTranslation as useTranslationOrg, 
  UseTranslationOptions,
  UseTranslationResponse,
  FallbackNs 
} from 'react-i18next'
import { useCookies } from 'react-cookie'
import resourcesToBackend from 'i18next-resources-to-backend'
import LanguageDetector from 'i18next-browser-languagedetector'
import { getOptions, languages, cookieName } from './settings'

const runsOnServerSide = typeof window === 'undefined'

i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(resourcesToBackend((language: string, namespace: string) => 
    import(`./locales/${language}/${namespace}.json`)
  ))
  .init({
    ...getOptions(),
    lng: undefined,
    detection: {
      order: ['path', 'htmlTag', 'cookie', 'navigator'],
    },
    preload: runsOnServerSide ? languages : []
  })

type ExtendedUseTranslationResponse<
  Ns extends FlatNamespace,
  KPrefix extends KeyPrefix<FallbackNs<Ns>>
> = UseTranslationResponse<FallbackNs<Ns>, KPrefix> & {
  isLoading: boolean;
}

function createExtendedResponse<
  Ns extends FlatNamespace,
  KPrefix extends KeyPrefix<FallbackNs<Ns>>
>(
  response: UseTranslationResponse<FallbackNs<Ns>, KPrefix>,
  isLoading: boolean
): ExtendedUseTranslationResponse<Ns, KPrefix> {
  const { t, i18n, ready } = response
  const extendedResponse = [t, i18n, ready] as UseTranslationResponse<FallbackNs<Ns>, KPrefix>
  Object.assign(extendedResponse, response, { isLoading })
  return extendedResponse as ExtendedUseTranslationResponse<Ns, KPrefix>
}

export function useTranslation<
  Ns extends FlatNamespace,
  KPrefix extends KeyPrefix<FallbackNs<Ns>> = undefined
>(
  lng: string,
  ns?: Ns,
  options?: UseTranslationOptions<KPrefix>
): ExtendedUseTranslationResponse<Ns, KPrefix> {
  const [cookies, setCookie] = useCookies([cookieName])
  const [isLoading, setIsLoading] = useState(false)
  const response = useTranslationOrg(ns, options)
  const { i18n } = response
  const [activeLng, setActiveLng] = useState(i18n.resolvedLanguage)

  useEffect(() => {
    if (activeLng === i18n.resolvedLanguage) return
    setActiveLng(i18n.resolvedLanguage)
  }, [activeLng, i18n.resolvedLanguage])

  useEffect(() => {
    const changeLang = async () => {
      if (!lng || i18n.resolvedLanguage === lng) return
      setIsLoading(true)
      await i18n.changeLanguage(lng)
      setIsLoading(false)
    }
    
    changeLang()
  }, [lng, i18n])

  useEffect(() => {
    if (cookies.i18next === lng || !lng) return
    setCookie(cookieName, lng, { path: '/' })
  }, [lng, cookies.i18next, setCookie])

  if (runsOnServerSide && lng && i18n.resolvedLanguage !== lng) {
    i18n.changeLanguage(lng)
    return createExtendedResponse(response, isLoading)
  }

  return createExtendedResponse(response, isLoading)
}

export const changeLanguage = async (
  lang: string, 
  options?: Parameters<typeof i18next.changeLanguage>[1]
) => {
  if (!languages.includes(lang)) {
    console.warn(`Language ${lang} is not supported`)
    return
  }
  return i18next.changeLanguage(lang, options)
}

export { i18next }