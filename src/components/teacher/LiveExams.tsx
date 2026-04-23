import { useEffect, useRef, useState } from "react";
import { Play, Square, Clock, Save, CalendarX } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Booking, Slot, loadBookings, loadSlots, saveBookings } from "@/lib/mockData";
import { toast } from "sonner";

interface LiveItem {
  slot: Slot;
  booking: Booking;
}

export const LiveExams = () => {
  const { t } = useTranslation();
  const [items, setItems] = useState<LiveItem[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(30 * 60);
  const intervalRef = useRef<number | null>(null);

  const [speaking, setSpeaking] = useState("");
  const [general, setGeneral] = useState("");
  const [feedback, setFeedback] = useState("");

  const refresh = () => {
    const today = new Date().toISOString().split("T")[0];
    const slots = loadSlots().filter((s) => s.date === today && s.status === "booked");
    const bookings = loadBookings();
    const list: LiveItem[] = [];
    slots.forEach((s) => {
      const b = bookings.find((bk) => bk.id === s.bookingId);
      if (b) list.push({ slot: s, booking: b });
    });
    setItems(list);
  };

  useEffect(refresh, []);

  useEffect(() => {
    if (activeId) {
      intervalRef.current = window.setInterval(() => {
        setSecondsLeft((s) => Math.max(0, s - 1));
      }, 1000);
      return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }
  }, [activeId]);

  const startExam = (id: string) => {
    setActiveId(id);
    setSecondsLeft(30 * 60);
    setSpeaking(""); setGeneral(""); setFeedback("");
  };

  const stopExam = () => {
    setActiveId(null);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const saveResults = () => {
    if (!activeId) return;
    const item = items.find((i) => i.booking.id === activeId);
    if (!item) return;
    if (!speaking || !general) { toast.error(t("teacher.live.enterScores")); return; }
    const all = loadBookings().map((b) =>
      b.id === item.booking.id
        ? { ...b, status: "completed" as const, speakingScore: Number(speaking), generalScore: Number(general), feedback }
        : b
    );
    saveBookings(all);
    toast.success(t("teacher.live.saved"));
    stopExam();
    refresh();
  };

  const mins = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const secs = String(secondsLeft % 60).padStart(2, "0");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t("teacher.live.title")}</h1>
        <p className="text-muted-foreground">{t("teacher.live.subtitle")}</p>
      </div>

      {items.length === 0 ? (
        <div className="bg-card rounded-2xl border border-border p-12 text-center shadow-[var(--shadow-card)]">
          <CalendarX className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground">{t("teacher.live.empty")}</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {items.map(({ slot, booking }) => {
            const isActive = activeId === booking.id;
            return (
              <div
                key={booking.id}
                className={`bg-card rounded-2xl border p-5 shadow-[var(--shadow-card)] ${
                  isActive ? "border-primary ring-2 ring-primary/20" : "border-border"
                }`}
              >
                <div className="flex items-center gap-4">
                  <img src={booking.profilePic} alt="" className="h-14 w-14 rounded-full object-cover" />
                  <div className="flex-1">
                    <div className="font-semibold">{booking.studentName}</div>
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />{slot.time}
                    </div>
                  </div>
                  {isActive ? (
                    <>
                      <div className="font-mono text-2xl font-bold text-primary tabular-nums">
                        {mins}:{secs}
                      </div>
                      <Button variant="outline" size="sm" onClick={stopExam}>
                        <Square className="h-4 w-4 mr-1" />{t("teacher.live.stop")}
                      </Button>
                    </>
                  ) : (
                    <Button size="sm" onClick={() => startExam(booking.id)}>
                      <Play className="h-4 w-4 mr-1" />{t("teacher.live.start")}
                    </Button>
                  )}
                </div>

                {isActive && (
                  <div className="mt-5 pt-5 border-t border-border space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>{t("teacher.live.speakingScore")}</Label>
                        <Input type="number" min={0} max={9} step={0.5} value={speaking} onChange={(e) => setSpeaking(e.target.value)} />
                      </div>
                      <div>
                        <Label>{t("teacher.live.generalScore")}</Label>
                        <Input type="number" min={0} max={9} step={0.5} value={general} onChange={(e) => setGeneral(e.target.value)} />
                      </div>
                    </div>
                    <div>
                      <Label>{t("teacher.live.feedbackNotes")}</Label>
                      <Textarea rows={3} value={feedback} onChange={(e) => setFeedback(e.target.value)} placeholder={t("teacher.live.feedbackPh")} />
                    </div>
                    <Button onClick={saveResults} className="w-full">
                      <Save className="h-4 w-4 mr-2" />{t("teacher.live.save")}
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
