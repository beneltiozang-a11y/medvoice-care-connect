import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  User,
  Phone,
  AlertCircle,
  Heart,
  FileText,
  TrendingUp,
  TrendingDown,
  Minus,
  MessageSquare,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { appointments, calls, patient } from "@/data/mockData";

const statusColor = (s: string) => {
  if (s === "confirmed") return "bg-success/15 text-success border-success/30";
  if (s === "pending") return "bg-warning/15 text-warning border-warning/30";
  return "bg-destructive/15 text-destructive border-destructive/30";
};
const statusLabel = (s: string) => {
  if (s === "confirmed") return "Confirmé";
  if (s === "pending") return "En attente";
  return "Annulé";
};

const evolutionConfig = {
  improvement: { icon: TrendingDown, label: "Amélioration", color: "text-success" },
  worsening: { icon: TrendingUp, label: "Aggravation", color: "text-destructive" },
  stable: { icon: Minus, label: "Stable", color: "text-muted-foreground" },
};

const urgencyColor = (score: number) => {
  if (score >= 7) return "bg-destructive text-destructive-foreground";
  if (score >= 4) return "bg-warning text-warning-foreground";
  return "bg-success text-success-foreground";
};

export default function AppointmentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const appointment = appointments.find((a) => a.id === id);
  if (!appointment) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <p className="text-muted-foreground">Rendez-vous introuvable.</p>
        <Button variant="outline" onClick={() => navigate("/")}>Retour</Button>
      </div>
    );
  }

  // Related calls for this appointment
  const relatedCalls = calls.filter((c) => c.appointmentId === appointment.id);
  // Previous calls for this patient (before appointment date)
  const previousCalls = calls
    .filter((c) => c.patientId === appointment.patientId && new Date(c.date) < new Date(appointment.date))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Back button */}
      <Button variant="ghost" onClick={() => navigate("/")} className="gap-2 text-muted-foreground -ml-2">
        <ArrowLeft className="h-4 w-4" />
        Retour au dashboard
      </Button>

      {/* Appointment header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="space-y-2">
              <h1 className="text-xl md:text-2xl font-bold text-foreground">{appointment.motif}</h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="h-4 w-4" />
                  {format(new Date(appointment.date), "EEEE d MMMM yyyy", { locale: fr })}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  {appointment.time}
                </span>
              </div>
              <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                <User className="h-4 w-4" />
                {appointment.doctor} · {appointment.doctorSpecialty}
              </p>
            </div>
            <Badge className={`${statusColor(appointment.status)} text-sm px-3 py-1`}>
              {statusLabel(appointment.status)}
            </Badge>
          </div>
          {appointment.notes && (
            <div className="mt-4 p-3 rounded-lg bg-muted/50 text-sm text-muted-foreground">
              📝 {appointment.notes}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Patient info / Antecedents */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Heart className="h-4 w-4 text-primary" />
              Antécédents du patient
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-muted-foreground">Né(e) le</p>
                <p className="font-medium text-foreground">
                  {format(new Date(patient.dateOfBirth), "d MMMM yyyy", { locale: fr })}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Groupe sanguin</p>
                <p className="font-medium text-foreground">{patient.bloodType}</p>
              </div>
            </div>

            <Separator />

            <div>
              <p className="text-sm font-semibold text-foreground mb-2">Allergies</p>
              <div className="flex gap-2 flex-wrap">
                {patient.allergies.map((a) => (
                  <Badge key={a} variant="destructive" className="text-xs">
                    {a}
                  </Badge>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <p className="text-sm font-semibold text-foreground mb-2">Antécédents médicaux</p>
              <ul className="space-y-1.5">
                {patient.antecedents.map((ant, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    {ant}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* AI Conversation Summary */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-primary" />
              Résumé de l'appel avec l'agent
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {appointment.aiSummary ? (
              <p className="text-sm text-muted-foreground leading-relaxed">{appointment.aiSummary}</p>
            ) : (
              <p className="text-sm text-muted-foreground italic">Aucun résumé disponible.</p>
            )}

            {relatedCalls.length > 0 && (
              <>
                <Separator />
                {relatedCalls.map((call) => {
                  const evo = evolutionConfig[call.evolution];
                  const EvoIcon = evo.icon;
                  return (
                    <div key={call.id} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-3.5 w-3.5 text-primary" />
                          <span className="font-medium text-foreground">{call.duration}</span>
                          <span className="text-muted-foreground">
                            · {format(new Date(call.date), "d MMM yyyy", { locale: fr })}
                          </span>
                        </div>
                        <Badge className={`${urgencyColor(call.urgencyScore)} text-[10px]`}>
                          <AlertCircle className="h-3 w-3 mr-1" />
                          {call.urgencyScore}/10
                        </Badge>
                      </div>

                      <div className="flex gap-1.5 flex-wrap">
                        {call.symptoms.map((s) => (
                          <Badge key={s} variant="secondary" className="text-[10px]">
                            {s}
                          </Badge>
                        ))}
                        <Badge variant="outline" className={`text-[10px] ${evo.color}`}>
                          <EvoIcon className="h-3 w-3 mr-1" />
                          {evo.label}
                        </Badge>
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-foreground mb-1">Recommandations</p>
                        <ul className="space-y-0.5">
                          {call.recommendations.map((r, i) => (
                            <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                              <span className="text-primary">•</span>
                              {r}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Previous calls */}
      {previousCalls.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              Appels précédents du patient
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {previousCalls.map((call) => {
              const evo = evolutionConfig[call.evolution];
              const EvoIcon = evo.icon;
              return (
                <div
                  key={call.id}
                  className="p-3 rounded-lg border border-border space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">{call.motif}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(call.date), "d MMM yyyy", { locale: fr })} · {call.duration}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{call.summary}</p>
                  <div className="flex gap-1.5 flex-wrap">
                    {call.symptoms.map((s) => (
                      <Badge key={s} variant="secondary" className="text-[10px]">
                        {s}
                      </Badge>
                    ))}
                    <Badge variant="outline" className={`text-[10px] ${evo.color}`}>
                      <EvoIcon className="h-3 w-3 mr-1" />
                      {evo.label}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
