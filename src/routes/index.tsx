import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Database,
  GitBranch,
  GitCompareArrows,
  History,
  ShieldCheck,
  Undo2,
  Zap,
} from "lucide-react";

import { BrandMark } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DBVerse — Git-style Version Control for Databases" },
      {
        name: "description",
        content:
          "DBVerse records every database transaction as a commit. Browse history, diff versions, rollback rows, branch and merge — without full backups.",
      },
      { property: "og:title", content: "DBVerse — Version Control for Your Database" },
      {
        property: "og:description",
        content:
          "Commit history, row-level rollback, branching and audit logs for PostgreSQL, MySQL, SQL Server and SQLite.",
      },
    ],
  }),
  component: Landing,
});

const features = [
  {
    icon: History,
    title: "Every change is a commit",
    body: "Transactions are captured automatically with author, tables touched and rows modified.",
  },
  {
    icon: GitCompareArrows,
    title: "GitHub-style diffs",
    body: "Compare any two versions with row-level and schema-level colour coded diffs.",
  },
  {
    icon: Undo2,
    title: "Surgical rollback",
    body: "Revert a single row, a transaction, a whole table or an entire version in seconds.",
  },
  {
    icon: GitBranch,
    title: "Database branching",
    body: "Branch production safely, experiment, then merge back with conflict awareness.",
  },
  {
    icon: ShieldCheck,
    title: "Audit-ready logs",
    body: "Searchable, exportable audit trail for every modification and every actor.",
  },
  {
    icon: Database,
    title: "Multi-engine",
    body: "PostgreSQL, MySQL, SQL Server and SQLite from one control plane.",
  },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <header className="glass-panel sticky top-0 z-30">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
          <BrandMark />
          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link to="/auth">Sign in</Link>
            </Button>
            <Button asChild>
              <Link to="/dashboard">Open demo</Link>
            </Button>
          </div>
        </div>
      </header>

      <section className="grid-backdrop border-b border-border">
        <div className="mx-auto w-full max-w-6xl px-4 py-24 text-center sm:px-6">
          <Badge variant="outline" className="mb-6 gap-1.5 py-1.5">
            <Zap className="size-3.5 text-accent" /> Now with AI commit summaries
          </Badge>
          <h1 className="mx-auto max-w-4xl text-4xl font-semibold leading-[1.08] tracking-tight sm:text-6xl">
            Git for your <span className="gradient-text">relational database</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg">
            DBVerse turns every INSERT, UPDATE, DELETE and schema migration into a reviewable
            commit — so you can diff, branch, merge and rollback without restoring a single
            backup.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Button size="lg" className="glow-ring gap-2" asChild>
              <Link to="/dashboard">
                Launch dashboard <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/history">Explore commit history</Link>
            </Button>
          </div>

          <div className="mt-16 grid gap-4 sm:grid-cols-4">
            {[
              { k: "12,480", v: "Commits tracked" },
              { k: "18,240", v: "Rows restored" },
              { k: "4", v: "Engines supported" },
              { k: "0", v: "Backups restored" },
            ].map((s) => (
              <Card key={s.v} className="surface-card">
                <CardContent className="p-5 text-left">
                  <p className="text-2xl font-semibold">{s.k}</p>
                  <p className="text-xs text-muted-foreground">{s.v}</p>
                </CardContent>
              </Card>
            ))}

          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
        <h2 className="text-center text-3xl font-semibold tracking-tight">
          Everything your team needs to undo a bad Thursday
        </h2>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <Card key={f.title} className="surface-card transition-transform hover:-translate-y-1">
              <CardContent className="space-y-3 p-6">
                <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <f.icon className="size-5" />
                </span>
                <h3 className="text-base font-semibold">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <footer className="border-t border-border py-10 text-center text-sm text-muted-foreground">
        © 2026 DBVerse. Built for developers who ship on Fridays.
      </footer>
    </div>
  );
}
