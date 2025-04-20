import LanguageSelector from "@/components/languageSelector";
import LogoutButton from "@/components/logoutButton";
import { ThemeToggle } from "@/components/themeToggle";
import { useTranslations } from "next-intl";

export default function Dashboard() {
  const t = useTranslations("Dashboard");
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        {t("title")}
        <LogoutButton />
      </main>

      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <LanguageSelector />
        <ThemeToggle />
      </footer>
    </div>
  );
}
