import { useState } from "react";
import { Search, Award, MessageSquare } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Booking, loadBookings } from "@/lib/mockData";

export const StudentResults = () => {
  const { t } = useTranslation();
  const [phone, setPhone] = useState("");
  const [results, setResults] = useState<Booking[] | null>(null);

  const search = () => {
    if (!phone.trim()) return;
    const all = loadBookings().filter(
      (b) => b.phone.replace(/\s/g, "") === phone.replace(/\s/g, "") && b.status === "completed"
    );
    setResults(all);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <section className="rounded-2xl p-8 bg-card border border-border shadow-[var(--shadow-card)]">
        <h1 className="text-2xl font-bold mb-2">{t("student.results.title")}</h1>
        <p className="text-muted-foreground mb-4">{t("student.results.subtitle")}</p>
        <div className="flex gap-2">
          <Input
            placeholder={t("student.results.phonePlaceholder")}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && search()}
          />
          <Button onClick={search}><Search className="h-4 w-4 mr-2" />{t("student.results.search")}</Button>
        </div>
      </section>

      {results && results.length === 0 && (
        <div className="text-center py-12 text-muted-foreground bg-card rounded-2xl border border-border">
          {t("student.results.empty")}
        </div>
      )}

      {results && results.length > 0 && (
        <div className="space-y-4">
          {results.map((b) => (
            <div key={b.id} className="bg-card rounded-2xl p-6 border border-border shadow-[var(--shadow-card)]">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="font-semibold text-lg">{b.studentName}</div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(b.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <Award className="h-6 w-6 text-primary" />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="rounded-lg bg-accent/50 p-4">
                  <div className="text-xs text-muted-foreground uppercase">{t("student.results.speaking")}</div>
                  <div className="text-2xl font-bold text-accent-foreground">{b.speakingScore}/9</div>
                </div>
                <div className="rounded-lg bg-accent/50 p-4">
                  <div className="text-xs text-muted-foreground uppercase">{t("student.results.general")}</div>
                  <div className="text-2xl font-bold text-accent-foreground">{b.generalScore}/9</div>
                </div>
              </div>
              {b.feedback && (
                <div className="rounded-lg bg-muted p-4">
                  <div className="flex items-center gap-2 text-sm font-medium mb-1">
                    <MessageSquare className="h-4 w-4" />{t("student.results.feedback")}
                  </div>
                  <p className="text-sm text-muted-foreground">{b.feedback}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
