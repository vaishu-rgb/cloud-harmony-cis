import { useCloudStore } from "@/lib/cloud-store";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Download, ScrollText } from "lucide-react";
import { motion } from "framer-motion";

export function UsageLogs() {
  const { logs, selectedProvider } = useCloudStore();
  const filtered = selectedProvider === "All" ? logs : logs.filter((l) => l.provider === selectedProvider);

  const exportCSV = () => {
    if (filtered.length === 0) return;
    const header = "Timestamp,Provider,Action,Resource,Details";
    const rows = filtered.map((l) =>
      [l.timestamp.toISOString(), l.provider, l.action, l.resource, `"${l.details.replace(/"/g, '""')}"`].join(",")
    );
    const blob = new Blob([header + "\n" + rows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cloudsim-logs-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-xl"
    >
      <div className="flex items-center justify-between border-b border-border/50 px-5 py-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-chart-4/20 to-chart-4/5">
            <ScrollText className="h-3.5 w-3.5 text-[hsl(280,70%,60%)]" />
          </div>
          <h3 className="text-sm font-semibold">Usage Logs</h3>
          <span className="text-[10px] font-mono text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-full">
            {filtered.length}
          </span>
        </div>
        <Button variant="outline" size="sm" onClick={exportCSV} disabled={filtered.length === 0} className="text-xs gap-1.5 h-8 border-border/60">
          <Download className="h-3.5 w-3.5" />
          Export
        </Button>
      </div>
      <ScrollArea className="h-64">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-10 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted/40 mb-3">
              <ScrollText className="h-5 w-5 text-muted-foreground/60" />
            </div>
            <p className="text-xs text-muted-foreground">
              No operations logged yet. Start/stop VMs or allocate storage to see logs.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border/30">
            {filtered.map((log, i) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.02 }}
                className="flex items-start gap-3 px-5 py-3 hover:bg-primary/[0.02] transition-colors"
              >
                <span className={cn("mt-1 h-2 w-2 shrink-0 rounded-full ring-2",
                  log.provider === "AWS" && "bg-aws ring-aws/20",
                  log.provider === "Azure" && "bg-azure ring-azure/20",
                  log.provider === "GCP" && "bg-gcp ring-gcp/20"
                )} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] font-bold text-primary">{log.action}</span>
                    <span className="font-mono text-[11px] text-muted-foreground">{log.resource}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground/70 truncate">{log.details}</p>
                </div>
                <span className="shrink-0 text-[10px] text-muted-foreground/60 font-mono">
                  {log.timestamp.toLocaleTimeString()}
                </span>
              </motion.div>
            ))}
          </div>
        )}
      </ScrollArea>
    </motion.div>
  );
}
