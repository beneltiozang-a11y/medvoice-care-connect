import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarDays, Phone, Clock, Bell, TrendingUp, TrendingDown, Minus, AlertTriangle, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { patient, appointments, calls, notifications, activeSymptoms } from "@/data/mockData";

const evolutionIcon = (e: string) => {
  if (e === "worsening") return <TrendingUp className="h-4 w-4 text-destructive rotate-0" />;
  if (e === "improvement") return <TrendingDown className="h-4 w-4 text-success" />;
  return <Minus className="h-4 w-4 text-muted-foreground" />;
};

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

export default function Dashboard() {
  const today = new Date();
  const nextAppointment = appointments
    .filter((a) => new Date(a.date) >= today && a.status !== "cancelled")
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];
  const recentCalls = calls.slice(0, 3);
  const unreadNotifications = notifications.filter((n) => !n.read);

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          Bonjour, {patient.firstName} 👋
        </h1>
        <p className="text-muted-foreground mt-1">
          {format(today, "EEEE d MMMM yyyy", { locale: fr })}
        </p>
      </div>

      {/* Top row */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {/* Next appointment */}
        {nextAppointment && (
          <Card className="border-l-4 border-l-primary">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-primary" />
                Prochain rendez-vous
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="font-semibold text-foreground">
                {format(new Date(nextAppointment.date), "d MMMM yyyy", { locale: fr })} à {nextAppointment.time}
              </p>
              <p className="text-sm text-muted-foreground">{nextAppointment.doctor}</p>
              <p className="text-sm text-muted-foreground">{nextAppointment.motif}</p>
              <Badge className={`${statusColor(nextAppointment.status)} text-xs`}>
                {statusLabel(nextAppointment.status)}
              </Badge>
            </CardContent>
          </Card>
        )}

        {/* Medical summary */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-warning" />
              Symptômes actifs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activeSymptoms.map((s) => (
                <div key={s.name} className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-foreground">{s.name}</span>
                    <span className="text-xs text-muted-foreground ml-2">({s.severity})</span>
                  </div>
                  {evolutionIcon(s.evolution)}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Bell className="h-4 w-4 text-primary" />
              Alertes
              {unreadNotifications.length > 0 && (
                <Badge variant="destructive" className="text-[10px] h-5 px-1.5">
                  {unreadNotifications.length}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {notifications.slice(0, 4).map((n) => (
                <div key={n.id} className={`flex items-start gap-2 text-sm ${n.read ? "opacity-60" : ""}`}>
                  {n.type === "reminder" && <CalendarDays className="h-4 w-4 text-primary mt-0.5 shrink-0" />}
                  {n.type === "document" && <FileText className="h-4 w-4 text-accent mt-0.5 shrink-0" />}
                  {n.type === "alert" && <AlertTriangle className="h-4 w-4 text-warning mt-0.5 shrink-0" />}
                  <span className="text-foreground">{n.message}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent calls */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" />
              Derniers appels
            </CardTitle>
            <Button variant="ghost" size="sm" className="text-primary" asChild>
              <a href="/calls">Voir tout</a>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentCalls.map((call) => (
              <div key={call.id} className="flex items-start justify-between border-b border-border pb-3 last:border-0 last:pb-0">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">{call.motif}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-2">
                    <Clock className="h-3 w-3" />
                    {format(new Date(call.date), "d MMM yyyy", { locale: fr })} · {call.duration}
                  </p>
                  <div className="flex gap-1.5 flex-wrap mt-1">
                    {call.symptoms.slice(0, 3).map((s) => (
                      <Badge key={s} variant="secondary" className="text-[10px] px-2 py-0.5">
                        {s}
                      </Badge>
                    ))}
                  </div>
                </div>
                {evolutionIcon(call.evolution)}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
