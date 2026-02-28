import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Activity } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Veuillez remplir tous les champs.");
      return;
    }
    const success = login(email, password);
    if (success) {
      // Redirect handled by App routing based on role
      navigate("/");
    } else {
      setError("Identifiants incorrects.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative" style={{ background: 'radial-gradient(ellipse at 50% 0%, hsl(220 20% 11%) 0%, hsl(220 20% 7%) 60%, hsl(220 22% 5%) 100%)' }}>
      {/* Subtle noise overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")', backgroundRepeat: 'repeat', backgroundSize: '128px 128px' }} />

      <div className="w-full max-w-sm space-y-0 relative z-10">
        {/* Logo area */}
        <div className="text-center space-y-3 pb-7">
          <div className="mx-auto h-11 w-11 rounded-lg bg-[hsl(174,40%,20%)]/40 border border-[hsl(174,30%,35%)]/30 flex items-center justify-center">
            <Activity className="h-5 w-5 text-[hsl(174,35%,55%)]" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground tracking-tight">MedVoice</h1>
            <p className="text-xs text-muted-foreground mt-1 tracking-wide">Clinical AI Assistant</p>
          </div>
        </div>

        {/* Separator */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent mb-7" />

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-[11px] text-muted-foreground uppercase tracking-wider font-normal">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="h-11 bg-[hsl(220,15%,13%)] border-[hsl(220,12%,22%)] placeholder:text-muted-foreground/40 focus-visible:ring-[hsl(174,35%,45%)] focus-visible:border-[hsl(174,25%,30%)]"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-[11px] text-muted-foreground uppercase tracking-wider font-normal">Mot de passe</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="h-11 bg-[hsl(220,15%,13%)] border-[hsl(220,12%,22%)] placeholder:text-muted-foreground/40 focus-visible:ring-[hsl(174,35%,45%)] focus-visible:border-[hsl(174,25%,30%)]"
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button
            type="submit"
            className="w-full h-11 font-medium bg-[hsl(174,40%,38%)] hover:bg-[hsl(174,40%,42%)] text-white border-0 shadow-lg shadow-[hsl(174,40%,30%)]/10 transition-all duration-200"
          >
            Se connecter
          </Button>

          <div className="text-[11px] text-center text-muted-foreground/70 space-y-1 pt-3">
            <p>Docteur : <span className="text-foreground/50 font-mono text-[10px]">dr.martin@medvoice.fr</span></p>
            <p>Patient : <span className="text-foreground/50 font-mono text-[10px]">marie.dupont@email.com</span></p>
            <p className="text-[10px] text-muted-foreground/40 mt-1.5">Mot de passe : n'importe lequel</p>
          </div>
        </form>
      </div>
    </div>
  );
}
