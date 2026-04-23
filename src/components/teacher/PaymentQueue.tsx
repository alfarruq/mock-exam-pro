import { useEffect, useState } from "react";
import { Check, X, Eye, Inbox } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Booking, loadBookings, loadSlots, saveBookings, saveSlots } from "@/lib/mockData";
import { toast } from "sonner";

export const PaymentQueue = () => {
  const { t } = useTranslation();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [viewing, setViewing] = useState<Booking | null>(null);

  const refresh = () => setBookings(loadBookings().filter((b) => b.status === "pending"));
  useEffect(refresh, []);

  const decide = (booking: Booking, approve: boolean) => {
    const all = loadBookings().map((b) =>
      b.id === booking.id ? { ...b, status: approve ? ("approved" as const) : ("rejected" as const) } : b
    );
    const slots = loadSlots().map((s) =>
      s.id === booking.slotId
        ? { ...s, status: approve ? ("booked" as const) : ("available" as const), bookingId: approve ? booking.id : undefined }
        : s
    );
    saveBookings(all);
    saveSlots(slots);
    toast.success(approve ? t("teacher.payments.approved") : t("teacher.payments.rejected"));
    refresh();
    setViewing(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t("teacher.payments.title")}</h1>
        <p className="text-muted-foreground">{t("teacher.payments.subtitle")}</p>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-card rounded-2xl border border-border p-12 text-center shadow-[var(--shadow-card)]">
          <Inbox className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground">{t("teacher.payments.empty")}</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {bookings.map((b) => (
            <div key={b.id} className="bg-card rounded-2xl p-5 border border-border shadow-[var(--shadow-card)] flex items-center gap-4">
              <img src={b.profilePic} alt={b.studentName} className="h-14 w-14 rounded-full object-cover" />
              <div className="flex-1 min-w-0">
                <div className="font-semibold truncate">{b.studentName}</div>
                <div className="text-sm text-muted-foreground truncate">{b.phone}</div>
              </div>
              <Button variant="outline" size="sm" onClick={() => setViewing(b)}>
                <Eye className="h-4 w-4 mr-1" />{t("teacher.payments.view")}
              </Button>
              <Button size="sm" onClick={() => decide(b, true)} className="bg-success hover:bg-success/90 text-success-foreground">
                <Check className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="destructive" onClick={() => decide(b, false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <Dialog open={!!viewing} onOpenChange={(v) => !v && setViewing(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t("teacher.payments.receiptOf")} — {viewing?.studentName}</DialogTitle>
          </DialogHeader>
          {viewing && (
            <div className="space-y-4">
              <img src={viewing.receiptImage} alt="receipt" className="w-full max-h-[60vh] object-contain rounded-lg border border-border" />
              <div className="flex gap-2">
                <Button variant="destructive" className="flex-1" onClick={() => decide(viewing, false)}>
                  <X className="h-4 w-4 mr-2" />{t("teacher.payments.reject")}
                </Button>
                <Button className="flex-1 bg-success hover:bg-success/90 text-success-foreground" onClick={() => decide(viewing, true)}>
                  <Check className="h-4 w-4 mr-2" />{t("teacher.payments.approve")}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
