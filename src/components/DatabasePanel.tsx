import { useCloudStore } from "@/lib/cloud-store";
import { cn } from "@/lib/utils";
import { Database as DatabaseIcon } from "lucide-react";
import { motion } from "framer-motion";

export function DatabasePanel() {
  const { databases, selectedProvider, toggleDatabase } = useCloudStore();
  const filtered = selectedProvider === "All" ? databases : databases.filter((d) => d.provider === selectedProvider);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-xl"
    >
      <div className="border-b border-border/50 px-5 py-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-warning/20 to-warning/5">
            <DatabaseIcon className="h-3.5 w-3.5 text-warning" />
          </div>
          <h3 className="text-sm font-semibold">Databases</h3>
          <span className="text-[10px] font-mono text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-full">
            {filtered.length}
          </span>
        </div>
      </div>
      <div className="space-y-2.5 p-4">
        {filtered.map((db, i) => (
          <motion.div
            key={db.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center justify-between rounded-lg border border-border/40 p-3.5 hover:border-border/70 transition-colors bg-muted/10"
          >
            <div>
              <p className="font-mono text-xs font-semibold">{db.name}</p>
              <p className="text-[11px] text-muted-foreground">
                {db.engine} · {db.sizeGB}GB ·{" "}
                <span className={cn(
                  db.provider === "AWS" && "text-aws",
                  db.provider === "Azure" && "text-azure",
                  db.provider === "GCP" && "text-gcp"
                )}>{db.provider}</span>
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className={cn("inline-flex items-center gap-1.5 text-[11px] font-semibold",
                db.status === "active" ? "text-success" : "text-muted-foreground"
              )}>
                <span className={cn("h-1.5 w-1.5 rounded-full",
                  db.status === "active" ? "bg-success animate-pulse-glow" : "bg-muted-foreground/40"
                )} />
                {db.status}
              </span>
              <button
                onClick={() => toggleDatabase(db.id)}
                className={cn("rounded-lg px-3 py-1.5 text-[11px] font-semibold transition-colors",
                  db.status === "active"
                    ? "text-destructive bg-destructive/10 hover:bg-destructive/20"
                    : "text-success bg-success/10 hover:bg-success/20"
                )}
              >
                {db.status === "active" ? "Deactivate" : "Activate"}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
