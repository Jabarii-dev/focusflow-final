import { useProfile } from '@/hooks/use-profile';
import { translations, LanguageCode, TranslationKey } from '@/lib/i18n';

export function useI18n() {
  const { language } = useProfile();

  // Normalize language input to supported codes
  const getLanguageCode = (lang: string): LanguageCode => {
    if (!lang) return 'en';
    const normalized = lang.toLowerCase();
    
    if (normalized === 'en' || normalized === 'english') return 'en';
    if (normalized === 'fr' || normalized === 'french' || normalized === 'français') return 'fr';
    if (normalized === 'es' || normalized === 'spanish' || normalized === 'español') return 'es';
    if (normalized === 'ha' || normalized === 'hausa') return 'ha';
    
    return 'en';
  };

  const currentLang = getLanguageCode(language);

  const t = (key: TranslationKey): string => {
    const langDict = translations[currentLang];
    const enDict = translations['en'];
    
    // Fallback to English if translation missing, then to key itself
    return langDict?.[key] || enDict[key] || key;
  };

  return { t, language: currentLang };
}
