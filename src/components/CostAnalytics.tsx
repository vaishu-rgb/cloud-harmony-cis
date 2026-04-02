import { useCloudStore } from "@/lib/cloud-store";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from "recharts";
import { useMemo } from "react";
import { CloudProvider } from "@/lib/cloud-types";
import { motion } from "framer-motion";
import { BarChart3, PieChart as PieIcon, TrendingUp } from "lucide-react";

const COLORS = ["hsl(33, 100%, 50%)", "hsl(213, 90%, 55%)", "hsl(4, 85%, 58%)"];
const PROVIDERS: CloudProvider[] = ["AWS", "Azure", "GCP"];

const tooltipStyle = {
  background: "hsl(225, 22%, 9%)",
  border: "1px solid hsl(225, 16%, 18%)",
  borderRadius: 10,
  fontSize: 11,
  boxShadow: "0 10px 30px -8px rgba(0,0,0,0.5)",
};

export function CostAnalytics() {
  const vms = useCloudStore((s) => s.vms);
  const storage = useCloudStore((s) => s.storage);
  const databases = useCloudStore((s) => s.databases);

  const { costData, vmData, storageData } = useMemo(() => {
    return {
      costData: PROVIDERS.map((p) => ({
        name: p,
        cost: Math.round(
          vms.filter((v) => v.provider === p && v.status === "running").reduce((a, v) => a + v.costPerHour * 730, 0) +
          storage.filter((s) => s.provider === p).reduce((a, s) => a + s.allocatedGB * s.costPerGB, 0) +
          databases.filter((d) => d.provider === p && d.status === "active").reduce((a, d) => a + d.costPerHour * 730, 0)
        ),
      })),
      vmData: PROVIDERS.map((p) => {
        const pVMs = vms.filter((v) => v.provider === p);
        return { name: p, running: pVMs.filter((v) => v.status === "running").length, stopped: pVMs.filter((v) => v.status !== "running").length };
      }),
      storageData: PROVIDERS.map((p, i) => ({
        name: p,
        value: storage.filter((s) => s.provider === p).reduce((a, s) => a + s.usedGB, 0),
        color: COLORS[i],
      })),
    };
  }, [vms, storage, databases]);

  const chartCards = [
    {
      title: "Monthly Cost Comparison",
      icon: BarChart3,
      iconColor: "text-aws",
      iconBg: "from-aws/20 to-aws/5",
      chart: (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={costData} barCategoryGap="30%">
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(225, 16%, 13%)" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(218, 14%, 48%)" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "hsl(218, 14%, 48%)" }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: "hsl(210, 25%, 92%)" }} cursor={{ fill: "hsl(225, 16%, 12%)" }} />
            <Bar dataKey="cost" radius={[6, 6, 0, 0]}>
              {costData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      ),
    },
    {
      title: "VM Status by Provider",
      icon: TrendingUp,
      iconColor: "text-success",
      iconBg: "from-success/20 to-success/5",
      chart: (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={vmData} barCategoryGap="25%">
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(225, 16%, 13%)" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(218, 14%, 48%)" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "hsl(218, 14%, 48%)" }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: "hsl(210, 25%, 92%)" }} cursor={{ fill: "hsl(225, 16%, 12%)" }} />
            <Bar dataKey="running" fill="hsl(152, 69%, 40%)" radius={[6, 6, 0, 0]} name="Running" />
            <Bar dataKey="stopped" fill="hsl(218, 14%, 30%)" radius={[6, 6, 0, 0]} name="Stopped" />
          </BarChart>
        </ResponsiveContainer>
      ),
    },
    {
      title: "Storage Distribution",
      icon: PieIcon,
      iconColor: "text-accent",
      iconBg: "from-accent/20 to-accent/5",
      chart: (
        <>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={storageData} cx="50%" cy="50%" innerRadius={48} outerRadius={75} paddingAngle={3} dataKey="value" strokeWidth={0}>
                {storageData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: "hsl(210, 25%, 92%)" }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-1 flex justify-center gap-4">
            {storageData.map((s) => (
              <div key={s.name} className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-medium">
                <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: s.color }} />
                {s.name}
              </div>
            ))}
          </div>
        </>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      {chartCards.map((card, i) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 }}
          className="glass-card card-hover rounded-xl p-5"
        >
          <div className="flex items-center gap-2.5 mb-4">
            <div className={`flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br ${card.iconBg}`}>
              <card.icon className={`h-3.5 w-3.5 ${card.iconColor}`} />
            </div>
            <h3 className="text-xs font-semibold">{card.title}</h3>
          </div>
          {card.chart}
        </motion.div>
      ))}
    </div>
  );
}
