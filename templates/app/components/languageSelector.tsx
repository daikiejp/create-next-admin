'use client';

import { setUserLocale } from '@/services/locale';
import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function LanguageSelector() {
  const languages = [
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Español' },
    { code: 'ja', label: '日本語' },
  ];

  const locale = useLocale();
  const [currentLocale, setCurrentLocale] = useState<string>(locale);

  useEffect(() => {
    setCurrentLocale(locale);
  }, [locale]);

  const handleSelectChange = async (value: string) => {
    const newLocale = value as 'en' | 'es' | 'ja';
    await setUserLocale(newLocale);
    setCurrentLocale(newLocale);
  };

  const currentLanguage =
    languages.find((lang) => lang.code === currentLocale) || languages[0];

  const sortedLanguages = [
    currentLanguage,
    ...languages.filter((lang) => lang.code !== currentLocale),
  ];

  return (
    <Select onValueChange={handleSelectChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={currentLanguage.label} />
      </SelectTrigger>
      <SelectContent>
        {sortedLanguages.map((lang) => (
          <SelectItem key={lang.code} value={lang.code}>
            {lang.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
