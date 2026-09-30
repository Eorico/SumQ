import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

import logo from "@/assets/sumo-logo.png.asset.json";

export function SumoLogo({ className = "h-12 w-auto" }: { className?: string }) {
  return <img src={logo.url} alt="Sumo Quiz logo" className={className} />;
}

export function Shell({ children, wide = false }: { children: ReactNode; wide?: boolean }) {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3">
          <Link to="/" className="flex items-center gap-3">
            <SumoLogo className="h-10 w-auto drop-shadow-sm" />
            <span className="font-display text-lg font-bold tracking-tight">Sumo Quiz</span>
          </Link>
          <nav className="flex items-center gap-1 text-sm font-semibold">
            <NavLink to="/create">Create</NavLink>
            <NavLink to="/games">My Games</NavLink>
            <NavLink to="/how-to-play">How to Play</NavLink>
          </nav>
        </div>
      </header>
      <main className={`mx-auto px-5 py-10 ${wide ? "max-w-[1700px]" : "max-w-5xl"}`}>
        {children}
      </main>
    </div>
  );
}

function NavLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link
      to={to}
      className="rounded-full px-3 py-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
      activeProps={{ className: "bg-secondary text-foreground" }}
    >
      {children}
    </Link>
  );
}
