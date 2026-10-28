import { createFileRoute } from "@tanstack/react-router";
import { Database, Plus, RefreshCw, Server } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AppShell, PageHeader } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { databases as seedDatabases, type DatabaseRecord } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/databases")({
  head: () => ({
    meta: [
      { title: "Databases — DBVerse" },
      {
        name: "description",
        content:
          "Connect and monitor PostgreSQL, MySQL, SQL Server and SQLite databases with live connection health.",
      },
      { property: "og:title", content: "Database Management — DBVerse" },
      {
        property: "og:description",
        content: "Add databases and monitor host, port, status and connection health.",
      },
    ],
  }),
  component: Databases,
});

const statusStyles: Record<DatabaseRecord["status"], string> = {
  connected: "bg-success/15 text-success border-success/30",
  degraded: "bg-warning/15 text-warning border-warning/30",
  offline: "bg-destructive/15 text-destructive border-destructive/30",
};

function Databases() {
  const [list, setList] = useState(seedDatabases);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    engine: "PostgreSQL",
    host: "",
    port: "5432",
  });

  const addDatabase = (e: React.FormEvent) => {
    e.preventDefault();
    const record: DatabaseRecord = {
      id: `db_${Date.now()}`,
      name: form.name,
      engine: form.engine as DatabaseRecord["engine"],
      host: form.host,
      port: Number(form.port),
      status: "connected",
      health: 100,
      sizeGb: 0.1,
      commits: 0,
      branches: 1,
      lastSync: "just now",
    };
    setList((prev) => [record, ...prev]);
    setOpen(false);
    setForm({ name: "", engine: "PostgreSQL", host: "", port: "5432" });
    toast.success(`Connected to ${record.name}`, {
      description: "Change tracking is now active on this database.",
    });
  };

  return (
    <AppShell>
      <PageHeader
        title="Databases"
        description="Every connected database is continuously versioned — no agents, no full backups."
        actions={
          <>
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => toast.info("Health check complete", { description: "4 of 5 databases healthy." })}
            >
              <RefreshCw className="size-4" /> Test connections
            </Button>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="size-4" /> Add database
                </Button>
              </DialogTrigger>
              <DialogContent>
                <form onSubmit={addDatabase}>
                  <DialogHeader>
                    <DialogTitle>Connect a database</DialogTitle>
                    <DialogDescription>
                      DBVerse starts recording commits as soon as the connection succeeds.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-5">
                    <div className="space-y-2">
                      <Label htmlFor="db-name">Database name</Label>
                      <Input
                        id="db-name"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="orders_prod"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Engine</Label>
                      <Select
                        value={form.engine}
                        onValueChange={(v) => setForm({ ...form, engine: v })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {["PostgreSQL", "MySQL", "SQL Server", "SQLite"].map((e) => (
                            <SelectItem key={e} value={e}>
                              {e}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-[2fr_1fr]">
                      <div className="space-y-2">
                        <Label htmlFor="db-host">Host</Label>
                        <Input
                          id="db-host"
                          required
                          value={form.host}
                          onChange={(e) => setForm({ ...form, host: e.target.value })}
                          placeholder="db.company.internal"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="db-port">Port</Label>
                        <Input
                          id="db-port"
                          required
                          value={form.port}
                          onChange={(e) => setForm({ ...form, port: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" className="gap-2">
                      <Database className="size-4" /> Connect
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {list.map((db) => (
          <Card key={db.id} className="surface-card transition-transform hover:-translate-y-1">
            <CardHeader className="flex-row items-start justify-between space-y-0">
              <div className="space-y-1">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Server className="size-4 text-primary" />
                  {db.name}
                </CardTitle>
                <CardDescription>{db.engine}</CardDescription>
              </div>
              <Badge variant="outline" className={cn("capitalize", statusStyles[db.status])}>
                {db.status}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <dl className="grid grid-cols-2 gap-3 text-sm">
                <Meta label="Host" value={db.host} />
                <Meta label="Port" value={db.port === 0 ? "—" : String(db.port)} />
                <Meta label="Commits" value={db.commits.toLocaleString()} />
                <Meta label="Branches" value={String(db.branches)} />
                <Meta label="Size" value={`${db.sizeGb} GB`} />
                <Meta label="Last sync" value={db.lastSync} />
              </dl>
              <div>
                <div className="mb-1.5 flex justify-between text-xs text-muted-foreground">
                  <span>Connection health</span>
                  <span>{db.health}%</span>
                </div>
                <Progress value={db.health} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="truncate font-medium">{value}</dd>
    </div>
  );
}
