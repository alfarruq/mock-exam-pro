import { useEffect, useState } from "react";
import { Plus, Trash, Clock } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slot, loadSlots, saveSlots } from "@/lib/mockData";
import { toast } from "sonner";

export const SlotManagement = () => {
  const { t } = useTranslation();
  const [slots, setSlots] = useState<Slot[]>([]);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [time, setTime] = useState("09:00");

  useEffect(() => setSlots(loadSlots()), []);

  const addSlot = () => {
    const id = `${date}-${time.replace(":", "-")}`;
    if (slots.some((s) => s.id === id)) {
      toast.error(t("teacher.slots.exists"));
      return;
    }
    const updated = [...slots, { id, date, time, status: "available" as const }];
    saveSlots(updated);
    setSlots(updated);
    toast.success(t("teacher.slots.opened"));
  };

  const removeSlot = (id: string) => {
    const slot = slots.find((s) => s.id === id);
    if (slot && slot.status !== "available") {
      toast.error(t("teacher.slots.cantRemove"));
      return;
    }
    const updated = slots.filter((s) => s.id !== id);
    saveSlots(updated);
    setSlots(updated);
  };

  const grouped = slots.reduce<Record<string, Slot[]>>((acc, s) => {
    (acc[s.date] = acc[s.date] || []).push(s);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t("teacher.slots.title")}</h1>
        <p className="text-muted-foreground">{t("teacher.slots.subtitle")}</p>
      </div>

      <div className="bg-card rounded-2xl p-6 border border-border shadow-[var(--shadow-card)]">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          <div>
            <Label>{t("teacher.slots.date")}</Label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div>
            <Label>{t("teacher.slots.time")}</Label>
            <Input type="time" step={1800} value={time} onChange={(e) => setTime(e.target.value)} />
          </div>
          <Button onClick={addSlot}><Plus className="h-4 w-4 mr-2" />{t("teacher.slots.openSlot")}</Button>
        </div>
      </div>

      <div className="space-y-4">
        {Object.entries(grouped).sort().map(([d, list]) => (
          <div key={d} className="bg-card rounded-2xl p-6 border border-border shadow-[var(--shadow-card)]">
            <div className="font-semibold mb-3">{d}</div>
            <div className="flex flex-wrap gap-2">
              {list.sort((a, b) => a.time.localeCompare(b.time)).map((s) => (
                <div
                  key={s.id}
                  className={`group flex items-center gap-2 rounded-lg border px-3 py-2 text-sm ${
                    s.status === "available"
                      ? "border-success/30 bg-success-soft text-success"
                      : s.status === "pending"
                      ? "border-warning/30 bg-warning-soft text-warning"
                      : "border-destructive/30 bg-danger-soft text-destructive"
                  }`}
                >
                  <Clock className="h-3 w-3" />
                  {s.time}
                  {s.status === "available" && (
                    <button onClick={() => removeSlot(s.id)} className="opacity-0 group-hover:opacity-100 transition">
                      <Trash className="h-3 w-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
