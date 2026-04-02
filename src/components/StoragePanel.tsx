import { useCloudStore } from "@/lib/cloud-store";
import { cn } from "@/lib/utils";
import { Plus, HardDrive } from "lucide-react";
import { useState } from "react";
import { CreateStorageDialog } from "./CreateStorageDialog";
import { motion } from "framer-motion";

export function StoragePanel() {
  const { storage, selectedProvider, allocateStorage } = useCloudStore();
  const filtered = selectedProvider === "All" ? storage : storage.filter((s) => s.provider === selectedProvider);
  const [allocating, setAllocating] = useState<string | null>(null);
  const [amount, setAmount] = useState("50");

  const handleAllocate = (id: string) => {
    const gb = parseInt(amount);
    if (gb > 0) {
      allocateStorage(id, gb);
      setAllocating(null);
      setAmount("50");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-xl"
    >
      <div className="border-b border-border/50 px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-accent/20 to-accent/5">
            <HardDrive className="h-3.5 w-3.5 text-accent" />
          </div>
          <h3 className="text-sm font-semibold">Storage Resources</h3>
        </div>
        <CreateStorageDialog />
      </div>
      <div className="space-y-3 p-4">
        {filtered.map((st, i) => {
          const pct = Math.round((st.usedGB / st.allocatedGB) * 100);
          return (
            <motion.div
              key={st.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-lg border border-border/40 p-3.5 hover:border-border/70 transition-colors bg-muted/10"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-mono text-xs font-semibold">{st.name}</p>
                  <p className="text-[11px] text-muted-foreground">{st.type} · <span className={cn(
                    st.provider === "AWS" && "text-aws",
                    st.provider === "Azure" && "text-azure",
                    st.provider === "GCP" && "text-gcp"
                  )}>{st.provider}</span></p>
                </div>
                <button
                  onClick={() => setAllocating(allocating === st.id ? null : st.id)}
                  className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[11px] font-medium text-accent bg-accent/10 hover:bg-accent/20 transition-colors"
                >
                  <Plus className="h-3 w-3" /> Allocate
                </button>
              </div>
              <div className="mt-3">
                <div className="flex justify-between text-[11px] text-muted-foreground mb-1.5">
                  <span className="font-mono">{st.usedGB} GB used</span>
                  <span className="font-mono">{st.allocatedGB} GB total</span>
                </div>
                <div className="h-2 rounded-full bg-muted/60 overflow-hidden">
                  <div
                    className={cn("h-full rounded-full transition-all duration-500",
                      pct > 80 ? "bg-gradient-to-r from-destructive/80 to-destructive" : pct > 60 ? "bg-gradient-to-r from-warning/80 to-warning" : "bg-gradient-to-r from-primary/80 to-primary"
                    )}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
              {allocating === st.id && (
                <div className="mt-3 flex gap-2 animate-fade-in">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-20 rounded-lg border border-border/60 bg-muted/40 px-2.5 py-1.5 text-xs font-mono"
                    min="1"
                  />
                  <span className="text-[11px] text-muted-foreground self-center">GB</span>
                  <button onClick={() => handleAllocate(st.id)} className="rounded-lg bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">
                    Confirm
                  </button>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
