export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  avatar?: string;
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
  date: string;
  time: string;
  doctor: string;
  doctorSpecialty: string;
  motif: string;
  status: "confirmed" | "pending" | "cancelled";
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

export const patient: Patient = {
  id: "1",
  firstName: "Marie",
  lastName: "Dupont",
  dateOfBirth: "1978-06-15",
  phone: "06 12 34 56 78",
  email: "marie.dupont@email.com",
  bloodType: "A+",
  allergies: ["Pénicilline", "Arachides"],
  antecedents: [
    "Hypertension artérielle (depuis 2019)",
    "Appendicectomie (2005)",
    "Fracture poignet droit (2012)",
    "Antécédents familiaux : diabète type 2 (père)",
  ],
};

export const appointments: Appointment[] = [
  {
    id: "1",
    patientId: "1",
    date: "2026-03-05",
    time: "10:30",
    doctor: "Dr. Laurent Martin",
    doctorSpecialty: "Médecin généraliste",
    motif: "Suivi tensions artérielles",
    status: "confirmed",
    aiSummary:
      "La patiente a appelé pour un suivi de sa tension artérielle. Elle mentionne des vertiges matinaux depuis 1 semaine. L'agent a recommandé de maintenir le traitement actuel et de venir avec ses relevés tensionnels des 2 dernières semaines.",
  },
  {
    id: "2",
    patientId: "1",
    date: "2026-03-12",
    time: "14:00",
    doctor: "Dr. Sophie Leclerc",
    doctorSpecialty: "Cardiologue",
    motif: "Bilan cardiaque annuel",
    status: "pending",
    aiSummary:
      "Appel de prise de rendez-vous pour le bilan annuel. La patiente signale des palpitations occasionnelles, sans douleur thoracique associée. L'agent a programmé un bilan complet incluant ECG et échocardiographie.",
  },
  {
    id: "3",
    patientId: "1",
    date: "2026-02-20",
    time: "09:00",
    doctor: "Dr. Laurent Martin",
    doctorSpecialty: "Médecin généraliste",
    motif: "Renouvellement ordonnance",
    status: "confirmed",
    notes: "Renouvellement traitement hypertension. Résultats satisfaisants.",
    aiSummary:
      "Demande de renouvellement de l'ordonnance pour Amlodipine 5mg. Pas de nouveaux symptômes signalés. Tension stable selon la patiente.",
  },
  {
    id: "4",
    patientId: "1",
    date: "2026-01-15",
    time: "11:00",
    doctor: "Dr. Sophie Leclerc",
    doctorSpecialty: "Cardiologue",
    motif: "Consultation douleurs thoraciques",
    status: "confirmed",
    notes: "Aucune anomalie détectée. Stress identifié comme cause probable.",
    aiSummary:
      "La patiente a décrit des douleurs thoraciques intermittentes, principalement en situation de stress. Pas d'essoufflement ni de douleur irradiant. L'agent a évalué l'urgence comme modérée et a organisé une consultation rapide.",
  },
  {
    id: "5",
    patientId: "1",
    date: "2026-03-20",
    time: "16:30",
    doctor: "Dr. Ahmed Benali",
    doctorSpecialty: "Pneumologue",
    motif: "Toux persistante",
    status: "pending",
    aiSummary:
      "La patiente tousse depuis 3 semaines, toux sèche sans fièvre. Pas de tabagisme. L'agent a recommandé une consultation pneumologie pour investigation complémentaire.",
  },
];

export const calls: CallRecord[] = [
  {
    id: "1",
    patientId: "1",
    appointmentId: "1",
    date: "2026-02-27",
    duration: "8 min",
    motif: "Prise de RDV — Suivi tensions",
    symptoms: ["Vertiges matinaux", "Céphalées"],
    summary:
      "La patiente a contacté l'assistant pour planifier un suivi de ses tensions artérielles. Elle mentionne des vertiges au réveil depuis une semaine et des maux de tête en fin de journée. L'agent a vérifié les disponibilités et a fixé un rendez-vous avec le Dr. Martin.",
    recommendations: ["Mesurer la tension matin et soir", "Apporter les relevés au RDV", "Éviter le sel en excès"],
    evolution: "stable",
    urgencyScore: 4,
  },
  {
    id: "2",
    patientId: "1",
    appointmentId: "2",
    date: "2026-02-25",
    duration: "5 min",
    motif: "Prise de RDV — Bilan cardio",
    symptoms: ["Palpitations occasionnelles"],
    summary:
      "Appel pour planifier le bilan cardiaque annuel. La patiente signale des palpitations 2-3 fois par semaine, sans douleur. L'agent a recommandé un bilan complet et a organisé le rendez-vous chez le Dr. Leclerc.",
    recommendations: ["Éviter la caféine", "Noter les épisodes de palpitations"],
    evolution: "stable",
    urgencyScore: 3,
  },
  {
    id: "3",
    patientId: "1",
    appointmentId: "4",
    date: "2026-01-10",
    duration: "12 min",
    motif: "Urgence — Douleurs thoraciques",
    symptoms: ["Douleurs thoraciques", "Anxiété", "Essoufflement léger"],
    summary:
      "Appel d'urgence. La patiente décrit des douleurs oppressantes au niveau de la poitrine, apparues au travail. Pas de radiation vers le bras gauche. L'agent a évalué les symptômes, identifié une composante anxieuse et a organisé une consultation cardiologique rapide.",
    recommendations: ["Consultation cardiologie en urgence", "Techniques de respiration", "Repos immédiat"],
    evolution: "worsening",
    urgencyScore: 7,
  },
  {
    id: "4",
    patientId: "1",
    appointmentId: "5",
    date: "2026-02-28",
    duration: "6 min",
    motif: "Prise de RDV — Toux persistante",
    symptoms: ["Toux sèche", "Irritation gorge"],
    summary:
      "La patiente tousse depuis 3 semaines. Toux sèche, non productive, sans fièvre. Pas de tabagisme. L'agent a recommandé une consultation pneumologie et a pris le rendez-vous avec le Dr. Benali.",
    recommendations: ["Hydratation", "Éviter la climatisation", "Consulter si fièvre apparaît"],
    evolution: "stable",
    urgencyScore: 2,
  },
];

export const notifications: Notification[] = [
  { id: "1", type: "reminder", message: "RDV avec Dr. Martin dans 5 jours", date: "2026-02-28", read: false },
  { id: "2", type: "document", message: "Résultats d'analyse à télécharger", date: "2026-02-27", read: false },
  { id: "3", type: "alert", message: "Pensez à mesurer votre tension aujourd'hui", date: "2026-02-28", read: true },
  { id: "4", type: "reminder", message: "Renouvellement d'ordonnance à prévoir", date: "2026-02-26", read: true },
];
