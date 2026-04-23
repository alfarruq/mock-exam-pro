// Mock data + localStorage persistence layer (simulates backend)

export type SlotStatus = "available" | "pending" | "booked";

export interface Slot {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  status: SlotStatus;
  bookingId?: string;
}

export interface Booking {
  id: string;
  slotId: string;
  studentName: string;
  phone: string;
  profilePic: string; // data URL
  receiptImage: string; // data URL
  status: "pending" | "approved" | "rejected" | "completed";
  createdAt: string;
  speakingScore?: number;
  generalScore?: number;
  feedback?: string;
}

const KEYS = {
  slots: "mock_slots_v1",
  bookings: "mock_bookings_v1",
};

// ---------- Seed ----------
const today = new Date();
const fmtDate = (d: Date) => d.toISOString().split("T")[0];

function seedSlots(): Slot[] {
  const slots: Slot[] = [];
  for (let day = 0; day < 5; day++) {
    const d = new Date(today);
    d.setDate(today.getDate() + day);
    const date = fmtDate(d);
    for (let h = 9; h < 17; h++) {
      ["00", "30"].forEach((m) => {
        slots.push({
          id: `${date}-${h}-${m}`,
          date,
          time: `${String(h).padStart(2, "0")}:${m}`,
          status: "available",
        });
      });
    }
  }
  // mark some demo statuses
  if (slots[2]) slots[2].status = "pending";
  if (slots[5]) slots[5].status = "booked";
  return slots;
}

function seedBookings(): Booking[] {
  const placeholder =
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
      `<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><rect width='200' height='200' fill='%23e0e7ff'/><text x='50%' y='50%' text-anchor='middle' dy='.3em' font-size='80' fill='%234f46e5'>S</text></svg>`
    );
  return [
    {
      id: "b1",
      slotId: "seed-1",
      studentName: "Maria Garcia",
      phone: "+1 555 0102",
      profilePic: placeholder,
      receiptImage: placeholder,
      status: "completed",
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      speakingScore: 7,
      generalScore: 7.5,
      feedback: "Great fluency. Work on linking words and pronunciation of 'th'.",
    },
    {
      id: "b2",
      slotId: "seed-2",
      studentName: "Ahmed Hassan",
      phone: "+1 555 0199",
      profilePic: placeholder,
      receiptImage: placeholder,
      status: "completed",
      createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
      speakingScore: 6,
      generalScore: 6.5,
      feedback: "Good vocabulary. Needs more practice with complex tenses.",
    },
  ];
}

// ---------- Storage helpers ----------
export function loadSlots(): Slot[] {
  const raw = localStorage.getItem(KEYS.slots);
  if (raw) return JSON.parse(raw);
  const seeded = seedSlots();
  localStorage.setItem(KEYS.slots, JSON.stringify(seeded));
  return seeded;
}

export function saveSlots(slots: Slot[]) {
  localStorage.setItem(KEYS.slots, JSON.stringify(slots));
}

export function loadBookings(): Booking[] {
  const raw = localStorage.getItem(KEYS.bookings);
  if (raw) return JSON.parse(raw);
  const seeded = seedBookings();
  localStorage.setItem(KEYS.bookings, JSON.stringify(seeded));
  return seeded;
}

export function saveBookings(bookings: Booking[]) {
  localStorage.setItem(KEYS.bookings, JSON.stringify(bookings));
}

// Teacher's mock card details
export const TEACHER_CARD = {
  bankName: "International Bank",
  cardNumber: "4532 1234 5678 9010",
  holder: "Prof. Sarah Mitchell",
  amount: "$45.00",
};

export const fileToDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
