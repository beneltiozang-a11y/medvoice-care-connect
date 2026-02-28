import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { appointments, patients } from "@/data/mockData";

const statusConfig: Record<string, { label: string; borderColor: string; dotColor: string }> = {
  upcoming: {
    label: "À venir",
    borderColor: "border-l-[hsl(174,35%,45%)]",
    dotColor: "bg-[hsl(174,30%,50%)]",
  },
  "in-progress": {
    label: "En cours",
    borderColor: "border-l-[hsl(35,70%,55%)]",
    dotColor: "bg-[hsl(35,65%,55%)]",
  },
  done: {
    label: "Terminé",
    borderColor: "border-l-[hsl(220,10%,35%)]",
    dotColor: "bg-[hsl(220,10%,40%)]",
  },
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getInitialsBg(patientId: string) {
  const colors = [
    "bg-[hsl(174,25%,22%)] text-[hsl(174,30%,55%)]",
    "bg-[hsl(260,20%,22%)] text-[hsl(260,25%,60%)]",
    "bg-[hsl(35,25%,22%)] text-[hsl(35,35%,60%)]",
    "bg-[hsl(340,20%,22%)] text-[hsl(340,25%,55%)]",
  ];
  const idx = parseInt(patientId, 10) % colors.length;
  return colors[idx];
}

export default function Dashboard() {
  const navigate = useNavigate();
  const today = new Date();

  const todayAppts = appointments
    .filter((a) => a.date === format(today, "yyyy-MM-dd"))
    .sort((a, b) => a.time.localeCompare(b.time));

  // Find the next upcoming appointment
  const now = format(today, "HH:mm");
  const nextUpcomingId = todayAppts.find(
    (a) => a.status === "upcoming" && a.time >= now
  )?.id;

  // Day progress: 8:00 to 18:00
  const dayStartHour = 8;
  const dayEndHour = 18;
  const currentHour = today.getHours() + today.getMinutes() / 60;
  const dayProgress = Math.max(0, Math.min(100, ((currentHour - dayStartHour) / (dayEndHour - dayStartHour)) * 100));

  // Time markers
  const timeMarkers = Array.from({ length: dayEndHour - dayStartHour + 1 }, (_, i) => dayStartHour + i);

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

      {/* Day progress bar */}
      <div className="space-y-1.5">
        <div className="relative h-1.5 rounded-full bg-secondary overflow-visible">
          {/* Appointment markers */}
          {todayAppts.map((a) => {
            const [h, m] = a.time.split(":").map(Number);
            const pos = ((h + m / 60 - dayStartHour) / (dayEndHour - dayStartHour)) * 100;
            if (pos < 0 || pos > 100) return null;
            const cfg = statusConfig[a.status];
            return (
              <div
                key={a.id}
                className={`absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full ${cfg.dotColor} ring-2 ring-background`}
                style={{ left: `${pos}%` }}
              />
            );
          })}
          {/* Current time marker */}
          {dayProgress > 0 && dayProgress < 100 && (
            <div
              className="absolute top-1/2 -translate-y-1/2 w-0.5 h-4 bg-foreground/60 rounded-full"
              style={{ left: `${dayProgress}%` }}
            />
          )}
        </div>
        <div className="flex justify-between">
          {timeMarkers.filter((_, i) => i % 2 === 0).map((h) => (
            <span key={h} className="text-[10px] text-muted-foreground/50 font-mono">
              {String(h).padStart(2, "0")}:00
            </span>
          ))}
        </div>
      </div>

      {/* Appointment cards */}
      <div className="space-y-2">
        {todayAppts.map((a) => {
          const status = statusConfig[a.status];
          const isNext = a.id === nextUpcomingId;
          return (
            <button
              key={a.id}
              onClick={() => navigate(`/appointments/${a.id}`)}
              className={`
                w-full text-left px-4 py-3.5 rounded-lg border border-border
                border-l-[3px] ${status.borderColor}
                hover:border-[hsl(174,20%,30%)] transition-all duration-150 group flex items-center gap-4
                ${isNext ? "bg-[hsl(220,18%,12%)]" : "bg-card"}
              `}
            >
              {/* Patient initials avatar */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-semibold shrink-0 ${getInitialsBg(a.patientId)}`}>
                {getInitials(a.patientName)}
              </div>

              {/* Time */}
              <div className="text-sm font-mono text-muted-foreground w-12 shrink-0">
                {a.time}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground text-sm">{a.patientName}</p>
                <p className="text-sm text-muted-foreground truncate">{a.motif}</p>
              </div>

              {/* Status badge — muted with dot */}
              <div className="flex items-center gap-1.5 shrink-0">
                <span className={`w-1.5 h-1.5 rounded-full ${status.dotColor}`} />
                <span className="text-[11px] text-muted-foreground">{status.label}</span>
              </div>

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
