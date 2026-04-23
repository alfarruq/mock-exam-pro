import { useEffect, useMemo, useState } from "react";
import { Calendar, Clock } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Slot, loadSlots } from "@/lib/mockData";
import { BookingModal } from "./BookingModal";

export const StudentBooking = () => {
  const { t, i18n } = useTranslation();
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [modalSlot, setModalSlot] = useState<Slot | null>(null);

  const refresh = () => {
    const s = loadSlots();
    setSlots(s);
    if (!selectedDate && s.length) setSelectedDate(s[0].date);
  };

  useEffect(refresh, []);

  const dates = useMemo(() => Array.from(new Set(slots.map((s) => s.date))), [slots]);
  const daySlots = useMemo(
    () => slots.filter((s) => s.date === selectedDate).sort((a, b) => a.time.localeCompare(b.time)),
    [slots, selectedDate]
  );

  const locale = i18n.language === "uz" ? "uz-UZ" : i18n.language === "ru" ? "ru-RU" : "en-US";

  const statusStyle = (status: Slot["status"]) => {
    switch (status) {
      case "available":
        return "bg-success-soft border-success/30 text-success hover:bg-success hover:text-success-foreground cursor-pointer";
      case "pending":
        return "bg-warning-soft border-warning/30 text-warning cursor-not-allowed";
      case "booked":
        return "bg-danger-soft border-destructive/30 text-destructive cursor-not-allowed";
    }
  };

  return (
    <div className="space-y-6">
      <section
        className="rounded-2xl p-8 text-primary-foreground"
        style={{ background: "var(--gradient-hero)" }}
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-2">{t("student.hero.title")}</h1>
        <p className="opacity-80">{t("student.hero.subtitle")}</p>
      </section>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {dates.map((d) => {
          const date = new Date(d);
          const isActive = d === selectedDate;
          return (
            <button
              key={d}
              onClick={() => setSelectedDate(d)}
              className={`flex-shrink-0 rounded-xl px-4 py-3 border transition-all ${
                isActive
                  ? "bg-primary text-primary-foreground border-primary shadow-[var(--shadow-elegant)]"
                  : "bg-card border-border hover:border-primary/40"
              }`}
            >
              <div className="text-xs uppercase opacity-70">
                {date.toLocaleDateString(locale, { weekday: "short" })}
              </div>
              <div className="text-lg font-semibold">{date.getDate()}</div>
              <div className="text-xs">{date.toLocaleDateString(locale, { month: "short" })}</div>
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-4 text-sm">
        <span className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-success" />{t("student.legend.available")}</span>
        <span className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-warning" />{t("student.legend.pending")}</span>
        <span className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-destructive" />{t("student.legend.booked")}</span>
      </div>

      <div className="bg-card rounded-2xl p-6 shadow-[var(--shadow-card)] border border-border">
        <div className="flex items-center gap-2 mb-4 text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span className="text-sm">{selectedDate}</span>
        </div>
        {daySlots.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">{t("student.noSlots")}</div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {daySlots.map((slot) => (
              <button
                key={slot.id}
                disabled={slot.status !== "available"}
                onClick={() => setModalSlot(slot)}
                className={`rounded-lg border-2 px-3 py-4 text-sm font-medium transition-all flex flex-col items-center gap-1 ${statusStyle(slot.status)}`}
              >
                <Clock className="h-4 w-4" />
                {slot.time}
              </button>
            ))}
          </div>
        )}
      </div>

      <BookingModal
        open={!!modalSlot}
        slot={modalSlot}
        onClose={() => setModalSlot(null)}
        onComplete={refresh}
      />
    </div>
  );
};
