import {
  ArrowDownToLine,
  FilePlus2,
  FileX2,
  PencilRuler,
  Trash2,
  Undo2,
  type LucideIcon,
} from "lucide-react";

import type { Operation } from "@/lib/mock-data";

export function operationBadge(op: Operation) {
  switch (op) {
    case "INSERT":
      return "border-success/30 bg-success/15 text-success font-mono text-[10px]";
    case "UPDATE":
    case "ALTER TABLE":
      return "border-warning/30 bg-warning/15 text-warning font-mono text-[10px]";
    case "DELETE":
    case "DROP TABLE":
      return "border-destructive/30 bg-destructive/15 text-destructive font-mono text-[10px]";
    case "ROLLBACK":
      return "border-accent/30 bg-accent/15 text-accent font-mono text-[10px]";
    default:
      return "border-primary/30 bg-primary/15 text-primary font-mono text-[10px]";
  }
}

export const operationIcon: Record<Operation, LucideIcon> = {
  INSERT: ArrowDownToLine,
  UPDATE: PencilRuler,
  DELETE: Trash2,
  "CREATE TABLE": FilePlus2,
  "DROP TABLE": FileX2,
  "ALTER TABLE": PencilRuler,
  ROLLBACK: Undo2,
};
