import { useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Phone, Clock, TrendingUp, TrendingDown, Minus, ChevronDown, ChevronUp, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { calls } from "@/data/mockData";

const evolutionConfig = {
  improvement: { icon: TrendingDown, label: "Amélioration", color: "bg-success/15 text-success border-success/30" },
  worsening: { icon: TrendingUp, label: "Aggravation", color: "bg-destructive/15 text-destructive border-destructive/30" },
  stable: { icon: Minus, label: "Stable", color: "bg-muted text-muted-foreground border-border" },
};

const urgencyColor = (score: number) => {
  if (score >= 7) return "bg-destructive text-destructive-foreground";
  if (score >= 4) return "bg-warning text-warning-foreground";
  return "bg-success text-success-foreground";
};

export default function CallHistory() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Historique des Appels</h1>
        <p className="text-muted-foreground mt-1">Consultez vos échanges avec l'assistant IA MedVoice</p>
      </div>

      {/* Timeline */}
      <div className="relative">
        <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-border" />

        <div className="space-y-4">
          {calls.map((call) => {
            const evo = evolutionConfig[call.evolution];
            const EvoIcon = evo.icon;
            const isExpanded = expandedId === call.id;

            return (
              <div key={call.id} className="relative pl-12">
                {/* Timeline dot */}
                <div className="absolute left-2.5 top-5 h-4 w-4 rounded-full bg-primary border-2 border-card z-10" />

                <Card
                  className={`cursor-pointer transition-shadow hover:shadow-md ${isExpanded ? "ring-1 ring-primary/30" : ""}`}
                  onClick={() => setExpandedId(isExpanded ? null : call.id)}
                >
                  <CardContent className="p-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-primary" />
                          <span className="font-semibold text-foreground">{call.motif}</span>
                        </div>
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                          <Clock className="h-3 w-3" />
                          {format(new Date(call.date), "d MMMM yyyy", { locale: fr })} · {call.duration}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge className={`${evo.color} text-xs`}>
                          <EvoIcon className="h-3 w-3 mr-1" />
                          {evo.label}
                        </Badge>
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                    </div>

                    {/* Symptom tags */}
                    <div className="flex gap-1.5 flex-wrap mt-3">
                      {call.symptoms.map((s) => (
                        <Badge key={s} variant="secondary" className="text-[10px] px-2 py-0.5">
                          {s}
                        </Badge>
                      ))}
                      <Badge className={`${urgencyColor(call.urgencyScore)} text-[10px] px-2 py-0.5`}>
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Urgence: {call.urgencyScore}/10
                      </Badge>
                    </div>

                    {/* Expanded detail */}
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-border space-y-4">
                        <div>
                          <h4 className="text-sm font-semibold text-foreground mb-1">Résumé IA</h4>
                          <p className="text-sm text-muted-foreground leading-relaxed">{call.summary}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-foreground mb-2">Recommandations</h4>
                          <ul className="space-y-1">
                            {call.recommendations.map((r, i) => (
                              <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                                <span className="text-primary mt-0.5">•</span>
                                {r}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
