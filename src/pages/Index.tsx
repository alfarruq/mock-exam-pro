import { useState } from "react";
import { GraduationCap, ShieldCheck, CalendarCheck, Award, LayoutDashboard, CalendarPlus, CreditCard, Radio, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import { StudentBooking } from "@/components/student/StudentBooking";
import { StudentResults } from "@/components/student/StudentResults";
import { Overview } from "@/components/teacher/Overview";
import { SlotManagement } from "@/components/teacher/SlotManagement";
import { PaymentQueue } from "@/components/teacher/PaymentQueue";
import { LiveExams } from "@/components/teacher/LiveExams";
import { StudentDatabase } from "@/components/teacher/StudentDatabase";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

type Role = "student" | "teacher";
type StudentTab = "book" | "results";
type TeacherTab = "overview" | "slots" | "payments" | "live" | "students";

const Index = () => {
  const { t } = useTranslation();
  const [role, setRole] = useState<Role>("student");
  const [studentTab, setStudentTab] = useState<StudentTab>("book");
  const [teacherTab, setTeacherTab] = useState<TeacherTab>("overview");

  const studentTabs = [
    { id: "book" as const, label: t("student.tabs.book"), icon: CalendarCheck },
    { id: "results" as const, label: t("student.tabs.results"), icon: Award },
  ];
  const teacherTabs = [
    { id: "overview" as const, label: t("teacher.tabs.overview"), icon: LayoutDashboard },
    { id: "slots" as const, label: t("teacher.tabs.slots"), icon: CalendarPlus },
    { id: "payments" as const, label: t("teacher.tabs.payments"), icon: CreditCard },
    { id: "live" as const, label: t("teacher.tabs.live"), icon: Radio },
    { id: "students" as const, label: t("teacher.tabs.students"), icon: Users },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 bg-card/80 backdrop-blur border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div
              className="h-9 w-9 rounded-xl flex items-center justify-center text-primary-foreground"
              style={{ background: "var(--gradient-primary)" }}
            >
              <GraduationCap className="h-5 w-5" />
            </div>
            <div className="font-bold hidden sm:block">{t("brand")}</div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 p-1 rounded-xl bg-muted">
              <button
                onClick={() => setRole("student")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  role === "student" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
                }`}
              >
                <GraduationCap className="h-4 w-4" />
                <span className="hidden sm:inline">{t("role.student")}</span>
              </button>
              <button
                onClick={() => setRole("teacher")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  role === "teacher" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
                }`}
              >
                <ShieldCheck className="h-4 w-4" />
                <span className="hidden sm:inline">{t("role.teacher")}</span>
              </button>
            </div>
            <LanguageSwitcher />
          </div>
        </div>

        <div className="container mx-auto px-4 pb-2 flex gap-1 overflow-x-auto">
          {(role === "student" ? studentTabs : teacherTabs).map((tab) => {
            const active = role === "student" ? studentTab === tab.id : teacherTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() =>
                  role === "student" ? setStudentTab(tab.id as StudentTab) : setTeacherTab(tab.id as TeacherTab)
                }
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  active ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <tab.icon className="h-4 w-4" />{tab.label}
              </button>
            );
          })}
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 md:py-8 max-w-6xl">
        {role === "student" && studentTab === "book" && <StudentBooking />}
        {role === "student" && studentTab === "results" && <StudentResults />}
        {role === "teacher" && teacherTab === "overview" && <Overview />}
        {role === "teacher" && teacherTab === "slots" && <SlotManagement />}
        {role === "teacher" && teacherTab === "payments" && <PaymentQueue />}
        {role === "teacher" && teacherTab === "live" && <LiveExams />}
        {role === "teacher" && teacherTab === "students" && <StudentDatabase />}
      </main>
    </div>
  );
};

export default Index;
