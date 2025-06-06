import { createInstance, FlatNamespace, KeyPrefix, TFunction, i18n } from 'i18next'
import resourcesToBackend from 'i18next-resources-to-backend'
import { initReactI18next } from 'react-i18next/initReactI18next'
import { FallbackNs } from 'react-i18next'
import { getOptions } from './settings'

const initI18next = async (lng: string, ns?: string | string[]) => {
  const i18nInstance = createInstance()
  await i18nInstance
    .use(initReactI18next)
    .use(resourcesToBackend((language: string, namespace: string) => import(`./locales/${language}/${namespace}.json`)))
    .init(getOptions(lng, ns))
  return i18nInstance
}

type NonNullable<T> = T extends null | undefined ? never : T;

export async function useTranslation<
  Ns extends NonNullable<FlatNamespace>,
  KPrefix extends KeyPrefix<FallbackNs<Ns>> = undefined
>(
  lng: string,
  ns?: Ns,
  options: { keyPrefix?: KPrefix } = {}
): Promise<{
  t: TFunction<Ns, KPrefix>;
  i18n: i18n;
}> {
  const i18nextInstance = await initI18next(
    lng, 
    ns ? (Array.isArray(ns) ? ns : [ns]) : undefined
  )
  
  return {
    t: i18nextInstance.getFixedT(lng, ns, options.keyPrefix),
    i18n: i18nextInstance
  }
}