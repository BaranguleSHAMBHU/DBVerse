import { createFileRoute } from "@tanstack/react-router";
import { Copy, KeyRound, Moon, Save, Sun, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AppShell, PageHeader } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { databases } from "@/lib/mock-data";
import { useTheme } from "@/lib/theme";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — DBVerse" },
      {
        name: "description",
        content:
          "Manage your profile, appearance, database credentials, API keys and notification preferences.",
      },
      { property: "og:title", content: "Settings — DBVerse" },
      {
        property: "og:description",
        content: "Theme, credentials, profile and API key management.",
      },
    ],
  }),
  component: SettingsPage,
});

const apiKeys = [
  { id: "key_prod", label: "Production CI", value: "dbv_live_9f31…a72c", created: "12 Jun 2026" },
  { id: "key_dev", label: "Local development", value: "dbv_test_44b1…10de", created: "02 Jul 2026" },
];

function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState({
    commits: true,
    rollbacks: true,
    connection: true,
    weekly: false,
  });

  return (
    <AppShell>
      <PageHeader title="Settings" description="Workspace, appearance and security preferences." />

      <Tabs defaultValue="profile">
        <TabsList className="flex-wrap">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="credentials">Credentials</TabsTrigger>
          <TabsTrigger value="keys">API keys</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card className="surface-card">
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>How you appear on commits and audit entries.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="p-name">Full name</Label>
                <Input id="p-name" defaultValue="Aarav Mehta" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="p-handle">Commit handle</Label>
                <Input id="p-handle" defaultValue="aarav.m" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="p-email">Email</Label>
                <Input id="p-email" type="email" defaultValue="aarav@dbverse.io" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="p-role">Role</Label>
                <Input id="p-role" defaultValue="Database Administrator" />
              </div>
              <div className="sm:col-span-2">
                <Button className="gap-2" onClick={() => toast.success("Profile updated")}>
                  <Save className="size-4" /> Save changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card className="surface-card">
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Pick the theme for your workspace.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              <Button
                variant={theme === "dark" ? "default" : "outline"}
                className="gap-2"
                onClick={() => setTheme("dark")}
              >
                <Moon className="size-4" /> Dark
              </Button>
              <Button
                variant={theme === "light" ? "default" : "outline"}
                className="gap-2"
                onClick={() => setTheme("light")}
              >
                <Sun className="size-4" /> Light
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="credentials">
          <Card className="surface-card">
            <CardHeader>
              <CardTitle>Database credentials</CardTitle>
              <CardDescription>
                Credentials are encrypted at rest and never leave your workspace.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {databases.map((db) => (
                <div key={db.id} className="rounded-2xl border border-border p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="font-medium">{db.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {db.engine} · {db.host}
                        {db.port ? `:${db.port}` : ""}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toast.success(`Credentials rotated for ${db.name}`)}
                    >
                      Rotate password
                    </Button>
                  </div>
                  <Separator className="my-3" />
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor={`${db.id}-user`}>Username</Label>
                      <Input id={`${db.id}-user`} defaultValue="dbverse_agent" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`${db.id}-pass`}>Password</Label>
                      <Input id={`${db.id}-pass`} type="password" defaultValue="••••••••••••" />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="keys">
          <Card className="surface-card">
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle>API keys</CardTitle>
                <CardDescription>Use these to push commits from CI pipelines.</CardDescription>
              </div>
              <Button className="gap-2" onClick={() => toast.success("New API key generated")}>
                <KeyRound className="size-4" /> New key
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {apiKeys.map((k) => (
                <div
                  key={k.id}
                  className="flex flex-wrap items-center gap-3 rounded-2xl border border-border p-4"
                >
                  <div className="min-w-0">
                    <p className="font-medium">{k.label}</p>
                    <p className="font-mono text-xs text-muted-foreground">{k.value}</p>
                  </div>
                  <Badge variant="outline" className="ml-auto">
                    created {k.created}
                  </Badge>
                  <Button
                    size="icon"
                    variant="ghost"
                    aria-label="Copy key"
                    onClick={() => toast.success("API key copied to clipboard")}
                  >
                    <Copy className="size-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    aria-label="Revoke key"
                    className="text-destructive hover:text-destructive"
                    onClick={() => toast.warning(`${k.label} key revoked`)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="surface-card">
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Choose what DBVerse should alert you about.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {(
                [
                  ["commits", "New commits", "Notify when a new commit is recorded"],
                  ["rollbacks", "Rollback complete", "Notify when a rollback finishes"],
                  ["connection", "Connection lost", "Alert when a database goes offline"],
                  ["weekly", "Weekly digest", "Summary of activity every Monday"],
                ] as const
              ).map(([key, title, desc]) => (
                <div key={key} className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium">{title}</p>
                    <p className="text-xs text-muted-foreground">{desc}</p>
                  </div>
                  <Switch
                    checked={notifications[key]}
                    onCheckedChange={(v) => {
                      setNotifications((prev) => ({ ...prev, [key]: v }));
                      toast.success(`${title} ${v ? "enabled" : "disabled"}`);
                    }}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}
