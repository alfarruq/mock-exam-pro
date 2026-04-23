import { useState } from "react";
import { Camera, CreditCard, Check, Upload, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Booking,
  Slot,
  TEACHER_CARD,
  fileToDataUrl,
  loadBookings,
  loadSlots,
  saveBookings,
  saveSlots,
} from "@/lib/mockData";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onClose: () => void;
  slot: Slot | null;
  onComplete: () => void;
}

export const BookingModal = ({ open, onClose, slot, onComplete }: Props) => {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [profilePic, setProfilePic] = useState<string>("");
  const [receipt, setReceipt] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  const reset = () => {
    setStep(1); setName(""); setPhone(""); setProfilePic(""); setReceipt(""); setSubmitting(false);
  };
  const handleClose = () => { reset(); onClose(); };

  const handleProfile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    setProfilePic(await fileToDataUrl(f));
  };
  const handleReceipt = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    setReceipt(await fileToDataUrl(f));
  };

  const goToStep2 = () => {
    if (!name.trim() || !phone.trim()) {
      toast.error(t("booking.errFields"));
      return;
    }
    setStep(2);
  };

  const submitBooking = () => {
    if (!receipt) { toast.error(t("booking.errReceipt")); return; }
    if (!slot) return;
    setSubmitting(true);
    const slots = loadSlots();
    const bookings = loadBookings();
    const newBooking: Booking = {
      id: `b_${Date.now()}`,
      slotId: slot.id,
      studentName: name.trim(),
      phone: phone.trim(),
      profilePic,
      receiptImage: receipt,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    bookings.push(newBooking);
    const updatedSlots = slots.map((s) =>
      s.id === slot.id ? { ...s, status: "pending" as const, bookingId: newBooking.id } : s
    );
    saveBookings(bookings);
    saveSlots(updatedSlots);
    setTimeout(() => { setStep(3); setSubmitting(false); }, 600);
  };

  const finish = () => { handleClose(); onComplete(); };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {step === 1 && t("booking.step1")}
            {step === 2 && t("booking.step2")}
            {step === 3 && t("booking.step3")}
          </DialogTitle>
        </DialogHeader>

        <div className="flex items-center gap-2 mb-2">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex-1 flex items-center gap-2">
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  step >= s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                {step > s ? <Check className="h-4 w-4" /> : s}
              </div>
              {s < 3 && <div className={`h-1 flex-1 rounded ${step > s ? "bg-primary" : "bg-muted"}`} />}
            </div>
          ))}
        </div>

        {slot && (
          <div className="rounded-lg bg-accent/50 px-3 py-2 text-sm text-accent-foreground">
            {t("booking.slot")}: <strong>{slot.date}</strong> {t("booking.at")} <strong>{slot.time}</strong>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <div>
              <Label>{t("booking.fullName")}</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" />
            </div>
            <div>
              <Label>{t("booking.phone")}</Label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+998 90 123 45 67" />
            </div>
            <Button onClick={goToStep2} className="w-full">{t("booking.continue")}</Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="rounded-xl p-5 text-primary-foreground" style={{ background: "var(--gradient-primary)" }}>
              <div className="flex items-center justify-between mb-6">
                <CreditCard className="h-6 w-6" />
                <span className="text-xs uppercase opacity-80">{TEACHER_CARD.bankName}</span>
              </div>
              <div className="font-mono text-lg tracking-widest mb-4">{TEACHER_CARD.cardNumber}</div>
              <div className="flex justify-between text-sm">
                <div>
                  <div className="opacity-70 text-xs">{t("booking.holder")}</div>
                  <div>{TEACHER_CARD.holder}</div>
                </div>
                <div className="text-right">
                  <div className="opacity-70 text-xs">{t("booking.amount")}</div>
                  <div className="font-semibold">{TEACHER_CARD.amount}</div>
                </div>
              </div>
            </div>

            <div>
              <Label>{t("booking.receipt")}</Label>
              <label className="mt-1 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border p-6 cursor-pointer hover:bg-muted/50 transition-colors">
                {receipt ? (
                  <img src={receipt} alt="receipt" className="max-h-40 rounded" />
                ) : (
                  <>
                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                    <span className="text-sm text-muted-foreground">{t("booking.uploadReceipt")}</span>
                  </>
                )}
                <input type="file" accept="image/*" className="hidden" onChange={handleReceipt} />
              </label>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1">{t("booking.back")}</Button>
              <Button onClick={submitBooking} disabled={submitting} className="flex-1">
                {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {t("booking.submit")}
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="text-center py-6 space-y-4">
            <div className="mx-auto h-16 w-16 rounded-full bg-success-soft flex items-center justify-center">
              <Check className="h-8 w-8 text-success" />
            </div>
            <h3 className="text-lg font-semibold">{t("booking.successTitle")}</h3>
            <p className="text-muted-foreground text-sm">{t("booking.successMsg")}</p>
            <Button onClick={finish} className="w-full">{t("booking.done")}</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
