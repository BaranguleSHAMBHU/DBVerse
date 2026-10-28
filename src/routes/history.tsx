import { createFileRoute } from "@tanstack/react-router";
import {
  ChevronLeft,
  ChevronRight,
  GitCommitHorizontal,
  Search,
  Undo2,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { AppShell, PageHeader } from "@/components/app-shell";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { commits, type Operation } from "@/lib/mock-data";
import { operationBadge } from "@/lib/operation-style";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "Version History — DBVerse" },
      {
        name: "description",
        content:
          "Git-like commit history for your database: commit id, author, operation, affected tables and rows modified.",
      },
      { property: "og:title", content: "Database Version History — DBVerse" },
      {
        property: "og:description",
        content: "Search, filter and paginate every recorded database commit.",
      },
    ],
  }),
  component: HistoryPage,
});

const PAGE_SIZE = 10;

function HistoryPage() {
  const [query, setQuery] = useState("");
  const [operation, setOperation] = useState<"all" | Operation>("all");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return commits.filter((c) => {
      const matchQ =
        !q ||
        c.message.toLowerCase().includes(q) ||
        c.author.includes(q) ||
        c.id.includes(q) ||
        c.tables.join(" ").includes(q);
      const matchOp = operation === "all" || c.operation === operation;
      return matchQ && matchOp;
    });
  }, [query, operation]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const rows = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  return (
    <AppShell>
      <PageHeader
        title="Version history"
        description="Every transaction recorded as an immutable, reviewable commit."
      />

      <Card className="surface-card">
        <CardContent className="space-y-4 p-4 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
                placeholder="Search message, author, table or commit id…"
                className="pl-9"
              />
            </div>
            <Select
              value={operation}
              onValueChange={(v) => {
                setOperation(v as "all" | Operation);
                setPage(1);
              }}
            >
              <SelectTrigger className="sm:w-52">
                <SelectValue placeholder="All operations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All operations</SelectItem>
                {["INSERT", "UPDATE", "DELETE", "CREATE TABLE", "DROP TABLE", "ALTER TABLE", "ROLLBACK"].map(
                  (op) => (
                    <SelectItem key={op} value={op}>
                      {op}
                    </SelectItem>
                  ),
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="overflow-x-auto rounded-xl border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Commit</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Operation</TableHead>
                  <TableHead>Tables</TableHead>
                  <TableHead className="text-right">Rows</TableHead>
                  <TableHead>When</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((c) => (
                  <TableRow key={c.id} className="hover:bg-muted/50">
                    <TableCell className="font-mono text-xs text-primary">{c.id}</TableCell>
                    <TableCell className="max-w-[240px] truncate font-medium">
                      {c.message}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{c.author}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={operationBadge(c.operation)}>
                        {c.operation}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {c.tables.join(", ")}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">{c.rows}</TableCell>
                    <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                      {new Date(c.timestamp).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <RollbackButton label={c.id} />
                    </TableCell>
                  </TableRow>
                ))}
                {rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="py-10 text-center text-muted-foreground">
                      No commits match your filters.
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">
              <GitCommitHorizontal className="mr-1 inline size-3.5" />
              {filtered.length} commits · page {current} of {pages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={current === 1}
                onClick={() => setPage(current - 1)}
              >
                <ChevronLeft className="size-4" /> Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={current === pages}
                onClick={() => setPage(current + 1)}
              >
                Next <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </AppShell>
  );
}

export function RollbackButton({ label }: { label: string }) {
  const [scope, setScope] = useState("transaction");

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1.5 text-warning hover:text-warning">
          <Undo2 className="size-3.5" /> Rollback
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Rollback commit {label}?</AlertDialogTitle>
          <AlertDialogDescription>
            This creates a new revert commit. The original history is preserved and nothing is
            deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-2">
          <p className="text-sm font-medium">Rollback scope</p>
          <Select value={scope} onValueChange={setScope}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="row">Single row</SelectItem>
              <SelectItem value="transaction">Transaction</SelectItem>
              <SelectItem value="table">Whole table</SelectItem>
              <SelectItem value="version">Entire version</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() =>
              toast.success("Rollback complete", {
                description: `${label} reverted at ${scope} scope.`,
              })
            }
          >
            Confirm rollback
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
