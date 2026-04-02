import { useCloudStore } from "@/lib/cloud-store";
import { Play, Square, Server } from "lucide-react";
import { cn } from "@/lib/utils";
import { CreateVMDialog } from "./CreateVMDialog";
import { motion } from "framer-motion";

export function VMTable() {
  const { vms, selectedProvider, startVM, stopVM } = useCloudStore();
  const filtered = selectedProvider === "All" ? vms : vms.filter((v) => v.provider === selectedProvider);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-xl overflow-hidden"
    >
      <div className="border-b border-border/50 px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-primary/5">
            <Server className="h-3.5 w-3.5 text-primary" />
          </div>
          <h3 className="text-sm font-semibold">Virtual Machines</h3>
          <span className="text-[10px] font-mono text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-full">
            {filtered.length}
          </span>
        </div>
        <CreateVMDialog />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/40 bg-muted/20">
              <th className="px-5 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Name</th>
              <th className="px-5 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Provider</th>
              <th className="px-5 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
              <th className="px-5 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">CPU</th>
              <th className="px-5 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">RAM</th>
              <th className="px-5 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Cost/hr</th>
              <th className="px-5 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((vm, i) => (
              <motion.tr
                key={vm.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                className="border-b border-border/30 hover:bg-primary/[0.03] transition-colors"
              >
                <td className="px-5 py-3 font-mono text-xs font-medium">{vm.name}</td>
                <td className="px-5 py-3">
                  <span className={cn("inline-flex items-center gap-1 rounded-md bg-muted/50 px-2 py-0.5 text-[11px] font-bold",
                    vm.provider === "AWS" && "text-aws",
                    vm.provider === "Azure" && "text-azure",
                    vm.provider === "GCP" && "text-gcp"
                  )}>{vm.provider}</span>
                </td>
                <td className="px-5 py-3">
                  <span className={cn("inline-flex items-center gap-1.5 text-xs font-medium",
                    vm.status === "running" ? "text-success" : "text-muted-foreground"
                  )}>
                    <span className={cn("h-2 w-2 rounded-full",
                      vm.status === "running" ? "bg-success animate-pulse-glow" : "bg-muted-foreground/40"
                    )} />
                    {vm.status}
                  </span>
                </td>
                <td className="px-5 py-3 font-mono text-xs">{vm.cpu} vCPU</td>
                <td className="px-5 py-3 font-mono text-xs">{vm.ram} GB</td>
                <td className="px-5 py-3 font-mono text-xs font-medium">${vm.costPerHour}</td>
                <td className="px-5 py-3">
                  {vm.status === "running" ? (
                    <button onClick={() => stopVM(vm.id)} className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-destructive bg-destructive/10 hover:bg-destructive/20 transition-colors">
                      <Square className="h-3 w-3" /> Stop
                    </button>
                  ) : vm.status === "stopped" ? (
                    <button onClick={() => startVM(vm.id)} className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-success bg-success/10 hover:bg-success/20 transition-colors">
                      <Play className="h-3 w-3" /> Start
                    </button>
                  ) : null}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
