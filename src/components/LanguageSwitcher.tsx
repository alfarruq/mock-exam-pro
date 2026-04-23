import { Languages } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const LANGS = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "uz", label: "O'zbek", flag: "🇺🇿" },
  { code: "ru", label: "Русский", flag: "🇷🇺" },
];

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const current = LANGS.find((l) => l.code === i18n.language) || LANGS[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm font-medium hover:bg-muted transition-colors">
        <Languages className="h-4 w-4" />
        <span className="hidden sm:inline">{current.flag} {current.label}</span>
        <span className="sm:hidden">{current.flag}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {LANGS.map((l) => (
          <DropdownMenuItem
            key={l.code}
            onClick={() => i18n.changeLanguage(l.code)}
            className={i18n.language === l.code ? "bg-accent" : ""}
          >
            <span className="mr-2">{l.flag}</span>{l.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
