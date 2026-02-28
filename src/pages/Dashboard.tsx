import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarDays, Clock, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { useNavigate } from "react-router-dom";
import { appointments, patient } from "@/data/mockData";

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
  const navigate = useNavigate();
  const today = new Date();

  const upcoming = appointments
    .filter((a) => new Date(a.date) >= today)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const appointmentDates = appointments.map((a) => new Date(a.date));

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-primary" />
              Calendrier
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 flex justify-center">
            <Calendar
              mode="multiple"
              selected={appointmentDates}
              className="pointer-events-auto"
              locale={fr}
            />
          </CardContent>
        </Card>

        {/* Upcoming Appointments */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-primary" />
                Rendez-vous à venir ({upcoming.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcoming.map((a) => (
                <div
                  key={a.id}
                  onClick={() => navigate(`/appointments/${a.id}`)}
                  className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-colors group"
                >
                  <div className="space-y-1 min-w-0">
                    <p className="font-semibold text-foreground truncate">{a.motif}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 shrink-0" />
                      {format(new Date(a.date), "d MMM yyyy", { locale: fr })} à {a.time}
                    </p>
                    <p className="text-sm text-muted-foreground">{a.doctor} · {a.doctorSpecialty}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <Badge className={`${statusColor(a.status)} text-xs`}>
                      {statusLabel(a.status)}
                    </Badge>
                    <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              ))}
              {upcoming.length === 0 && (
                <p className="text-muted-foreground text-sm py-4 text-center">Aucun rendez-vous à venir.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
