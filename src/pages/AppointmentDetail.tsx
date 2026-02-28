import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Play,
  Square,
  Plus,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Send,
  Mic,
  Clock,
  User as UserIcon,
  Stethoscope,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  appointments,
  patients,
  pastAppointments,
  calls,
  mockTranscriptSteps,
  mockAIPrescription,
  mockDiagnoses,
  type TranscriptMessage,
  type Medication,
} from "@/data/mockData";

export default function AppointmentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const transcriptEndRef = useRef<HTMLDivElement>(null);

  const appointment = appointments.find((a) => a.id === id);
  const patient = appointment ? patients.find((p) => p.id === appointment.patientId) : null;
  const history = patient ? pastAppointments[patient.id] || [] : [];
  const relatedCalls = appointment ? calls.filter((c) => c.appointmentId === appointment.id) : [];

  // Consultation state
  const [consultationStarted, setConsultationStarted] = useState(false);
  const [consultationEnded, setConsultationEnded] = useState(false);
  const [transcript, setTranscript] = useState<TranscriptMessage[]>([]);
  const [stepIndex, setStepIndex] = useState(0);

  // AI summary & prescription (right panel)
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [detectedSymptoms, setDetectedSymptoms] = useState<string[]>([]);
  const [prescription, setPrescription] = useState<Medication[]>([]);
  const [showPrescription, setShowPrescription] = useState(false);
  const [validated, setValidated] = useState(false);

  // Allergy check
  const hasAllergyConflict = patient?.allergies.some(
    (a) => a.toLowerCase().includes("pénicilline")
  ) && prescription.some((m) => m.name.toLowerCase().includes("amoxicilline"));

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcript]);

  if (!appointment || !patient) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <p className="text-muted-foreground text-sm">Rendez-vous introuvable.</p>
        <Button variant="outline" size="sm" onClick={() => navigate("/")}>Retour</Button>
      </div>
    );
  }

  const simulateNextLines = () => {
    if (stepIndex >= mockTranscriptSteps.length) return;
    const newMsgs: TranscriptMessage[] = [];
    let idx = stepIndex;
    if (idx < mockTranscriptSteps.length) { newMsgs.push(mockTranscriptSteps[idx]); idx++; }
    if (idx < mockTranscriptSteps.length) { newMsgs.push(mockTranscriptSteps[idx]); idx++; }
    setTranscript((prev) => [...prev, ...newMsgs]);
    setStepIndex(idx);

    // Progressive symptom detection
    const symptomMap: Record<number, string[]> = {
      2: ["Douleur gorge"],
      4: ["Douleur gorge", "Fièvre 38.5°C"],
      6: ["Douleur gorge", "Fièvre 38.5°C", "Dysphagie"],
      8: ["Douleur gorge", "Fièvre 38.5°C", "Dysphagie", "Adénopathies"],
    };
    const key = Object.keys(symptomMap).map(Number).filter((k) => k <= idx).pop();
    if (key !== undefined) setDetectedSymptoms(symptomMap[key]);

    // Update AI summary progressively
    if (idx >= 6) {
      setAiSummary(
        `Patient présentant une douleur pharyngée depuis 3 jours avec fièvre à 38.5°C, dysphagie et adénopathies cervicales sensibles. Tableau compatible avec une angine bactérienne.`
      );
    } else if (idx >= 4) {
      setAiSummary(
        `Patient présentant une douleur pharyngée constante depuis 3 jours, aggravée à la déglutition. Fièvre à 38.5°C. Interrogatoire en cours.`
      );
    }

    // Show prescription at end
    if (idx >= mockTranscriptSteps.length) {
      setShowPrescription(true);
      setPrescription([...mockAIPrescription.medications]);
    }
  };

  const startConsultation = () => setConsultationStarted(true);

  const endConsultation = () => {
    setConsultationEnded(true);
    setTimeout(() => navigate("/"), 1500);
  };

  const updateMed = (i: number, field: keyof Medication, value: string) => {
    const updated = [...prescription];
    updated[i] = { ...updated[i], [field]: value };
    setPrescription(updated);
  };

  const removeMed = (i: number) => setPrescription(prescription.filter((_, idx) => idx !== i));
  const addMed = () => setPrescription([...prescription, { name: "", dosage: "", frequency: "", duration: "" }]);

  const age = Math.floor(
    (Date.now() - new Date(patient.dateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000)
  );

  // ─── BEFORE CONSULTATION ───
  if (!consultationStarted) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <button onClick={() => navigate("/")} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Retour
        </button>

        {/* Start button */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-foreground">{appointment.patientName}</h1>
            <p className="text-sm text-muted-foreground">{appointment.motif} · {appointment.time}</p>
          </div>
          <Button onClick={startConsultation} className="gap-2">
            <Play className="h-4 w-4" />
            Start Appointment
          </Button>
        </div>

        {/* AI Briefing */}
        {appointment.aiSummary && (
          <div className="rounded-lg bg-card border border-border p-5 space-y-3">
            <h2 className="text-sm font-medium text-foreground flex items-center gap-2">
              <Stethoscope className="h-4 w-4 text-primary" />
              AI Phone Briefing
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{appointment.aiSummary}</p>
            {relatedCalls.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {relatedCalls[0].symptoms.map((s) => (
                  <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Patient info */}
        <div className="rounded-lg bg-card border border-border p-5 space-y-4">
          <h2 className="text-sm font-medium text-foreground">Patient Profile</h2>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground text-xs">Âge</p>
              <p className="text-foreground">{age} ans</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Groupe sanguin</p>
              <p className="text-foreground">{patient.bloodType}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Allergies</p>
              <div className="flex gap-1 flex-wrap">
                {patient.allergies.length > 0
                  ? patient.allergies.map((a) => (
                      <Badge key={a} variant="destructive" className="text-[10px]">{a}</Badge>
                    ))
                  : <span className="text-foreground">Aucune</span>}
              </div>
            </div>
          </div>
          {patient.antecedents.length > 0 && (
            <>
              <Separator />
              <div>
                <p className="text-xs text-muted-foreground mb-2">Antécédents</p>
                <ul className="space-y-1">
                  {patient.antecedents.map((a, i) => (
                    <li key={i} className="text-sm text-muted-foreground">• {a}</li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>

        {/* Patient history timeline */}
        {history.length > 0 && (
          <div className="rounded-lg bg-card border border-border p-5 space-y-4">
            <h2 className="text-sm font-medium text-foreground">Historique</h2>
            <div className="space-y-3">
              {history.map((h, i) => (
                <div key={i} className="flex gap-4 text-sm">
                  <div className="text-xs text-muted-foreground font-mono w-20 shrink-0 pt-0.5">
                    {format(new Date(h.date), "dd MMM yy", { locale: fr })}
                  </div>
                  <div className="flex-1 border-l border-border pl-4 pb-3">
                    <p className="font-medium text-foreground text-sm">{h.motif}</p>
                    <p className="text-muted-foreground text-xs mt-1">{h.summary}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ─── DURING CONSULTATION (split panel) ───
  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-2 py-3 border-b border-border shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/")} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <span className="text-sm font-medium text-foreground">{appointment.patientName}</span>
            <span className="text-xs text-muted-foreground ml-2">{appointment.motif}</span>
          </div>
          {!consultationEnded && (
            <div className="flex items-center gap-1.5 ml-2">
              <span className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
              <span className="text-xs text-muted-foreground">En cours</span>
            </div>
          )}
        </div>
        {!consultationEnded && (
          <Button onClick={endConsultation} variant="destructive" size="sm" className="gap-2">
            <Square className="h-3 w-3" />
            End Appointment
          </Button>
        )}
      </div>

      {consultationEnded && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 bg-success/10 border-b border-success/20 text-center"
        >
          <p className="text-sm text-success font-medium">Consultation terminée — Redirection...</p>
        </motion.div>
      )}

      {/* Split panel */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT: Live Transcript */}
        <div className="flex-1 flex flex-col border-r border-border">
          <div className="px-4 py-3 border-b border-border shrink-0">
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Live Transcript</h3>
          </div>
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-1">
              <AnimatePresence>
                {transcript.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`px-3 py-2 rounded text-sm transcript-text ${
                      msg.role === "doctor"
                        ? "bg-primary/5"
                        : "bg-muted/50"
                    }`}
                  >
                    <span className={`font-semibold text-xs mr-2 ${
                      msg.role === "doctor" ? "text-primary" : "text-muted-foreground"
                    }`}>
                      {msg.role === "doctor" ? "Dr." : "Patient"}
                    </span>
                    <span className="text-foreground/90">{msg.text}</span>
                    {msg.timestamp && (
                      <span className="text-[10px] text-muted-foreground ml-2">{msg.timestamp}</span>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
              {transcript.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-16">
                  En attente de la conversation...
                </p>
              )}
              <div ref={transcriptEndRef} />
            </div>
          </ScrollArea>
          {!consultationEnded && (
            <div className="p-3 border-t border-border shrink-0">
              <Button
                onClick={simulateNextLines}
                disabled={stepIndex >= mockTranscriptSteps.length}
                variant="outline"
                size="sm"
                className="gap-2 w-full"
              >
                <Mic className="h-3.5 w-3.5" />
                Simulate Speech
              </Button>
            </div>
          )}
        </div>

        {/* RIGHT: AI Summary + Prescription */}
        <div className="w-[420px] flex flex-col shrink-0">
          {/* Top half: AI Summary */}
          <div className="flex-1 flex flex-col border-b border-border overflow-hidden">
            <div className="px-4 py-3 border-b border-border shrink-0">
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">AI Summary</h3>
            </div>
            <ScrollArea className="flex-1 p-4">
              {aiSummary ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  <p className="text-sm text-foreground/90 leading-relaxed">{aiSummary}</p>
                  {detectedSymptoms.length > 0 && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-2">Symptômes détectés</p>
                      <div className="flex flex-wrap gap-1">
                        {detectedSymptoms.map((s) => (
                          <Badge key={s} variant="secondary" className="text-[10px]">{s}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {showPrescription && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Diagnostic probable</p>
                      <ul className="space-y-1">
                        {mockDiagnoses.map((d, i) => (
                          <li key={i} className="text-xs text-foreground/80 flex items-center gap-2">
                            <span className={`h-1.5 w-1.5 rounded-full ${i === 0 ? "bg-primary" : "bg-muted-foreground/30"}`} />
                            {d}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </motion.div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-10">
                  Le résumé apparaîtra au fil de la consultation...
                </p>
              )}
            </ScrollArea>
          </div>

          {/* Bottom half: Prescription */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="px-4 py-3 border-b border-border shrink-0 flex items-center justify-between">
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Prescription</h3>
              {validated && (
                <Badge className="bg-success/10 text-success border-success/20 text-[10px]">Validée</Badge>
              )}
            </div>
            <ScrollArea className="flex-1 p-4">
              {!showPrescription ? (
                <p className="text-sm text-muted-foreground text-center py-10">
                  En attente de données suffisantes...
                </p>
              ) : (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                  {/* Allergy warning */}
                  {hasAllergyConflict && !validated && (
                    <div className="p-2.5 rounded bg-destructive/10 border border-destructive/20 flex items-start gap-2">
                      <AlertTriangle className="h-3.5 w-3.5 text-destructive shrink-0 mt-0.5" />
                      <p className="text-xs text-destructive">
                        Allergie pénicilline détectée — Amoxicilline incompatible
                      </p>
                    </div>
                  )}

                  {prescription.map((med, i) => (
                    <div key={i} className="p-3 rounded bg-muted/30 border border-border space-y-2">
                      {!validated ? (
                        <>
                          <div className="flex items-center justify-between">
                            <Input
                              value={med.name}
                              onChange={(e) => updateMed(i, "name", e.target.value)}
                              className="h-7 text-sm bg-transparent border-none p-0 font-medium"
                              placeholder="Médicament"
                            />
                            <button onClick={() => removeMed(i)} className="text-muted-foreground hover:text-destructive">
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <Input value={med.dosage} onChange={(e) => updateMed(i, "dosage", e.target.value)} className="h-6 text-xs bg-card" placeholder="Dosage" />
                            <Input value={med.frequency} onChange={(e) => updateMed(i, "frequency", e.target.value)} className="h-6 text-xs bg-card" placeholder="Fréquence" />
                            <Input value={med.duration} onChange={(e) => updateMed(i, "duration", e.target.value)} className="h-6 text-xs bg-card" placeholder="Durée" />
                          </div>
                        </>
                      ) : (
                        <>
                          <p className="text-sm font-medium text-foreground">{med.name} — {med.dosage}</p>
                          <p className="text-xs text-muted-foreground">{med.frequency} · {med.duration}</p>
                        </>
                      )}
                    </div>
                  ))}

                  {!validated && (
                    <>
                      <button onClick={addMed} className="w-full py-2 rounded border border-dashed border-border text-xs text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors flex items-center justify-center gap-1">
                        <Plus className="h-3 w-3" /> Add medication
                      </button>
                      <Button onClick={() => setValidated(true)} className="w-full gap-2 mt-2" size="sm">
                        <Send className="h-3.5 w-3.5" />
                        Validate & Send
                      </Button>
                    </>
                  )}
                </motion.div>
              )}
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
}
