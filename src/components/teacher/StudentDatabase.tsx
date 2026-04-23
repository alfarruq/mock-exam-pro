import { useEffect, useMemo, useState } from "react";
import { Search, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Booking, loadBookings } from "@/lib/mockData";

export const StudentDatabase = () => {
  const { t } = useTranslation();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => setBookings(loadBookings()), []);

  const students = useMemo(() => {
    const map = new Map<string, { name: string; phone: string; pic: string; history: Booking[] }>();
    bookings.forEach((b) => {
      const existing = map.get(b.phone);
      if (existing) existing.history.push(b);
      else map.set(b.phone, { name: b.studentName, phone: b.phone, pic: b.profilePic, history: [b] });
    });
    return Array.from(map.values()).filter(
      (s) => s.name.toLowerCase().includes(query.toLowerCase()) || s.phone.includes(query)
    );
  }, [bookings, query]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t("teacher.students.title")}</h1>
        <p className="text-muted-foreground">{t("teacher.students.subtitle")}</p>
      </div>

      <div className="relative">
        <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input className="pl-9" placeholder={t("teacher.students.search")} value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>

      {students.length === 0 ? (
        <div className="bg-card rounded-2xl border border-border p-12 text-center shadow-[var(--shadow-card)]">
          <Users className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground">{t("teacher.students.empty")}</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {students.map((s) => {
            const completed = s.history.filter((h) => h.status === "completed");
            const avgSpeaking = completed.length
              ? (completed.reduce((a, b) => a + (b.speakingScore || 0), 0) / completed.length).toFixed(1)
              : "—";
            return (
              <div key={s.phone} className="bg-card rounded-2xl p-5 border border-border shadow-[var(--shadow-card)] flex items-center gap-4">
                <img src={s.pic} alt={s.name} className="h-14 w-14 rounded-full object-cover" />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold truncate">{s.name}</div>
                  <div className="text-sm text-muted-foreground truncate">{s.phone}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-muted-foreground uppercase">{t("teacher.students.exams")}</div>
                  <div className="font-semibold">{s.history.length}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-muted-foreground uppercase">{t("teacher.students.avgSpeaking")}</div>
                  <div className="font-semibold">{avgSpeaking}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
