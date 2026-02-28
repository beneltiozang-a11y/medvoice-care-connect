import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Mic,
  Brain,
  Heart,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Pencil,
  Download,
  Plus,
  Trash2,
  Bot,
  User as UserIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  appointments,
  patient,
  mockTranscriptSteps,
  mockAIPrescription,
  mockDiagnoses,
  type TranscriptMessage,
  type Prescription,
  type Medication,
} from "@/data/mockData";

const urgencyColor = (score: number) => {
  if (score >= 7) return "bg-destructive text-destructive-foreground";
  if (score >= 4) return "bg-warning text-warning-foreground";
  return "bg-success text-success-foreground";
};

const urgencyBarColor = (score: number) => {
  if (score >= 7) return "bg-destructive";
  if (score >= 4) return "bg-warning";
  return "bg-success";
};

export default function Consultation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const chatEndRef = useRef<HTMLDivElement>(null);

  const appointment = appointments.find((a) => a.id === id);

  // Consultation state
  const [transcript, setTranscript] = useState<TranscriptMessage[]>([]);
  const [detectedSymptoms, setDetectedSymptoms] = useState<string[]>([]);
  const [urgencyScore, setUrgencyScore] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [summaryGenerated, setSummaryGenerated] = useState(false);
  const [prescription, setPrescription] = useState<Prescription | null>(null);
  const [editingPrescription, setEditingPrescription] = useState(false);
  const [editedMedications, setEditedMedications] = useState<Medication[]>([]);
  const [doctorValidated, setDoctorValidated] = useState(false);
  const [consultationEnded, setConsultationEnded] = useState(false);

  // Allergy check
  const hasAllergyConflict = prescription?.medications.some((med) =>
    patient.allergies.some(
      (allergy) =>
        allergy.toLowerCase().includes("pénicilline") &&
        med.name.toLowerCase().includes("amoxicilline")
    )
  );

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcript]);

  if (!appointment) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <p className="text-muted-foreground">Rendez-vous introuvable.</p>
        <Button variant="outline" onClick={() => navigate("/")}>Retour</Button>
      </div>
    );
  }

  const simulateResponse = () => {
    if (stepIndex >= mockTranscriptSteps.length) return;

    // Add next message(s) - patient then IA
    const newMessages: TranscriptMessage[] = [];
    let idx = stepIndex;

    // Add patient message
    if (idx < mockTranscriptSteps.length) {
      newMessages.push(mockTranscriptSteps[idx]);
      idx++;
    }
    // Add IA response
    if (idx < mockTranscriptSteps.length) {
      newMessages.push(mockTranscriptSteps[idx]);
      idx++;
    }

    setTranscript((prev) => [...prev, ...newMessages]);
    setStepIndex(idx);

    // Update symptoms progressively
    const symptomMap: Record<number, string[]> = {
      2: ["Douleur gorge"],
      4: ["Douleur gorge", "Fièvre (38.5°C)"],
      6: ["Douleur gorge", "Fièvre (38.5°C)", "Dysphagie"],
      8: ["Douleur gorge", "Fièvre (38.5°C)", "Dysphagie", "Adénopathies cervicales possibles"],
    };

    const closestKey = Object.keys(symptomMap)
      .map(Number)
      .filter((k) => k <= idx)
      .pop();
    if (closestKey !== undefined) {
      setDetectedSymptoms(symptomMap[closestKey]);
    }

    // Update urgency
    setUrgencyScore(Math.min(Math.round((idx / mockTranscriptSteps.length) * 5) + 1, 5));
  };

  const generateSummary = () => {
    setSummaryGenerated(true);
    setPrescription(mockAIPrescription);
    setEditedMedications([...mockAIPrescription.medications]);
    setUrgencyScore(5);
    setDetectedSymptoms(["Douleur gorge", "Fièvre (38.5°C)", "Dysphagie", "Adénopathies cervicales possibles"]);
  };

  const confirmPrescription = () => {
    setDoctorValidated(true);
    setEditingPrescription(false);
    if (editingPrescription) {
      setPrescription({ ...prescription!, medications: editedMedications });
    }
  };

  const rejectPrescription = () => {
    setPrescription(null);
    setSummaryGenerated(false);
    setDoctorValidated(false);
  };

  const endConsultation = () => {
    setConsultationEnded(true);
    setTimeout(() => navigate("/"), 2000);
  };

  const updateMedication = (index: number, field: keyof Medication, value: string) => {
    const updated = [...editedMedications];
    updated[index] = { ...updated[index], [field]: value };
    setEditedMedications(updated);
  };

  const removeMedication = (index: number) => {
    setEditedMedications(editedMedications.filter((_, i) => i !== index));
  };

  const addMedication = () => {
    setEditedMedications([...editedMedications, { name: "", dosage: "", frequency: "", duration: "" }]);
  };

  const age = Math.floor(
    (new Date().getTime() - new Date(patient.dateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000)
  );

  return (
    <div className="space-y-4 max-w-[1600px]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate(`/appointments/${id}`)} className="gap-2 text-muted-foreground -ml-2">
          <ArrowLeft className="h-4 w-4" />
          Retour au rendez-vous
        </Button>
        {!consultationEnded && doctorValidated && (
          <Button onClick={endConsultation} variant="destructive" className="gap-2">
            Terminer la consultation
          </Button>
        )}
      </div>

      {consultationEnded && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-6 rounded-lg bg-success/10 border border-success/30 text-center space-y-2"
        >
          <CheckCircle2 className="h-8 w-8 text-success mx-auto" />
          <p className="font-semibold text-foreground">Consultation terminée</p>
          <p className="text-sm text-muted-foreground">Redirection vers le dashboard...</p>
        </motion.div>
      )}

      {/* 3-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Column 1 – Patient Profile */}
        <div className="lg:col-span-3">
          <Card className="lg:sticky lg:top-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Heart className="h-4 w-4 text-primary" />
                Profil Patient
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                  <span className="text-primary font-bold text-lg">{patient.firstName[0]}{patient.lastName[0]}</span>
                </div>
                <p className="font-semibold text-foreground">{patient.firstName} {patient.lastName}</p>
                <p className="text-sm text-muted-foreground">{age} ans</p>
              </div>

              <Separator />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Groupe sanguin</span>
                  <span className="font-medium text-foreground">{patient.bloodType}</span>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-foreground mb-2">Allergies</p>
                <div className="flex flex-wrap gap-1.5">
                  {patient.allergies.map((a) => (
                    <Badge key={a} variant="destructive" className="text-[10px]">{a}</Badge>
                  ))}
                </div>
              </div>

              {/* Persistent allergy alert */}
              {hasAllergyConflict && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-lg bg-destructive/10 border border-destructive/30 flex items-start gap-2"
                >
                  <AlertTriangle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                  <p className="text-xs text-destructive font-medium">
                    Allergie pénicilline détectée. Vérifiez la prescription.
                  </p>
                </motion.div>
              )}

              <Separator />

              <div>
                <p className="text-xs font-semibold text-foreground mb-2">Antécédents</p>
                <ul className="space-y-1">
                  {patient.antecedents.map((ant, i) => (
                    <li key={i} className="text-[11px] text-muted-foreground flex items-start gap-1.5">
                      <span className="text-primary mt-0.5">•</span>
                      {ant}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Column 2 – AI Live Assistant */}
        <div className="lg:col-span-5 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Bot className="h-4 w-4 text-primary" />
                Assistant IA – Consultation Live
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Chat zone */}
              <ScrollArea className="h-[350px] rounded-lg border border-border bg-muted/30 p-3">
                <div className="space-y-3">
                  <AnimatePresence>
                    {transcript.map((msg, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`flex gap-2 ${msg.role === "ia" ? "" : "justify-end"}`}
                      >
                        {msg.role === "ia" && (
                          <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <Bot className="h-3.5 w-3.5 text-primary" />
                          </div>
                        )}
                        <div
                          className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                            msg.role === "ia"
                              ? "bg-card border border-border text-foreground"
                              : "bg-primary text-primary-foreground"
                          }`}
                        >
                          {msg.text}
                        </div>
                        {msg.role === "patient" && (
                          <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center shrink-0">
                            <UserIcon className="h-3.5 w-3.5 text-muted-foreground" />
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {transcript.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-10">
                      Cliquez sur "Simuler réponse" pour démarrer la consultation.
                    </p>
                  )}
                  <div ref={chatEndRef} />
                </div>
              </ScrollArea>

              {/* Detected symptoms */}
              {detectedSymptoms.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-foreground mb-2">Symptômes détectés</p>
                  <div className="flex flex-wrap gap-1.5">
                    <AnimatePresence>
                      {detectedSymptoms.map((s) => (
                        <motion.div key={s} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
                          <Badge variant="secondary" className="text-[10px]">{s}</Badge>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              )}

              {/* Urgency score */}
              {urgencyScore > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs font-semibold text-foreground">Score d'urgence</p>
                    <Badge className={`${urgencyColor(urgencyScore)} text-[10px]`}>{urgencyScore}/10</Badge>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${urgencyBarColor(urgencyScore)}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${urgencyScore * 10}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex gap-2 flex-wrap">
                <Button
                  onClick={simulateResponse}
                  disabled={stepIndex >= mockTranscriptSteps.length || consultationEnded}
                  className="gap-2"
                  variant="outline"
                >
                  <Mic className="h-4 w-4" />
                  Simuler réponse patient
                </Button>
                <Button
                  onClick={generateSummary}
                  disabled={transcript.length < 4 || summaryGenerated || consultationEnded}
                  className="gap-2"
                >
                  <Brain className="h-4 w-4" />
                  Générer synthèse
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Column 3 – Structured Summary */}
        <div className="lg:col-span-4 space-y-4">
          <AnimatePresence>
            {summaryGenerated && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-4"
              >
                {/* Summary */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Résumé structuré</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">Motif</p>
                      <p className="font-medium text-foreground">{appointment.motif}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Symptômes</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {detectedSymptoms.map((s) => (
                          <Badge key={s} variant="secondary" className="text-[10px]">{s}</Badge>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-muted-foreground">Durée</p>
                        <p className="font-medium text-foreground">3 jours</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Intensité</p>
                        <p className="font-medium text-foreground">Modérée</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Diagnosis */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Diagnostic probable</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {mockDiagnoses.map((d, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <span className={`mt-1 h-2 w-2 rounded-full shrink-0 ${i === 0 ? "bg-primary" : "bg-muted-foreground/30"}`} />
                          <span className={i === 0 ? "font-medium text-foreground" : "text-muted-foreground"}>{d}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Prescription */}
                {prescription && (
                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">
                          {doctorValidated ? "✅ Ordonnance validée" : "Proposition ordonnance IA"}
                        </CardTitle>
                        {doctorValidated && (
                          <Badge className="bg-success/15 text-success border-success/30 text-[10px]">Validée</Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Allergy warning */}
                      {hasAllergyConflict && !doctorValidated && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="p-3 rounded-lg bg-destructive/10 border border-destructive/30 flex items-start gap-2"
                        >
                          <AlertTriangle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                          <p className="text-xs text-destructive font-medium">
                            ⚠️ Attention : allergie pénicilline détectée. L'Amoxicilline est un dérivé de la pénicilline. Veuillez vérifier la prescription.
                          </p>
                        </motion.div>
                      )}

                      {editingPrescription ? (
                        <div className="space-y-3">
                          {editedMedications.map((med, i) => (
                            <div key={i} className="p-3 rounded-lg border border-border space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-muted-foreground">Médicament {i + 1}</span>
                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeMedication(i)}>
                                  <Trash2 className="h-3 w-3 text-destructive" />
                                </Button>
                              </div>
                              <Input
                                value={med.name}
                                onChange={(e) => updateMedication(i, "name", e.target.value)}
                                placeholder="Nom"
                                className="h-8 text-sm"
                              />
                              <div className="grid grid-cols-3 gap-2">
                                <Input
                                  value={med.dosage}
                                  onChange={(e) => updateMedication(i, "dosage", e.target.value)}
                                  placeholder="Dosage"
                                  className="h-8 text-xs"
                                />
                                <Input
                                  value={med.frequency}
                                  onChange={(e) => updateMedication(i, "frequency", e.target.value)}
                                  placeholder="Fréquence"
                                  className="h-8 text-xs"
                                />
                                <Input
                                  value={med.duration}
                                  onChange={(e) => updateMedication(i, "duration", e.target.value)}
                                  placeholder="Durée"
                                  className="h-8 text-xs"
                                />
                              </div>
                            </div>
                          ))}
                          <Button variant="outline" size="sm" className="gap-1 w-full" onClick={addMedication}>
                            <Plus className="h-3 w-3" /> Ajouter un médicament
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {(doctorValidated && prescription ? prescription.medications : prescription.medications).map((med, i) => (
                            <div key={i} className="p-2.5 rounded-lg bg-muted/50 space-y-0.5">
                              <p className="text-sm font-medium text-foreground">{med.name} – {med.dosage}</p>
                              <p className="text-xs text-muted-foreground">{med.frequency} · {med.duration}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {prescription.additionalAdvice.length > 0 && (
                        <>
                          <Separator />
                          <div>
                            <p className="text-xs font-semibold text-foreground mb-2">Conseils</p>
                            <ul className="space-y-1">
                              {prescription.additionalAdvice.map((a, i) => (
                                <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                                  <span className="text-primary">•</span> {a}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </>
                      )}

                      {/* Doctor actions */}
                      {!doctorValidated && (
                        <div className="flex gap-2 flex-wrap pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-1"
                            onClick={() => {
                              setEditingPrescription(!editingPrescription);
                              if (!editingPrescription) setEditedMedications([...prescription.medications]);
                            }}
                          >
                            <Pencil className="h-3 w-3" />
                            {editingPrescription ? "Annuler" : "Modifier"}
                          </Button>
                          <Button size="sm" className="gap-1" onClick={confirmPrescription}>
                            <CheckCircle2 className="h-3 w-3" />
                            Confirmer
                          </Button>
                          <Button variant="destructive" size="sm" className="gap-1" onClick={rejectPrescription}>
                            <XCircle className="h-3 w-3" />
                            Rejeter
                          </Button>
                        </div>
                      )}

                      {doctorValidated && (
                        <Button variant="outline" size="sm" className="gap-1 w-full">
                          <Download className="h-3 w-3" />
                          Télécharger ordonnance PDF
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {!summaryGenerated && (
            <Card className="border-dashed">
              <CardContent className="py-12 text-center">
                <Brain className="h-8 w-8 text-muted-foreground/40 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">
                  La synthèse apparaîtra ici après la génération.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}