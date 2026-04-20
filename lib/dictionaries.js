import 'server-only';

const dictionaries = {
  en: () => import('../dictionaries/en.json').then((module) => module.default),
  id: () => import('../dictionaries/id.json').then((module) => module.default),
  zh: () => import('../dictionaries/zh.json').then((module) => module.default),
};

export const getDictionary = async (locale) => {
  if (dictionaries[locale]) {
    return dictionaries[locale]();
  }
  return dictionaries['en'](); // Fallback to English
};
