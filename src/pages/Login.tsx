import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Activity } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("dr.martin@medvoice.fr");
  const [password, setPassword] = useState("demo1234");
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
    if (success) navigate("/");
    else setError("Identifiants incorrects.");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center space-y-3">
          <div className="mx-auto h-12 w-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Activity className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-semibold text-foreground tracking-tight">MedVoice</h1>
          <p className="text-sm text-muted-foreground">Clinical AI Assistant</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-xs text-muted-foreground uppercase tracking-wider">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 bg-card border-border"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-xs text-muted-foreground uppercase tracking-wider">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11 bg-card border-border"
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" className="w-full h-11 font-medium">
            Se connecter
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Prototype — Cliquez directement sur "Se connecter"
          </p>
        </form>
      </div>
    </div>
  );
}
