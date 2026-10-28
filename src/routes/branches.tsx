import { createFileRoute } from "@tanstack/react-router";
import { GitBranch, GitMerge, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
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
import { branches as seedBranches, type Branch } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/branches")({
  head: () => ({
    meta: [
      { title: "Branches — DBVerse" },
      {
        name: "description",
        content:
          "Create, switch, merge and delete database branches with a visual branch graph.",
      },
      { property: "og:title", content: "Database Branching — DBVerse" },
      {
        property: "og:description",
        content: "Branch production safely, experiment, then merge back.",
      },
    ],
  }),
  component: BranchesPage,
});

const statusStyles: Record<Branch["status"], string> = {
  active: "border-success/30 bg-success/15 text-success",
  merged: "border-primary/30 bg-primary/15 text-primary",
  stale: "border-warning/30 bg-warning/15 text-warning",
};

function BranchesPage() {
  const [list, setList] = useState(seedBranches);
  const [current, setCurrent] = useState("main");
  const [name, setName] = useState("");
  const [open, setOpen] = useState(false);

  const create = (e: React.FormEvent) => {
    e.preventDefault();
    setList((prev) => [
      ...prev,
      {
        id: `b${Date.now()}`,
        name,
        base: current,
        author: "aarav.m",
        commitsAhead: 0,
        commitsBehind: 0,
        status: "active",
        updated: "just now",
      },
    ]);
    setOpen(false);
    setName("");
    toast.success(`Branch ${name} created from ${current}`);
  };

  return (
    <AppShell>
      <PageHeader
        title="Branches"
        description="Isolate risky migrations on a branch, then merge with full change visibility."
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="size-4" /> Create branch
              </Button>
            </DialogTrigger>
            <DialogContent>
              <form onSubmit={create}>
                <DialogHeader>
                  <DialogTitle>Create branch</DialogTitle>
                  <DialogDescription>
                    Branching is copy-on-write — no data is duplicated.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-2 py-5">
                  <Label htmlFor="branch-name">Branch name</Label>
                  <Input
                    id="branch-name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="feature/new-index"
                  />
                  <p className="text-xs text-muted-foreground">Based on {current}</p>
                </div>
                <DialogFooter>
                  <Button type="submit">Create branch</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      <Card className="surface-card">
        <CardHeader>
          <CardTitle className="text-base">Branch graph</CardTitle>
          <CardDescription>Visual topology relative to main</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative space-y-6 pl-6">
            <span className="absolute left-[7px] top-2 bottom-2 w-px bg-border" />
            {list.map((b, i) => (
              <div key={b.id} className="relative flex items-center gap-3">
                <span
                  className={cn(
                    "absolute -left-6 size-3.5 rounded-full border-2 border-background",
                    b.status === "active" ? "bg-primary" : "bg-muted-foreground",
                  )}
                />
                {i > 0 ? (
                  <span className="absolute -left-[18px] h-px w-4 bg-border" />
                ) : null}
                <span className="font-mono text-sm">{b.name}</span>
                <span className="text-xs text-success">+{b.commitsAhead}</span>
                <span className="text-xs text-destructive">-{b.commitsBehind}</span>
                {b.name === current ? (
                  <Badge variant="outline" className="border-accent/30 bg-accent/15 text-accent">
                    current
                  </Badge>
                ) : null}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {list.map((b) => (
          <Card key={b.id} className="surface-card">
            <CardHeader className="flex-row items-start justify-between space-y-0">
              <div className="min-w-0 space-y-1">
                <CardTitle className="flex items-center gap-2 truncate font-mono text-sm">
                  <GitBranch className="size-4 shrink-0 text-primary" />
                  {b.name}
                </CardTitle>
                <CardDescription>
                  from {b.base} · {b.author} · {b.updated}
                </CardDescription>
              </div>
              <Badge variant="outline" className={cn("capitalize", statusStyles[b.status])}>
                {b.status}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                <span className="text-success">{b.commitsAhead} ahead</span> ·{" "}
                <span className="text-destructive">{b.commitsBehind} behind</span>
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant={b.name === current ? "secondary" : "outline"}
                  disabled={b.name === current}
                  onClick={() => {
                    setCurrent(b.name);
                    toast.success(`Switched to ${b.name}`);
                  }}
                >
                  {b.name === current ? "Current" : "Switch"}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1.5"
                  disabled={b.name === "main"}
                  onClick={() =>
                    toast.success(`Merged ${b.name} into main`, {
                      description: `${b.commitsAhead} commits applied with no conflicts.`,
                    })
                  }
                >
                  <GitMerge className="size-3.5" /> Merge
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="gap-1.5 text-destructive hover:text-destructive"
                      disabled={b.name === "main"}
                    >
                      <Trash2 className="size-3.5" /> Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete {b.name}?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Unmerged commits on this branch will no longer be reachable.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => {
                          setList((prev) => prev.filter((x) => x.id !== b.id));
                          toast.success(`Branch ${b.name} deleted`);
                        }}
                      >
                        Delete branch
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
