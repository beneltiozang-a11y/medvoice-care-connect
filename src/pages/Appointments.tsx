import { useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarDays, Clock, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { appointments } from "@/data/mockData";

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

export default function Appointments() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const today = new Date();

  const filtered = appointments.filter(
    (a) => statusFilter === "all" || a.status === statusFilter
  );
  const upcoming = filtered
    .filter((a) => new Date(a.date) >= today)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const past = filtered
    .filter((a) => new Date(a.date) < today)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const appointmentDates = appointments.map((a) => new Date(a.date));

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Mes Rendez-vous</h1>
          <p className="text-muted-foreground mt-1">Gérez et suivez tous vos rendez-vous médicaux</p>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Filtrer par statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              <SelectItem value="confirmed">Confirmés</SelectItem>
              <SelectItem value="pending">En attente</SelectItem>
              <SelectItem value="cancelled">Annulés</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="lg:col-span-1">
          <CardContent className="p-4 flex justify-center">
            <Calendar
              mode="multiple"
              selected={appointmentDates}
              className="pointer-events-auto"
              locale={fr}
            />
          </CardContent>
        </Card>

        {/* Upcoming */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-primary" />
              À venir ({upcoming.length})
            </h2>
            <div className="space-y-3">
              {upcoming.map((a) => (
                <Card key={a.id} className="border-l-4 border-l-primary">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-semibold text-foreground">{a.motif}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5" />
                        {format(new Date(a.date), "d MMMM yyyy", { locale: fr })} à {a.time}
                      </p>
                      <p className="text-sm text-muted-foreground">{a.doctor} · {a.doctorSpecialty}</p>
                    </div>
                    <Badge className={`${statusColor(a.status)} text-xs shrink-0`}>
                      {statusLabel(a.status)}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
              {upcoming.length === 0 && (
                <p className="text-muted-foreground text-sm">Aucun rendez-vous à venir.</p>
              )}
            </div>
          </div>

          {/* Past */}
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-3">Historique</h2>
            <div className="space-y-3">
              {past.map((a) => (
                <Card key={a.id} className="opacity-80">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <p className="font-medium text-foreground">{a.motif}</p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(a.date), "d MMMM yyyy", { locale: fr })} · {a.doctor}
                        </p>
                      </div>
                      <Badge className={`${statusColor(a.status)} text-xs`}>
                        {statusLabel(a.status)}
                      </Badge>
                    </div>
                    {a.notes && (
                      <p className="text-sm text-muted-foreground mt-2 bg-muted/50 rounded-md p-2">
                        📝 {a.notes}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
              {past.length === 0 && (
                <p className="text-muted-foreground text-sm">Aucun historique.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
