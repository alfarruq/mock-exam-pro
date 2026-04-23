import { useEffect, useState } from "react";
import { Users, Calendar, CreditCard, TrendingUp } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Booking, Slot, loadBookings, loadSlots } from "@/lib/mockData";

const StatCard = ({ icon: Icon, label, value, color }: any) => (
  <div className="bg-card rounded-2xl p-6 border border-border shadow-[var(--shadow-card)]">
    <div className="flex items-center justify-between mb-3">
      <div className={`h-11 w-11 rounded-xl flex items-center justify-center ${color}`}>
        <Icon className="h-5 w-5" />
      </div>
      <TrendingUp className="h-4 w-4 text-muted-foreground" />
    </div>
    <div className="text-3xl font-bold">{value}</div>
    <div className="text-sm text-muted-foreground mt-1">{label}</div>
  </div>
);

export const Overview = () => {
  const { t } = useTranslation();
  const [slots, setSlots] = useState<Slot[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    setSlots(loadSlots());
    setBookings(loadBookings());
  }, []);

  const today = new Date().toISOString().split("T")[0];
  const totalStudents = new Set(bookings.map((b) => b.phone)).size;
  const todayExams = slots.filter((s) => s.date === today && s.status === "booked").length;
  const pendingPayments = bookings.filter((b) => b.status === "pending").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t("teacher.overview.title")}</h1>
        <p className="text-muted-foreground">{t("teacher.overview.welcome")}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon={Users} label={t("teacher.overview.totalStudents")} value={totalStudents} color="bg-accent text-accent-foreground" />
        <StatCard icon={Calendar} label={t("teacher.overview.todayExams")} value={todayExams} color="bg-success-soft text-success" />
        <StatCard icon={CreditCard} label={t("teacher.overview.pendingPayments")} value={pendingPayments} color="bg-warning-soft text-warning" />
      </div>
    </div>
  );
};
