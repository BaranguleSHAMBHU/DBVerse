import { createFileRoute } from "@tanstack/react-router";
import { Download, FileText, Search, ShieldAlert } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { AppShell, PageHeader } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { auditLog, type AuditEntry } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/audit")({
  head: () => ({
    meta: [
      { title: "Audit Logs — DBVerse" },
      {
        name: "description",
        content:
          "Searchable, exportable audit trail of every action taken against your databases.",
      },
      { property: "og:title", content: "Audit Logs — DBVerse" },
      {
        property: "og:description",
        content: "Export audit history to CSV or PDF for compliance reviews.",
      },
    ],
  }),
  component: AuditPage,
});

const severityStyles: Record<AuditEntry["severity"], string> = {
  info: "border-primary/30 bg-primary/15 text-primary",
  warning: "border-warning/30 bg-warning/15 text-warning",
  critical: "border-destructive/30 bg-destructive/15 text-destructive",
};

function AuditPage() {
  const [query, setQuery] = useState("");

  const rows = useMemo(() => {
    const q = query.toLowerCase();
    return auditLog.filter(
      (l) =>
        !q ||
        l.actor.includes(q) ||
        l.action.toLowerCase().includes(q) ||
        l.target.includes(q) ||
        l.severity.includes(q),
    );
  }, [query]);

  const exportCsv = () => {
    const csv = [
      "id,actor,action,target,ip,severity,timestamp",
      ...rows.map((r) =>
        [r.id, r.actor, r.action, r.target, r.ip, r.severity, r.timestamp].join(","),
      ),
    ].join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "dbverse-audit-log.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exported", { description: `${rows.length} entries downloaded.` });
  };

  return (
    <AppShell>
      <PageHeader
        title="Audit logs"
        description="Immutable record of who did what, when, and from where."
        actions={
          <>
            <Button variant="outline" className="gap-2" onClick={exportCsv}>
              <Download className="size-4" /> Export CSV
            </Button>
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => {
                window.print();
                toast.info("PDF export", { description: "Use 'Save as PDF' in the print dialog." });
              }}
            >
              <FileText className="size-4" /> Export PDF
            </Button>
          </>
        }
      />

      <Card className="surface-card">
        <CardContent className="space-y-4 p-4 sm:p-6">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search actor, action, database or severity…"
              className="pl-9"
            />
          </div>

          <div className="overflow-x-auto rounded-xl border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Log ID</TableHead>
                  <TableHead>Actor</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Target</TableHead>
                  <TableHead>IP</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((l) => (
                  <TableRow key={l.id} className="hover:bg-muted/50">
                    <TableCell className="font-mono text-xs text-muted-foreground">{l.id}</TableCell>
                    <TableCell className="font-medium">{l.actor}</TableCell>
                    <TableCell>{l.action}</TableCell>
                    <TableCell className="font-mono text-xs">{l.target}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{l.ip}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn("capitalize", severityStyles[l.severity])}
                      >
                        {l.severity === "critical" ? (
                          <ShieldAlert className="mr-1 size-3" />
                        ) : null}
                        {l.severity}
                      </Badge>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                      {new Date(l.timestamp).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
                {rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
                      No log entries match your search.
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </div>
          <p className="text-xs text-muted-foreground">{rows.length} entries</p>
        </CardContent>
      </Card>
    </AppShell>
  );
}
