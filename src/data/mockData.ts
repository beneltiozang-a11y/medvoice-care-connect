export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  avatar?: string;
}

export interface Appointment {
  id: string;
  date: string;
  time: string;
  doctor: string;
  doctorSpecialty: string;
  motif: string;
  status: "confirmed" | "pending" | "cancelled";
  notes?: string;
}

export interface CallRecord {
  id: string;
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

export const patient: Patient = {
  id: "1",
  firstName: "Marie",
  lastName: "Dupont",
};

export const appointments: Appointment[] = [
  {
    id: "1",
    date: "2026-03-05",
    time: "10:30",
    doctor: "Dr. Laurent Martin",
    doctorSpecialty: "Médecin généraliste",
    motif: "Suivi tensions artérielles",
    status: "confirmed",
  },
  {
    id: "2",
    date: "2026-03-12",
    time: "14:00",
    doctor: "Dr. Sophie Leclerc",
    doctorSpecialty: "Cardiologue",
    motif: "Bilan cardiaque annuel",
    status: "pending",
  },
  {
    id: "3",
    date: "2026-02-20",
    time: "09:00",
    doctor: "Dr. Laurent Martin",
    doctorSpecialty: "Médecin généraliste",
    motif: "Renouvellement ordonnance",
    status: "confirmed",
    notes: "Renouvellement traitement hypertension. Résultats satisfaisants.",
  },
  {
    id: "4",
    date: "2026-01-15",
    time: "11:00",
    doctor: "Dr. Sophie Leclerc",
    doctorSpecialty: "Cardiologue",
    motif: "Consultation douleurs thoraciques",
    status: "confirmed",
    notes: "Aucune anomalie détectée. Stress identifié comme cause probable.",
  },
  {
    id: "5",
    date: "2026-03-20",
    time: "16:30",
    doctor: "Dr. Ahmed Benali",
    doctorSpecialty: "Pneumologue",
    motif: "Toux persistante",
    status: "pending",
  },
];

export const calls: CallRecord[] = [
  {
    id: "1",
    date: "2026-02-27",
    duration: "8 min",
    motif: "Maux de tête récurrents",
    symptoms: ["Céphalées", "Fatigue", "Troubles visuels"],
    summary: "La patiente signale des maux de tête fréquents depuis 2 semaines, principalement en fin de journée. Associés à une fatigue générale et des troubles visuels occasionnels.",
    recommendations: ["Consulter un ophtalmologue", "Vérifier la tension artérielle", "Réduire le temps d'écran"],
    evolution: "worsening",
    urgencyScore: 6,
  },
  {
    id: "2",
    date: "2026-02-20",
    duration: "5 min",
    motif: "Suivi tension artérielle",
    symptoms: ["Hypertension légère", "Vertiges"],
    summary: "Suivi régulier de la tension. Valeurs légèrement au-dessus de la normale. Vertiges occasionnels le matin.",
    recommendations: ["Maintenir le traitement", "Mesurer la tension quotidiennement", "Réduire la consommation de sel"],
    evolution: "stable",
    urgencyScore: 3,
  },
  {
    id: "3",
    date: "2026-02-10",
    duration: "12 min",
    motif: "Douleurs thoraciques",
    symptoms: ["Douleurs thoraciques", "Anxiété", "Palpitations"],
    summary: "Épisodes de douleurs thoraciques signalés. L'analyse IA suggère une composante anxieuse importante. Pas de signe de gravité cardiaque.",
    recommendations: ["Consultation cardiologie", "Techniques de relaxation", "Éviter la caféine"],
    evolution: "improvement",
    urgencyScore: 7,
  },
  {
    id: "4",
    date: "2026-01-28",
    duration: "6 min",
    motif: "Toux persistante",
    symptoms: ["Toux sèche", "Irritation gorge"],
    summary: "Toux sèche depuis 10 jours. Pas de fièvre ni d'essoufflement. Probablement d'origine virale.",
    recommendations: ["Hydratation", "Miel et citron", "Consulter si persistance > 3 semaines"],
    evolution: "improvement",
    urgencyScore: 2,
  },
];

export const notifications: Notification[] = [
  { id: "1", type: "reminder", message: "RDV avec Dr. Martin dans 5 jours", date: "2026-02-28", read: false },
  { id: "2", type: "document", message: "Résultats d'analyse à télécharger", date: "2026-02-27", read: false },
  { id: "3", type: "alert", message: "Pensez à mesurer votre tension aujourd'hui", date: "2026-02-28", read: true },
  { id: "4", type: "reminder", message: "Renouvellement d'ordonnance à prévoir", date: "2026-02-26", read: true },
];

export const activeSymptoms = [
  { name: "Céphalées", severity: "modérée", evolution: "worsening" as const },
  { name: "Hypertension légère", severity: "légère", evolution: "stable" as const },
  { name: "Fatigue", severity: "légère", evolution: "stable" as const },
];
