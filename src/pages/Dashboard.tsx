import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Clock, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { appointments } from "@/data/mockData";

const statusConfig: Record<string, { label: string; class: string }> = {
  upcoming: { label: "À venir", class: "bg-primary/10 text-primary border-primary/20" },
  "in-progress": { label: "En cours", class: "bg-warning/10 text-warning border-warning/20" },
  done: { label: "Terminé", class: "bg-success/10 text-success border-success/20" },
};

export default function Dashboard() {
  const navigate = useNavigate();
  const today = new Date();

  const todayAppts = appointments
    .filter((a) => a.date === format(today, "yyyy-MM-dd"))
    .sort((a, b) => a.time.localeCompare(b.time));

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-xl font-semibold text-foreground">
          {format(today, "EEEE d MMMM", { locale: fr })}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {todayAppts.length} rendez-vous aujourd'hui
        </p>
      </div>

      <div className="space-y-2">
        {todayAppts.map((a) => {
          const status = statusConfig[a.status];
          return (
            <button
              key={a.id}
              onClick={() => navigate(`/appointments/${a.id}`)}
              className="w-full text-left p-4 rounded-lg bg-card border border-border hover:border-primary/30 transition-colors group flex items-center gap-4"
            >
              <div className="text-sm font-mono text-muted-foreground w-12 shrink-0">
                {a.time}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground text-sm">{a.patientName}</p>
                <p className="text-sm text-muted-foreground truncate">{a.motif}</p>
              </div>
              <Badge variant="outline" className={`${status.class} text-xs shrink-0`}>
                {status.label}
              </Badge>
              <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
            </button>
          );
        })}

        {todayAppts.length === 0 && (
          <div className="text-center py-16 text-muted-foreground text-sm">
            Aucun rendez-vous aujourd'hui
          </div>
        )}
      </div>
    </div>
  );
}
