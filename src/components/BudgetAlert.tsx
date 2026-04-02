import { useEffect, useRef, useState } from "react";
import { useCloudStore } from "@/lib/cloud-store";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle, DollarSign, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const THRESHOLDS = [0.5, 0.75, 0.9, 1.0];

export function BudgetAlert() {
  const sessionCost = useCloudStore((s) => s.sessionCost);
  const budgetLimit = useCloudStore((s) => s.budgetLimit);
  const setBudgetLimit = useCloudStore((s) => s.setBudgetLimit);
  const [inputValue, setInputValue] = useState(String(budgetLimit));
  const notifiedRef = useRef(new Set<number>());

  useEffect(() => {
    setInputValue(String(budgetLimit));
  }, [budgetLimit]);

  useEffect(() => {
    if (budgetLimit <= 0) return;
    const ratio = sessionCost / budgetLimit;
    for (const t of THRESHOLDS) {
      if (ratio >= t && !notifiedRef.current.has(t)) {
        notifiedRef.current.add(t);
        const pct = Math.round(t * 100);
        if (t >= 1.0) {
          toast.error(`🚨 Budget exceeded! Session cost $${sessionCost.toFixed(2)} has passed your $${budgetLimit} limit.`, { duration: 8000 });
        } else {
          toast.warning(`⚠️ ${pct}% of budget used — $${sessionCost.toFixed(2)} of $${budgetLimit}`, { duration: 5000 });
        }
      }
    }
  }, [sessionCost, budgetLimit]);

  useEffect(() => {
    notifiedRef.current.clear();
  }, [budgetLimit]);

  const handleBlur = () => {
    const val = parseFloat(inputValue);
    if (!isNaN(val) && val > 0 && val <= 100000) {
      setBudgetLimit(Math.round(val * 100) / 100);
    } else {
      setInputValue(String(budgetLimit));
    }
  };

  const ratio = budgetLimit > 0 ? Math.min(sessionCost / budgetLimit, 1) : 0;
  const isOver = sessionCost >= budgetLimit && budgetLimit > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="glass-card card-hover rounded-xl p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/5">
            <Shield className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold">Budget Guard</h3>
            <p className="text-[10px] text-muted-foreground">Real-time cost monitoring</p>
          </div>
        </div>
        <AnimatePresence>
          {isOver && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center gap-1.5 rounded-full bg-destructive/15 px-3 py-1.5 text-xs font-semibold text-destructive"
            >
              <AlertTriangle className="h-3 w-3" />
              Over Budget
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex items-end gap-6">
        <div className="space-y-2">
          <Label htmlFor="budget-limit" className="text-[11px] text-muted-foreground font-medium">
            Session limit
          </Label>
          <div className="relative">
            <DollarSign className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              id="budget-limit"
              type="number"
              min={1}
              max={100000}
              step={1}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onBlur={handleBlur}
              onKeyDown={(e) => e.key === "Enter" && handleBlur()}
              className="h-9 w-28 pl-7 font-mono text-sm bg-muted/50"
            />
          </div>
        </div>
        <div className="flex-1">
          <div className="flex justify-between text-[11px] text-muted-foreground mb-2">
            <span className="font-mono font-medium">${sessionCost.toFixed(2)} spent</span>
            <span className="font-mono">${budgetLimit} limit</span>
          </div>
          <div className="h-3 rounded-full bg-muted/60 overflow-hidden relative">
            <motion.div
              className={`h-full rounded-full ${
                ratio >= 1
                  ? "bg-gradient-to-r from-destructive/80 to-destructive"
                  : ratio >= 0.75
                  ? "bg-gradient-to-r from-warning/80 to-warning"
                  : "bg-gradient-to-r from-primary/80 to-primary"
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${ratio * 100}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </div>
          <div className="flex justify-between mt-1.5">
            {[25, 50, 75, 100].map((pct) => (
              <span key={pct} className={`text-[9px] font-mono ${ratio * 100 >= pct ? "text-foreground/60" : "text-muted-foreground/40"}`}>
                {pct}%
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
