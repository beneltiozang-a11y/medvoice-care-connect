import { format } from "date-fns";

const today = format(new Date(), "yyyy-MM-dd");

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  phone: string;
  email: string;
  bloodType: string;
  allergies: string[];
  antecedents: string[];
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  time: string;
  doctor: string;
  doctorSpecialty: string;
  motif: string;
  status: "upcoming" | "in-progress" | "done";
  notes?: string;
  aiSummary?: string;
}

export interface CallRecord {
  id: string;
  patientId: string;
  appointmentId?: string;
  date: string;
  duration: string;
  motif: string;
  symptoms: string[];
  summary: string;
  recommendations: string[];
  evolution: "improvement" | "worsening" | "stable";
  urgencyScore: number;
}

export interface Notification {
  id: string;
  type: "reminder" | "document" | "alert";
  message: string;
  date: string;
  read: boolean;
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

export interface Prescription {
  medications: Medication[];
  additionalAdvice: string[];
}

export interface TranscriptMessage {
  role: "doctor" | "patient";
  text: string;
  timestamp?: string;
}

export interface PastAppointment {
  date: string;
  motif: string;
  doctor: string;
  summary: string;
}

// ─── Patients ───

export const patients: Patient[] = [
  {
    id: "1",
    firstName: "Marie",
    lastName: "Dupont",
    dateOfBirth: "1978-06-15",
    phone: "+1 555-123-4567",
    email: "marie.dupont@email.com",
    bloodType: "A+",
    allergies: ["Penicillin", "Peanuts"],
    antecedents: [
      "Arterial hypertension (since 2019)",
      "Appendectomy (2005)",
      "Right wrist fracture (2012)",
      "Family history: type 2 diabetes (father)",
    ],
  },
  {
    id: "2",
    firstName: "Jean",
    lastName: "Martin",
    dateOfBirth: "1985-03-22",
    phone: "+1 555-987-6543",
    email: "jean.martin@email.com",
    bloodType: "O-",
    allergies: ["Aspirin"],
    antecedents: ["Chronic asthma (since 2010)", "Left ankle sprain (2018)"],
  },
  {
    id: "3",
    firstName: "Sophie",
    lastName: "Bernard",
    dateOfBirth: "1992-11-08",
    phone: "+1 555-444-3322",
    email: "sophie.bernard@email.com",
    bloodType: "B+",
    allergies: [],
    antecedents: ["Chronic migraine (since 2020)"],
  },
];

export const patient = patients[0]; // backward compat

// ─── Today's Appointments ───

export const appointments: Appointment[] = [
  {
    id: "1",
    patientId: "1",
    patientName: "Marie Dupont",
    date: today,
    time: "09:00",
    doctor: "Dr. Laurent Martin",
    doctorSpecialty: "General Practitioner",
    motif: "Blood pressure follow-up",
    status: "done",
    aiSummary:
      "The patient called for a blood pressure follow-up. She mentions morning dizziness for the past week. The agent recommended maintaining the current treatment and bringing blood pressure readings from the last 2 weeks.",
  },
  {
    id: "2",
    patientId: "2",
    patientName: "Jean Martin",
    date: today,
    time: "10:30",
    doctor: "Dr. Laurent Martin",
    doctorSpecialty: "General Practitioner",
    motif: "Recurring asthma attacks",
    status: "upcoming",
    aiSummary:
      "The patient reports an increase in asthma attack frequency, especially at night. He uses his rescue inhaler 3-4 times per week instead of once. No recent environmental changes.",
  },
  {
    id: "3",
    patientId: "3",
    patientName: "Sophie Bernard",
    date: today,
    time: "11:30",
    doctor: "Dr. Laurent Martin",
    doctorSpecialty: "General Practitioner",
    motif: "Persistent migraines",
    status: "upcoming",
    aiSummary:
      "The patient suffers from migraines 4 to 5 times a week for the past month, with photophobia and nausea. Current treatment (acetaminophen) is no longer sufficient. She requests a therapeutic adjustment.",
  },
  {
    id: "4",
    patientId: "1",
    patientName: "Marie Dupont",
    date: today,
    time: "14:00",
    doctor: "Dr. Laurent Martin",
    doctorSpecialty: "General Practitioner",
    motif: "Persistent cough",
    status: "upcoming",
    aiSummary:
      "The patient has been coughing for 3 weeks. Dry, non-productive cough, no fever. Non-smoker. The agent recommended a consultation for further investigation.",
  },
  {
    id: "5",
    patientId: "2",
    patientName: "Jean Martin",
    date: today,
    time: "15:30",
    doctor: "Dr. Laurent Martin",
    doctorSpecialty: "General Practitioner",
    motif: "Lower back pain",
    status: "upcoming",
    aiSummary:
      "The patient describes lower back pain for 2 weeks, radiating to the right leg. Onset after a lifting effort. No loss of sensation.",
  },
];

// ─── Past appointments per patient ───

export const pastAppointments: Record<string, PastAppointment[]> = {
  "1": [
    { date: "2026-02-15", motif: "Prescription renewal", doctor: "Dr. Martin", summary: "Hypertension treatment renewal. Satisfactory results." },
    { date: "2026-01-20", motif: "Chest pain", doctor: "Dr. Leclerc", summary: "Normal cardiac assessment. Stress identified as probable cause." },
    { date: "2025-11-10", motif: "Annual checkup", doctor: "Dr. Martin", summary: "Complete blood panel. Slightly elevated cholesterol." },
  ],
  "2": [
    { date: "2026-02-01", motif: "Asthma attack", doctor: "Dr. Martin", summary: "Moderate attack. Ventolin dosage adjustment." },
    { date: "2025-12-15", motif: "Respiratory assessment", doctor: "Dr. Benali", summary: "Satisfactory pulmonary function tests. Maintenance therapy continued." },
  ],
  "3": [
    { date: "2026-01-28", motif: "Migraines", doctor: "Dr. Martin", summary: "Sumatriptan prescription. Headache diary started." },
  ],
};

// ─── Call records ───

export const calls: CallRecord[] = [
  {
    id: "1",
    patientId: "1",
    appointmentId: "1",
    date: "2026-02-27",
    duration: "8 min",
    motif: "Appointment booking — BP follow-up",
    symptoms: ["Morning dizziness", "Headaches"],
    summary: "The patient contacted the assistant to schedule a blood pressure follow-up.",
    recommendations: ["Measure blood pressure morning and evening", "Bring readings to the appointment"],
    evolution: "stable",
    urgencyScore: 4,
  },
  {
    id: "2",
    patientId: "2",
    appointmentId: "2",
    date: "2026-02-26",
    duration: "6 min",
    motif: "Appointment booking — Asthma",
    symptoms: ["Nocturnal dyspnea", "Wheezing"],
    summary: "The patient reports an increase in nocturnal asthma attacks.",
    recommendations: ["Avoid allergens", "Use peak flow meter daily"],
    evolution: "worsening",
    urgencyScore: 5,
  },
];

// ─── Mock transcript for consultation simulation ───

export const mockTranscriptSteps: TranscriptMessage[] = [
  { role: "patient", text: "Hello doctor, I've had a sore throat for 3 days.", timestamp: "00:00" },
  { role: "doctor", text: "Hello. Can you describe the pain? Is it constant?", timestamp: "00:12" },
  { role: "patient", text: "Yes, it's constant and it gets worse when I swallow.", timestamp: "00:25" },
  { role: "doctor", text: "Do you have a fever?", timestamp: "00:35" },
  { role: "patient", text: "Yes, around 38.5°C last night.", timestamp: "00:42" },
  { role: "doctor", text: "Any swollen lymph nodes in your neck?", timestamp: "00:55" },
  { role: "patient", text: "I think so, it's tender when I press on it.", timestamp: "01:05" },
  { role: "doctor", text: "How long exactly has this been going on?", timestamp: "01:18" },
  { role: "patient", text: "It started on Monday, so 3 days.", timestamp: "01:28" },
  { role: "doctor", text: "Alright. I'm going to examine you. Open your mouth.", timestamp: "01:40" },
];

export const mockAIPrescription: Prescription = {
  medications: [
    { name: "Amoxicillin", dosage: "1g", frequency: "3 times daily", duration: "6 days" },
    { name: "Acetaminophen", dosage: "1000mg", frequency: "Every 6h as needed for pain", duration: "5 days" },
    { name: "Hexaspray", dosage: "2 sprays", frequency: "3 times daily", duration: "5 days" },
  ],
  additionalAdvice: [
    "Vocal rest recommended",
    "Stay well hydrated (at least 1.5L/day)",
    "Avoid irritating foods",
    "Follow up if fever persists beyond 48h",
  ],
};

export const mockDiagnoses = [
  "Bacterial tonsillitis (probable streptococcal)",
  "Acute pharyngitis",
  "Upper respiratory tract viral infection",
];

export const notifications: Notification[] = [
  { id: "1", type: "reminder", message: "Appointment with Marie Dupont in 30 min", date: today, read: false },
  { id: "2", type: "alert", message: "Lab results for Jean Martin available", date: today, read: false },
  { id: "3", type: "document", message: "Prescription awaiting signature", date: today, read: true },
];
