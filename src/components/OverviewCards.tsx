import { useCloudStore } from "@/lib/cloud-store";
import { motion } from "framer-motion";
import { Server, HardDrive, Database, DollarSign, Activity } from "lucide-react";
import { useMemo, useEffect } from "react";

const iconContainerColors = [
  "from-primary/20 to-primary/5",
  "from-accent/20 to-accent/5",
  "from-warning/20 to-warning/5",
  "from-primary/20 to-primary/5",
  "from-destructive/20 to-destructive/5",
];

export function OverviewCards() {
  const vms = useCloudStore((s) => s.vms);
  const storage = useCloudStore((s) => s.storage);
  const databases = useCloudStore((s) => s.databases);
  const selected = useCloudStore((s) => s.selectedProvider);
  const sessionCost = useCloudStore((s) => s.sessionCost);
  const tickSessionCost = useCloudStore((s) => s.tickSessionCost);

  useEffect(() => {
    const id = setInterval(tickSessionCost, 3000);
    return () => clearInterval(id);
  }, [tickSessionCost]);

  const totals = useMemo(() => {
    const providers = selected === "All" ? ["AWS", "Azure", "GCP"] as const : [selected] as const;
    const fVMs = vms.filter((v) => providers.includes(v.provider as any));
    const fSt = storage.filter((s) => providers.includes(s.provider as any));
    const fDb = databases.filter((d) => providers.includes(d.provider as any));
    return {
      runningVMs: fVMs.filter((v) => v.status === "running").length,
      totalVMs: fVMs.length,
      usedStorageGB: fSt.reduce((a, s) => a + s.usedGB, 0),
      totalStorageGB: fSt.reduce((a, s) => a + s.allocatedGB, 0),
      activeDatabases: fDb.filter((d) => d.status === "active").length,
      totalDatabases: fDb.length,
      monthlyCost:
        fVMs.filter((v) => v.status === "running").reduce((a, v) => a + v.costPerHour * 730, 0) +
        fSt.reduce((a, s) => a + s.allocatedGB * s.costPerGB, 0) +
        fDb.filter((d) => d.status === "active").reduce((a, d) => a + d.costPerHour * 730, 0),
    };
  }, [vms, storage, databases, selected]);

  const cards = [
    { label: "Virtual Machines", value: `${totals.runningVMs}/${totals.totalVMs}`, sub: "Running", icon: Server, color: "text-primary" },
    { label: "Storage", value: `${totals.usedStorageGB.toLocaleString()} GB`, sub: `of ${totals.totalStorageGB.toLocaleString()} GB`, icon: HardDrive, color: "text-accent" },
    { label: "Databases", value: `${totals.activeDatabases}/${totals.totalDatabases}`, sub: "Active", icon: Database, color: "text-warning" },
    { label: "Est. Monthly Cost", value: `$${totals.monthlyCost.toFixed(0)}`, sub: "Projected", icon: DollarSign, color: "text-primary" },
    { label: "Live Session Cost", value: `$${sessionCost.toFixed(2)}`, sub: "Accruing in real-time", icon: Activity, color: "text-destructive" },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {cards.map((card, i) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06, duration: 0.4, ease: "easeOut" }}
          className="group glass-card card-hover rounded-xl p-5 relative overflow-hidden"
        >
          {/* Subtle gradient overlay */}
          <div className={`absolute inset-0 bg-gradient-to-br ${iconContainerColors[i]} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
          
          <div className="relative">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-muted-foreground">{card.label}</p>
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${iconContainerColors[i]}`}>
                <card.icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </div>
            <motion.p
              key={card.value}
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 0.3 }}
              className="mt-3 text-2xl font-bold font-mono tracking-tight"
            >
              {card.value}
            </motion.p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">{card.sub}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
