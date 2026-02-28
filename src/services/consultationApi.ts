import { type Medication } from "@/data/mockData";

export interface ConsultationSummaryRequest {
  appointmentId: string;
  patientId: string;
  transcript: Array<{
    speaker: "Doctor" | "Patient";
    text: string;
    timestamp: string;
  }>;
}

export interface ConsultationSummaryResponse {
  summary: string;
  detectedSymptoms: string[];
  diagnoses: string[];
  prescription: {
    medications: Medication[];
    additionalAdvice: string[];
  };
}

/**
 * Posts the transcript to the consultation summary API.
 * Currently returns mock data after a simulated delay.
 * Replace the body of this function with a real fetch() when the API is ready.
 */
export async function fetchConsultationSummary(
  req: ConsultationSummaryRequest
): Promise<ConsultationSummaryResponse> {
  // ── Mock implementation (demo) ──
  await new Promise((r) => setTimeout(r, 2000));

  return {
    summary:
      "Patient presenting with pharyngeal pain for 3 days with fever at 38.5°C, dysphagia, and tender cervical lymphadenopathy. Clinical picture consistent with bacterial tonsillitis.",
    detectedSymptoms: [
      "Sore throat",
      "Fever 38.5°C",
      "Dysphagia",
      "Lymphadenopathy",
    ],
    diagnoses: [
      "Bacterial tonsillitis (probable streptococcal)",
      "Acute pharyngitis",
      "Upper respiratory tract viral infection",
    ],
    prescription: {
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
    },
  };
}
