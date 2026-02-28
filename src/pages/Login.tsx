import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ClerkLogoMark } from "@/components/ClerkLogo";

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
      navigate("/");
    } else {
      setError("Identifiants incorrects.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <div className="w-full max-w-sm space-y-0">
        {/* Logo area */}
        <div className="text-center space-y-3 pb-7">
          <div className="mx-auto h-11 w-11 rounded-[10px] bg-primary/10 border border-primary/20 flex items-center justify-center">
            <ClerkLogoMark className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground tracking-tight">Clerk</h1>
            <p className="text-xs text-muted-foreground mt-1 tracking-wide">Your AI medical scribe</p>
          </div>
        </div>

        {/* Separator */}
        <div className="w-full h-px bg-border mb-7" />

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
              className="h-11 bg-card border-input placeholder:text-muted-foreground/50 focus-visible:ring-primary focus-visible:border-primary"
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
              className="h-11 bg-card border-input placeholder:text-muted-foreground/50 focus-visible:ring-primary focus-visible:border-primary"
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" className="w-full h-11 font-medium">
            Se connecter
          </Button>

          <div className="text-[11px] text-center text-muted-foreground space-y-1 pt-3">
            <p>Docteur : <span className="text-foreground/60 font-mono text-[10px]">dr.martin@clerk.fr</span></p>
            <p>Patient : <span className="text-foreground/60 font-mono text-[10px]">marie.dupont@email.com</span></p>
            <p className="text-[10px] text-muted-foreground/60 mt-1.5">Mot de passe : n'importe lequel</p>
          </div>
        </form>
      </div>
    </div>
  );
}
