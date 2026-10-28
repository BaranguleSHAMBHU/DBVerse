import { createFileRoute } from "@tanstack/react-router";
import { Filter } from "lucide-react";
import { useState } from "react";

import { AppShell, PageHeader } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { commits, type Operation } from "@/lib/mock-data";
import { operationBadge, operationIcon } from "@/lib/operation-style";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/timeline")({
  head: () => ({
    meta: [
      { title: "Activity Timeline — DBVerse" },
      {
        name: "description",
        content:
          "A chronological timeline of INSERT, UPDATE, DELETE, schema changes and rollbacks across your databases.",
      },
      { property: "og:title", content: "Activity Timeline — DBVerse" },
      {
        property: "og:description",
        content: "Every database operation, in order, with icons and context.",
      },
    ],
  }),
  component: TimelinePage,
});

const filters: Array<"ALL" | Operation> = [
  "ALL",
  "INSERT",
  "UPDATE",
  "DELETE",
  "CREATE TABLE",
  "DROP TABLE",
  "ALTER TABLE",
  "ROLLBACK",
];

function TimelinePage() {
  const [active, setActive] = useState<"ALL" | Operation>("ALL");
  const events = commits
    .filter((c) => active === "ALL" || c.operation === active)
    .slice(0, 24);

  return (
    <AppShell>
      <PageHeader
        title="Activity timeline"
        description="Chronological feed of everything that touched your data."
      />

      <div className="flex flex-wrap items-center gap-2">
        <Filter className="size-4 text-muted-foreground" />
        {filters.map((f) => (
          <Button
            key={f}
            size="sm"
            variant={active === f ? "default" : "outline"}
            className="font-mono text-[11px]"
            onClick={() => setActive(f)}
          >
            {f}
          </Button>
        ))}
      </div>

      <Card className="surface-card">
        <CardContent className="p-4 sm:p-8">
          <div className="relative space-y-6 border-l border-border pl-8">
            {events.map((e) => {
              const Icon = operationIcon[e.operation];
              return (
                <div key={e.id} className="relative">
                  <span className="absolute -left-[45px] flex size-8 items-center justify-center rounded-full border border-border bg-card">
                    <Icon className="size-4 text-primary" />
                  </span>
                  <div className="rounded-2xl border border-border bg-muted/30 p-4 transition-colors hover:bg-muted/60">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline" className={cn(operationBadge(e.operation))}>
                        {e.operation}
                      </Badge>
                      <span className="font-mono text-xs text-primary">{e.id}</span>
                      <span className="ml-auto text-xs text-muted-foreground">
                        {new Date(e.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="mt-2 text-sm font-medium">{e.message}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {e.author} · {e.database} · {e.branch} · {e.tables.join(", ")} ·{" "}
                      {e.rows} rows
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </AppShell>
  );
}
