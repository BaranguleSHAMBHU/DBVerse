import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { GitBranch, Loader2, Lock, Mail, User } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { BrandMark } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — DBVerse" },
      {
        name: "description",
        content: "Sign in, create an account or reset your password to access DBVerse.",
      },
      { property: "og:title", content: "Sign in to DBVerse" },
      {
        property: "og:description",
        content: "Access your database version control workspace.",
      },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const submit = (label: string, redirect: boolean) => (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success(label);
      if (redirect) navigate({ to: "/dashboard" });
    }, 700);
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="grid-backdrop hidden flex-col justify-between border-r border-border p-12 lg:flex">
        <BrandMark />
        <div className="space-y-6">
          <h2 className="max-w-md text-4xl font-semibold leading-tight">
            Never restore a full backup <span className="gradient-text">again</span>.
          </h2>
          <p className="max-w-md text-muted-foreground">
            DBVerse gives your team commit history, diffs, branching and row-level rollback
            across PostgreSQL, MySQL, SQL Server and SQLite.
          </p>
          <div className="glass-panel w-fit rounded-2xl px-4 py-3 font-mono text-sm">
            <span className="text-success">+ 412 inserted</span>{" "}
            <span className="text-warning">~ 318 modified</span>{" "}
            <span className="text-destructive">- 126 deleted</span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">Trusted by 2,400+ engineering teams</p>
      </div>

      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-6">
          <div className="lg:hidden">
            <BrandMark />
          </div>

          <Tabs defaultValue="login">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
              <TabsTrigger value="forgot">Reset</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <Card className="surface-card">
                <CardHeader>
                  <CardTitle>Welcome back</CardTitle>
                  <CardDescription>Sign in to your DBVerse workspace.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4" onSubmit={submit("Signed in to DBVerse", true)}>
                    <Field id="email" label="Work email" icon={Mail} type="email" placeholder="you@company.com" />
                    <Field id="password" label="Password" icon={Lock} type="password" placeholder="••••••••" />
                    <Button className="w-full" disabled={loading}>
                      {loading ? <Loader2 className="size-4 animate-spin" /> : <GitBranch className="size-4" />}
                      Sign in
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="register">
              <Card className="surface-card">
                <CardHeader>
                  <CardTitle>Create your account</CardTitle>
                  <CardDescription>Start tracking database changes in minutes.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4" onSubmit={submit("Account created", true)}>
                    <Field id="name" label="Full name" icon={User} placeholder="Aarav Mehta" />
                    <Field id="remail" label="Work email" icon={Mail} type="email" placeholder="you@company.com" />
                    <Field id="rpassword" label="Password" icon={Lock} type="password" placeholder="At least 8 characters" />
                    <Button className="w-full" disabled={loading}>
                      {loading ? <Loader2 className="size-4 animate-spin" /> : null}
                      Create account
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="forgot">
              <Card className="surface-card">
                <CardHeader>
                  <CardTitle>Reset password</CardTitle>
                  <CardDescription>We'll email you a secure reset link.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4" onSubmit={submit("Reset link sent", false)}>
                    <Field id="femail" label="Work email" icon={Mail} type="email" placeholder="you@company.com" />
                    <Button className="w-full" variant="secondary" disabled={loading}>
                      {loading ? <Loader2 className="size-4 animate-spin" /> : null}
                      Send reset link
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <p className="text-center text-xs text-muted-foreground">
            Demo workspace — any credentials work.{" "}
            <Link to="/dashboard" className="text-primary hover:underline">
              Skip to dashboard
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({
  id,
  label,
  icon: Icon,
  ...props
}: {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input id={id} required className="pl-9" {...props} />
      </div>
    </div>
  );
}
