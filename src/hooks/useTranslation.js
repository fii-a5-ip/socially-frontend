import { useApp } from '../context/AppContext';
import { ro } from '../locales/ro';
import { en } from '../locales/en';

const dictionaries = {
  RO: ro,
  EN: en,
};

export function useTranslation() {
  const { lang } = useApp();

  const t = (key) => {
    // 1. Get the requested dictionary
    const dictionary = dictionaries[lang] || dictionaries['RO'];
    
    // 2. Return the translation, or fallback to the key itself if not found
    return dictionary[key] || key;
  };

  return { t, lang };
}
