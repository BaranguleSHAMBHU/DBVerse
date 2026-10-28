import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, GitCompareArrows, Minus, Pencil, Plus } from "lucide-react";
import { useState } from "react";

import { AppShell, PageHeader } from "@/components/app-shell";
import { RollbackButton } from "@/routes/history";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { commits, diffRows, schemaChanges } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/diff")({
  head: () => ({
    meta: [
      { title: "Diff Viewer — DBVerse" },
      {
        name: "description",
        content:
          "Compare any two database versions with GitHub-style colour coded row and schema diffs.",
      },
      { property: "og:title", content: "Database Diff Viewer — DBVerse" },
      {
        property: "og:description",
        content: "Inserted, deleted and modified rows plus schema changes, side by side.",
      },
    ],
  }),
  component: DiffPage,
});

const kindStyles = {
  inserted: {
    icon: Plus,
    row: "border-l-4 border-success bg-success/10",
    label: "text-success",
  },
  deleted: {
    icon: Minus,
    row: "border-l-4 border-destructive bg-destructive/10",
    label: "text-destructive",
  },
  modified: {
    icon: Pencil,
    row: "border-l-4 border-warning bg-warning/10",
    label: "text-warning",
  },
} as const;

function DiffPage() {
  const options = commits.slice(0, 12);
  const [base, setBase] = useState(options[4]!.id);
  const [target, setTarget] = useState(options[0]!.id);

  const counts = {
    inserted: diffRows.filter((r) => r.kind === "inserted").length,
    deleted: diffRows.filter((r) => r.kind === "deleted").length,
    modified: diffRows.filter((r) => r.kind === "modified").length,
  };

  return (
    <AppShell>
      <PageHeader
        title="Diff viewer"
        description="Compare two versions and see exactly which rows and schema objects changed."
      />

      <Card className="surface-card">
        <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:p-6">
          <Select value={base} onValueChange={setBase}>
            <SelectTrigger className="sm:w-64">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {options.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.id} · {c.message.slice(0, 26)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <ArrowRight className="mx-auto size-4 shrink-0 text-muted-foreground sm:mx-0" />
          <Select value={target} onValueChange={setTarget}>
            <SelectTrigger className="sm:w-64">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {options.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.id} · {c.message.slice(0, 26)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex flex-wrap gap-2 sm:ml-auto">
            <Badge variant="outline" className="border-success/30 bg-success/15 text-success">
              +{counts.inserted} inserted
            </Badge>
            <Badge variant="outline" className="border-warning/30 bg-warning/15 text-warning">
              ~{counts.modified} modified
            </Badge>
            <Badge variant="outline" className="border-destructive/30 bg-destructive/15 text-destructive">
              -{counts.deleted} deleted
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="rows">
        <TabsList>
          <TabsTrigger value="rows">Row changes</TabsTrigger>
          <TabsTrigger value="schema">Schema changes</TabsTrigger>
        </TabsList>

        <TabsContent value="rows">
          <Card className="surface-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <GitCompareArrows className="size-4 text-primary" /> {base} → {target}
              </CardTitle>
              <CardDescription>{diffRows.length} row-level changes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {diffRows.map((r, i) => {
                const style = kindStyles[r.kind];
                return (
                  <div
                    key={`${r.pk}-${i}`}
                    className={cn("rounded-r-xl p-3 font-mono text-xs", style.row)}
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <style.icon className={cn("size-3.5", style.label)} />
                      <span className="font-sans text-sm font-medium">{r.table}</span>
                      <span className="text-muted-foreground">{r.pk}</span>
                      {r.column ? (
                        <Badge variant="outline" className="font-mono text-[10px]">
                          {r.column}
                        </Badge>
                      ) : null}
                      <span className="ml-auto">
                        <RollbackButton label={r.pk} />
                      </span>
                    </div>
                    <div className="mt-2 space-y-1">
                      {r.before ? (
                        <p className="text-destructive">- {r.before}</p>
                      ) : null}
                      {r.after ? <p className="text-success">+ {r.after}</p> : null}
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schema">
          <Card className="surface-card">
            <CardHeader>
              <CardTitle className="text-base">Schema changes</CardTitle>
              <CardDescription>DDL applied between the two versions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {schemaChanges.map((s) => (
                <div
                  key={s.statement}
                  className={cn(
                    "rounded-r-xl p-3 font-mono text-xs",
                    s.kind === "added" && kindStyles.inserted.row,
                    s.kind === "removed" && kindStyles.deleted.row,
                    s.kind === "changed" && kindStyles.modified.row,
                  )}
                >
                  {s.kind === "removed" ? "- " : s.kind === "added" ? "+ " : "~ "}
                  {s.statement}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}
