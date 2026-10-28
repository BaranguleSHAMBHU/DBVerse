import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  ArrowUpRight,
  Database,
  GitBranch,
  GitCommitHorizontal,
  HardDrive,
  Undo2,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { AppShell, PageHeader } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  commitActivity,
  commits,
  dashboardStats,
  databases,
  operationMix,
  storageTrend,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — DBVerse" },
      {
        name: "description",
        content:
          "Live analytics for connected databases, commits today, rollbacks, active branches and storage usage.",
      },
      { property: "og:title", content: "DBVerse Dashboard" },
      {
        property: "og:description",
        content: "Database version control analytics at a glance.",
      },
    ],
  }),
  component: Dashboard,
});

const stats = [
  {
    label: "Connected databases",
    value: dashboardStats.databases,
    delta: "+1 this week",
    icon: Database,
    tone: "text-primary",
  },
  {
    label: "Commits today",
    value: dashboardStats.commitsToday,
    delta: "+18% vs yesterday",
    icon: GitCommitHorizontal,
    tone: "text-accent",
  },
  {
    label: "Rollbacks",
    value: dashboardStats.rollbacks,
    delta: "18,240 rows restored",
    icon: Undo2,
    tone: "text-warning",
  },
  {
    label: "Active branches",
    value: dashboardStats.activeBranches,
    delta: "2 awaiting merge",
    icon: GitBranch,
    tone: "text-success",
  },
];

const chartTooltip = {
  contentStyle: {
    background: "var(--color-popover)",
    border: "1px solid var(--color-border)",
    borderRadius: "12px",
    color: "var(--color-popover-foreground)",
    fontSize: "12px",
  },
};

function Dashboard() {
  const storagePct = Math.round(
    (dashboardStats.storageUsed / dashboardStats.storageQuota) * 100,
  );

  return (
    <AppShell>
      <PageHeader
        title="Dashboard"
        description="A live view of every tracked change across your connected databases."
        actions={
          <>
            <Button variant="outline" asChild>
              <Link to="/diff">Compare versions</Link>
            </Button>
            <Button asChild>
              <Link to="/databases">Add database</Link>
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="surface-card transition-transform hover:-translate-y-1">
            <CardContent className="space-y-3 p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{s.label}</p>
                <s.icon className={cn("size-4", s.tone)} />
              </div>
              <p className="text-3xl font-semibold tracking-tight">{s.value}</p>
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                <ArrowUpRight className="size-3 text-success" />
                {s.delta}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="surface-card lg:col-span-2">
          <CardHeader>
            <CardTitle>Commit activity</CardTitle>
            <CardDescription>Commits vs rollbacks over the last 7 days</CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={commitActivity}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="day" stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip {...chartTooltip} cursor={{ fill: "var(--color-muted)", opacity: 0.3 }} />
                <Bar dataKey="commits" fill="var(--color-chart-1)" radius={[8, 8, 0, 0]} />
                <Bar dataKey="rollbacks" fill="var(--color-chart-4)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="surface-card">
          <CardHeader>
            <CardTitle>Operation mix</CardTitle>
            <CardDescription>Tracked operations this week</CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={operationMix}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={58}
                  outerRadius={92}
                  paddingAngle={4}
                  stroke="none"
                >
                  {operationMix.map((slice) => (
                    <Cell key={slice.name} fill={slice.color} />
                  ))}
                </Pie>
                <Tooltip {...chartTooltip} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="surface-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HardDrive className="size-4 text-accent" /> Storage used
            </CardTitle>
            <CardDescription>
              {dashboardStats.storageUsed} GB of {dashboardStats.storageQuota} GB
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress value={storagePct} />
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={storageTrend}>
                  <defs>
                    <linearGradient id="storageFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-chart-2)" stopOpacity={0.6} />
                      <stop offset="100%" stopColor="var(--color-chart-2)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Tooltip {...chartTooltip} />
                  <Area
                    dataKey="storage"
                    stroke="var(--color-chart-2)"
                    strokeWidth={2}
                    fill="url(#storageFill)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="surface-card lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Activity className="size-4 text-primary" /> Recent activity
              </CardTitle>
              <CardDescription>Latest commits across all branches</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/history">View all</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-1">
            {commits.slice(0, 6).map((c) => (
              <div
                key={c.id}
                className="flex items-center gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-muted/60"
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 font-mono text-[10px] text-primary">
                  {c.id.slice(0, 4)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{c.message}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {c.author} · {c.database} · {c.rows} rows
                  </p>
                </div>
                <Badge variant="outline" className="hidden shrink-0 font-mono text-[10px] sm:inline-flex">
                  {c.operation}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="surface-card">
        <CardHeader>
          <CardTitle>Connection health</CardTitle>
          <CardDescription>Live status for every connected database</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {databases.map((db) => (
            <div key={db.id} className="rounded-2xl border border-border p-4">
              <div className="flex items-center justify-between">
                <p className="font-medium">{db.name}</p>
                <span
                  className={cn(
                    "size-2 rounded-full",
                    db.status === "connected" && "bg-success",
                    db.status === "degraded" && "bg-warning",
                    db.status === "offline" && "bg-destructive",
                  )}
                />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{db.engine}</p>
              <Progress value={db.health} className="mt-3" />
              <p className="mt-2 text-xs text-muted-foreground">{db.health}% health</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </AppShell>
  );
}
