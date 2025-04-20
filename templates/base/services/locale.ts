"use server";

import { cookies, headers } from "next/headers";
import { Locale, defaultLocale } from "@/i18n/config";

const COOKIE_NAME = "NEXT_LOCALE";

export async function getUserLocale() {
  const headersList = await headers();
  const userAgent = headersList.get("accept-language");
  const rawLocale = userAgent?.split(",")[0].split(";")[0].trim();
  const languageCode = rawLocale?.split("-")[0];

  return (
    (await cookies()).get(COOKIE_NAME)?.value || languageCode || defaultLocale
  );
}

export async function setUserLocale(locale: Locale) {
  (await cookies()).set(COOKIE_NAME, locale);
}
