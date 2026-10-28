export type Engine = "PostgreSQL" | "MySQL" | "SQL Server" | "SQLite";

export type DatabaseRecord = {
  id: string;
  name: string;
  engine: Engine;
  host: string;
  port: number;
  status: "connected" | "degraded" | "offline";
  health: number;
  sizeGb: number;
  commits: number;
  branches: number;
  lastSync: string;
};

export const databases: DatabaseRecord[] = [
  {
    id: "db_orders",
    name: "orders_prod",
    engine: "PostgreSQL",
    host: "db-prod.dbverse.io",
    port: 5432,
    status: "connected",
    health: 98,
    sizeGb: 42.6,
    commits: 12480,
    branches: 4,
    lastSync: "12s ago",
  },
  {
    id: "db_billing",
    name: "billing_core",
    engine: "MySQL",
    host: "mysql-billing.internal",
    port: 3306,
    status: "connected",
    health: 94,
    sizeGb: 18.2,
    commits: 6321,
    branches: 3,
    lastSync: "1m ago",
  },
  {
    id: "db_analytics",
    name: "analytics_warehouse",
    engine: "SQL Server",
    host: "mssql-analytics.corp",
    port: 1433,
    status: "degraded",
    health: 71,
    sizeGb: 91.4,
    commits: 2740,
    branches: 2,
    lastSync: "8m ago",
  },
  {
    id: "db_edge",
    name: "edge_cache",
    engine: "SQLite",
    host: "local://edge-node-3",
    port: 0,
    status: "offline",
    health: 22,
    sizeGb: 0.6,
    commits: 512,
    branches: 1,
    lastSync: "3h ago",
  },
];

export type Operation =
  | "INSERT"
  | "UPDATE"
  | "DELETE"
  | "CREATE TABLE"
  | "DROP TABLE"
  | "ALTER TABLE"
  | "ROLLBACK";

export type Commit = {
  id: string;
  message: string;
  author: string;
  operation: Operation;
  tables: string[];
  rows: number;
  database: string;
  branch: string;
  timestamp: string;
};

const authors = ["aarav.m", "sara.k", "devops-bot", "nikhil.r", "elena.v"];
const messages = [
  "Backfill customer loyalty tiers",
  "Fix duplicate invoice rows",
  "Add index on orders.created_at",
  "Purge stale session records",
  "Migrate payments schema to v3",
  "Update tax rates for Q3",
  "Restore accidentally deleted refunds",
  "Normalize address casing",
  "Create table shipment_events",
  "Drop deprecated table legacy_carts",
  "Alter users add column last_seen_at",
  "Rollback bad price update",
];
const tablePool = [
  "users",
  "orders",
  "payments",
  "invoices",
  "refunds",
  "sessions",
  "products",
  "shipment_events",
];
const ops: Operation[] = [
  "INSERT",
  "UPDATE",
  "DELETE",
  "CREATE TABLE",
  "DROP TABLE",
  "ALTER TABLE",
  "ROLLBACK",
];

function seeded(i: number, mod: number) {
  return (i * 7919 + 104729) % mod;
}

export const commits: Commit[] = Array.from({ length: 96 }, (_, i) => {
  const date = new Date(Date.UTC(2026, 7, 6, 6, 30) - i * 1000 * 60 * 47);
  return {
    id: `c${(9482134 - i * 137).toString(16)}`,
    message: messages[seeded(i, messages.length)]!,
    author: authors[seeded(i, authors.length)]!,
    operation: ops[seeded(i, ops.length)]!,
    tables: [
      tablePool[seeded(i, tablePool.length)]!,
      ...(i % 4 === 0 ? [tablePool[seeded(i + 3, tablePool.length)]!] : []),
    ],
    rows: 1 + seeded(i, 940),
    database: databases[seeded(i, databases.length)]!.name,
    branch: ["main", "main", "feature/pricing-v2", "hotfix/refunds"][seeded(i, 4)]!,
    timestamp: date.toISOString(),
  };
});

export const commitActivity = [
  { day: "Mon", commits: 142, rollbacks: 4 },
  { day: "Tue", commits: 188, rollbacks: 7 },
  { day: "Wed", commits: 164, rollbacks: 2 },
  { day: "Thu", commits: 231, rollbacks: 9 },
  { day: "Fri", commits: 276, rollbacks: 5 },
  { day: "Sat", commits: 98, rollbacks: 1 },
  { day: "Sun", commits: 74, rollbacks: 3 },
];

export const operationMix = [
  { name: "INSERT", value: 412, color: "var(--color-chart-3)" },
  { name: "UPDATE", value: 318, color: "var(--color-chart-1)" },
  { name: "DELETE", value: 126, color: "var(--color-chart-5)" },
  { name: "SCHEMA", value: 84, color: "var(--color-chart-4)" },
];

export const storageTrend = Array.from({ length: 14 }, (_, i) => ({
  day: `D${i + 1}`,
  storage: 38 + i * 1.6 + (i % 3) * 0.9,
}));

export type Branch = {
  id: string;
  name: string;
  base: string;
  author: string;
  commitsAhead: number;
  commitsBehind: number;
  status: "active" | "merged" | "stale";
  updated: string;
};

export const branches: Branch[] = [
  {
    id: "b1",
    name: "main",
    base: "—",
    author: "aarav.m",
    commitsAhead: 0,
    commitsBehind: 0,
    status: "active",
    updated: "2 minutes ago",
  },
  {
    id: "b2",
    name: "feature/pricing-v2",
    base: "main",
    author: "sara.k",
    commitsAhead: 24,
    commitsBehind: 3,
    status: "active",
    updated: "18 minutes ago",
  },
  {
    id: "b3",
    name: "hotfix/refunds",
    base: "main",
    author: "nikhil.r",
    commitsAhead: 6,
    commitsBehind: 0,
    status: "active",
    updated: "1 hour ago",
  },
  {
    id: "b4",
    name: "experiment/partitioning",
    base: "main",
    author: "elena.v",
    commitsAhead: 41,
    commitsBehind: 112,
    status: "stale",
    updated: "9 days ago",
  },
  {
    id: "b5",
    name: "release/2026.07",
    base: "main",
    author: "devops-bot",
    commitsAhead: 0,
    commitsBehind: 0,
    status: "merged",
    updated: "3 weeks ago",
  },
];

export type DiffRow = {
  kind: "inserted" | "deleted" | "modified";
  table: string;
  pk: string;
  column?: string;
  before?: string;
  after?: string;
};

export const diffRows: DiffRow[] = [
  {
    kind: "inserted",
    table: "orders",
    pk: "ord_10492",
    after: "{ total: 249.00, status: 'paid', region: 'IN' }",
  },
  {
    kind: "inserted",
    table: "shipment_events",
    pk: "evt_88123",
    after: "{ order_id: 'ord_10492', state: 'dispatched' }",
  },
  {
    kind: "modified",
    table: "products",
    pk: "prd_331",
    column: "price",
    before: "1299.00",
    after: "1099.00",
  },
  {
    kind: "modified",
    table: "users",
    pk: "usr_9021",
    column: "tier",
    before: "silver",
    after: "gold",
  },
  {
    kind: "deleted",
    table: "sessions",
    pk: "ses_44120",
    before: "{ user_id: 'usr_2210', expires_at: '2026-07-01' }",
  },
  {
    kind: "deleted",
    table: "refunds",
    pk: "rfd_772",
    before: "{ amount: 79.00, reason: 'duplicate' }",
  },
];

export const schemaChanges = [
  { kind: "added", statement: "ALTER TABLE users ADD COLUMN last_seen_at timestamptz" },
  { kind: "added", statement: "CREATE INDEX idx_orders_created_at ON orders(created_at)" },
  { kind: "removed", statement: "DROP TABLE legacy_carts" },
  { kind: "changed", statement: "ALTER TABLE products ALTER COLUMN price TYPE numeric(12,2)" },
];

export type AuditEntry = {
  id: string;
  actor: string;
  action: string;
  target: string;
  ip: string;
  severity: "info" | "warning" | "critical";
  timestamp: string;
};

export const auditLog: AuditEntry[] = Array.from({ length: 40 }, (_, i) => {
  const actions = [
    "Rollback executed",
    "Branch merged",
    "Database connected",
    "API key rotated",
    "Commit reverted",
    "Schema migration applied",
    "Connection lost",
    "User invited",
  ];
  const sev: AuditEntry["severity"][] = ["info", "info", "warning", "critical"];
  return {
    id: `log_${5001 + i}`,
    actor: authors[seeded(i, authors.length)]!,
    action: actions[seeded(i, actions.length)]!,
    target: databases[seeded(i, databases.length)]!.name,
    ip: `10.24.${seeded(i, 200)}.${seeded(i + 5, 250)}`,
    severity: sev[seeded(i, sev.length)]!,
    timestamp: new Date(Date.UTC(2026, 7, 6, 6, 0) - i * 1000 * 60 * 63).toISOString(),
  };
});

export const dashboardStats = {
  databases: databases.length,
  commitsToday: 276,
  rollbacks: 12,
  activeBranches: branches.filter((b) => b.status === "active").length,
  storageUsed: 152.8,
  storageQuota: 250,
  restoredRows: 18240,
};
